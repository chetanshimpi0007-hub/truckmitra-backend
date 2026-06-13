package com.truckmitra.integration;

import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.TripRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class TripIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TripRepository tripRepository;

    @Test
    public void testCorsPreflightForPatch() throws Exception {
        mockMvc.perform(options("/api/trips/1/status")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "PATCH")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, org.hamcrest.Matchers.containsString("PATCH")))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }

    @Test
    @WithMockUser(username = "driver@test.com", roles = {"DRIVER"})
    public void testPatchStatusTransition() throws Exception {
        Trip trip = tripRepository.findById(1L).orElseThrow(() -> new AssertionError("Seed Trip ID 1 not found"));
        trip.setStatus(TripStatus.STARTED);
        tripRepository.save(trip);

        mockMvc.perform(patch("/api/trips/" + trip.getId() + "/status")
                .param("status", "AT_PICKUP"))
                .andExpect(status().isOk());

        Trip updated = tripRepository.findById(trip.getId()).orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_PICKUP, updated.getStatus());
    }

    @Test
    public void testFullDriverWorkflowTransitions() throws Exception {
        // Setup initial trip state as ACCEPTED
        Trip trip = tripRepository.findById(1L).orElseThrow(() -> new AssertionError("Seed Trip ID 1 not found"));
        trip.setStatus(TripStatus.ACCEPTED);
        trip.setLocationEnabled(true);
        trip.setPickupReceiptUrl("http://example.com/pickup.jpg");
        tripRepository.save(trip);

        // 1. START TRIP (POST /api/trips/{tripId}/start)
        mockMvc.perform(post("/api/trips/" + trip.getId() + "/start")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.STARTED, tripRepository.findById(trip.getId()).get().getStatus());

        // 2. AT_PICKUP (PATCH /api/trips/{tripId}/status?status=AT_PICKUP)
        mockMvc.perform(patch("/api/trips/" + trip.getId() + "/status")
                .param("status", "AT_PICKUP")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_PICKUP, tripRepository.findById(trip.getId()).get().getStatus());

        // 3. LOADED (PATCH /api/trips/{tripId}/status?status=LOADED)
        mockMvc.perform(patch("/api/trips/" + trip.getId() + "/status")
                .param("status", "LOADED")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.LOADED, tripRepository.findById(trip.getId()).get().getStatus());

        // 4. IN_TRANSIT (PATCH /api/trips/{tripId}/status?status=IN_TRANSIT)
        mockMvc.perform(patch("/api/trips/" + trip.getId() + "/status")
                .param("status", "IN_TRANSIT")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.IN_TRANSIT, tripRepository.findById(trip.getId()).get().getStatus());

        // 5. AT_DESTINATION (PATCH /api/trips/{tripId}/status?status=AT_DESTINATION)
        mockMvc.perform(patch("/api/trips/" + trip.getId() + "/status")
                .param("status", "AT_DESTINATION")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_DESTINATION, tripRepository.findById(trip.getId()).get().getStatus());

        // 6. DELIVERED (POST /api/trips/" + trip.getId() + "/deliver)
        mockMvc.perform(post("/api/trips/" + trip.getId() + "/deliver")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.DELIVERED, tripRepository.findById(trip.getId()).get().getStatus());

        // 7. POD_UPLOADED (POST /api/trips/" + trip.getId() + "/pod)
        String podJson = "{\"imageUrl\":\"http://example.com/pod.jpg\",\"signatureUrl\":\"http://example.com/sig.jpg\",\"remarks\":\"Delivered successfully\"}";
        mockMvc.perform(post("/api/trips/" + trip.getId() + "/pod")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content(podJson)
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.POD_UPLOADED, tripRepository.findById(trip.getId()).get().getStatus());

        // 8. AWAITING_TRANSPORTER_APPROVAL (POST /api/trips/" + trip.getId() + "/submit-delivery)
        String deliveryJson = "{\"deliveryReceiptUrl\":\"http://example.com/receipt.jpg\",\"podUrl\":\"http://example.com/pod.jpg\"}";
        mockMvc.perform(post("/api/trips/" + trip.getId() + "/submit-delivery")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content(deliveryJson)
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AWAITING_TRANSPORTER_APPROVAL, tripRepository.findById(trip.getId()).get().getStatus());

        // 9. COMPLETED (POST /api/trips/" + trip.getId() + "/transporter-accept)
        mockMvc.perform(post("/api/trips/" + trip.getId() + "/transporter-accept")
                .with(user("transporter@test.com").roles("TRANSPORTER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.COMPLETED, tripRepository.findById(trip.getId()).get().getStatus());
    }
}
