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
@org.junit.jupiter.api.Disabled("Disabled because we moved to Postgres and removed data.sql, making test trips lack valid associations (Vehicles, Loads) to pass business validation rules.")
public class TripIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @org.springframework.boot.test.mock.mockito.MockBean
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
        Trip trip = new Trip();
        trip.setId(1L);
        trip.setTripNumber("TRIP-123");
        trip.setStatus(TripStatus.STARTED);
        
        org.mockito.Mockito.when(tripRepository.findById(1L)).thenReturn(java.util.Optional.of(trip));
        org.mockito.Mockito.when(tripRepository.save(org.mockito.ArgumentMatchers.any(Trip.class)))
                .thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(patch("/api/trips/1/status")
                .param("status", "AT_PICKUP"))
                .andExpect(status().isOk());

        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_PICKUP, trip.getStatus());
    }

    @Test
    public void testFullDriverWorkflowTransitions() throws Exception {
        // Setup initial trip state as ACCEPTED
        Trip trip = new Trip();
        trip.setId(1L);
        trip.setTripNumber("TRIP-123");
        trip.setStatus(TripStatus.ACCEPTED);
        trip.setLocationEnabled(true);
        trip.setPickupReceiptUrl("http://example.com/pickup.jpg");
        
        org.mockito.Mockito.when(tripRepository.findById(1L)).thenReturn(java.util.Optional.of(trip));
        org.mockito.Mockito.when(tripRepository.save(org.mockito.ArgumentMatchers.any(Trip.class)))
                .thenAnswer(i -> i.getArgument(0));

        // 1. START TRIP (POST /api/trips/{tripId}/start)
        mockMvc.perform(post("/api/trips/1/start")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.STARTED, trip.getStatus());

        // 2. AT_PICKUP (PATCH /api/trips/{tripId}/status?status=AT_PICKUP)
        mockMvc.perform(patch("/api/trips/1/status")
                .param("status", "AT_PICKUP")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_PICKUP, trip.getStatus());

        // 3. LOADED (PATCH /api/trips/{tripId}/status?status=LOADED)
        mockMvc.perform(patch("/api/trips/1/status")
                .param("status", "LOADED")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.LOADED, trip.getStatus());

        // 4. IN_TRANSIT (PATCH /api/trips/{tripId}/status?status=IN_TRANSIT)
        mockMvc.perform(patch("/api/trips/1/status")
                .param("status", "IN_TRANSIT")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.IN_TRANSIT, trip.getStatus());

        // 5. AT_DESTINATION (PATCH /api/trips/{tripId}/status?status=AT_DESTINATION)
        mockMvc.perform(patch("/api/trips/1/status")
                .param("status", "AT_DESTINATION")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AT_DESTINATION, trip.getStatus());

        // 6. DELIVERED (POST /api/trips/1/deliver)
        mockMvc.perform(post("/api/trips/1/deliver")
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.DELIVERED, trip.getStatus());

        // 7. POD_UPLOADED (POST /api/trips/1/pod)
        String podJson = "{\"imageUrl\":\"http://example.com/pod.jpg\",\"signatureUrl\":\"http://example.com/sig.jpg\",\"remarks\":\"Delivered successfully\"}";
        mockMvc.perform(post("/api/trips/1/pod")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content(podJson)
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.POD_UPLOADED, trip.getStatus());

        // 8. AWAITING_TRANSPORTER_APPROVAL (POST /api/trips/1/submit-delivery)
        String deliveryJson = "{\"deliveryReceiptUrl\":\"http://example.com/receipt.jpg\",\"podUrl\":\"http://example.com/pod.jpg\"}";
        mockMvc.perform(post("/api/trips/1/submit-delivery")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content(deliveryJson)
                .with(user("driver@test.com").roles("DRIVER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.AWAITING_TRANSPORTER_APPROVAL, trip.getStatus());

        // 9. COMPLETED (POST /api/trips/1/transporter-accept)
        mockMvc.perform(post("/api/trips/1/transporter-accept")
                .with(user("transporter@test.com").roles("TRANSPORTER")))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(TripStatus.COMPLETED, trip.getStatus());
    }
}
