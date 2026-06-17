package com.truckmitra.service.impl;

import com.truckmitra.dto.response.AdminActivityDashboardStatsDto;
import com.truckmitra.entity.AuditLog;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.DriverAvailabilityStatus;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.AuditLogRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.service.AdminActivityService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminActivityServiceImpl implements AdminActivityService {

    private final TripRepository tripRepository;
    private final AuditLogRepository auditLogRepository;

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public AdminActivityDashboardStatsDto getDashboardStats() {
        long totalLoads = (Long) entityManager.createQuery("SELECT COUNT(l) FROM Load l").getSingleResult();
        long totalTrips = (Long) entityManager.createQuery("SELECT COUNT(t) FROM Trip t").getSingleResult();
        
        long activeTrips = (Long) entityManager.createQuery("SELECT COUNT(t) FROM Trip t WHERE t.status IN :statuses")
                .setParameter("statuses", List.of(TripStatus.ASSIGNED, TripStatus.VEHICLE_ASSIGNED, TripStatus.ACCEPTED, TripStatus.STARTED, TripStatus.IN_TRANSIT, TripStatus.AT_DESTINATION))
                .getSingleResult();
                
        long completedTrips = (Long) entityManager.createQuery("SELECT COUNT(t) FROM Trip t WHERE t.status = :status")
                .setParameter("status", TripStatus.COMPLETED)
                .getSingleResult();

        // Pending POD: POD Uploaded or Delivered (waiting for POD or transporter approval)
        long pendingPod = (Long) entityManager.createQuery("SELECT COUNT(t) FROM Trip t WHERE t.status IN :statuses")
                .setParameter("statuses", List.of(TripStatus.POD_UPLOADED, TripStatus.DELIVERED, TripStatus.AWAITING_TRANSPORTER_APPROVAL))
                .getSingleResult();

        long availableDrivers = (Long) entityManager.createQuery("SELECT COUNT(d) FROM Driver d WHERE d.availabilityStatus = :status")
                .setParameter("status", DriverAvailabilityStatus.AVAILABLE)
                .getSingleResult();

        long driversOnTrip = (Long) entityManager.createQuery("SELECT COUNT(d) FROM Driver d WHERE d.availabilityStatus = :status")
                .setParameter("status", DriverAvailabilityStatus.ON_TRIP)
                .getSingleResult();

        long approvedUsers = (Long) entityManager.createQuery("SELECT COUNT(u) FROM User u WHERE u.accountStatus = :status")
                .setParameter("status", AccountStatus.VERIFIED)
                .getSingleResult();

        long pendingUsers = (Long) entityManager.createQuery("SELECT COUNT(u) FROM User u WHERE u.accountStatus = :status")
                .setParameter("status", AccountStatus.PENDING_VERIFICATION)
                .getSingleResult();

        return AdminActivityDashboardStatsDto.builder()
                .totalLoads(totalLoads)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .completedTrips(completedTrips)
                .pendingPod(pendingPod)
                .availableDrivers(availableDrivers)
                .driversOnTrip(driversOnTrip)
                .approvedUsers(approvedUsers)
                .pendingUsers(pendingUsers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getTimeline(int limit) {
        return entityManager.createQuery("SELECT a FROM AuditLog a ORDER BY a.timestamp DESC", AuditLog.class)
                .setMaxResults(limit)
                .getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trip> getTripsMaster(String search, Pageable pageable) {
        String baseQuery = "FROM Trip t " +
                "LEFT JOIN FETCH t.load l " +
                "LEFT JOIN FETCH t.shipper s " +
                "LEFT JOIN FETCH t.transporter tr " +
                "LEFT JOIN FETCH t.driver d " +
                "LEFT JOIN FETCH t.vehicle v ";
                
        String countBaseQuery = "SELECT COUNT(t) FROM Trip t " +
                "LEFT JOIN t.load l " +
                "LEFT JOIN t.shipper s " +
                "LEFT JOIN t.transporter tr " +
                "LEFT JOIN t.driver d " +
                "LEFT JOIN t.vehicle v ";

        String whereClause = "";
        if (search != null && !search.trim().isEmpty()) {
            whereClause = "WHERE LOWER(t.tripNumber) LIKE :search " +
                          "OR LOWER(t.source) LIKE :search " +
                          "OR LOWER(t.destination) LIKE :search " +
                          "OR LOWER(d.firstName) LIKE :search " +
                          "OR LOWER(d.lastName) LIKE :search " +
                          "OR LOWER(tr.firstName) LIKE :search " +
                          "OR LOWER(tr.companyName) LIKE :search " +
                          "OR LOWER(s.firstName) LIKE :search " +
                          "OR LOWER(v.vehicleNumber) LIKE :search ";
        }

        String orderClause = "ORDER BY t.createdAt DESC";

        var query = entityManager.createQuery("SELECT t " + baseQuery + whereClause + orderClause, Trip.class);
        var countQuery = entityManager.createQuery(countBaseQuery + whereClause, Long.class);

        if (search != null && !search.trim().isEmpty()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            query.setParameter("search", pattern);
            countQuery.setParameter("search", pattern);
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Trip> trips = query.getResultList();
        Long total = countQuery.getSingleResult();

        return new PageImpl<>(trips, pageable, total);
    }
}
