package com.truckmitra.repository.specification;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.common.enums.TripStatus;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TripSpecification {

    public static Specification<Trip> getCompletedTrips(Long userId, String role, String search, String dateFilter, LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Status must be COMPLETED
            predicates.add(criteriaBuilder.equal(root.get("status"), TripStatus.COMPLETED));

            // 2. Filter by User Role
            if ("DRIVER".equalsIgnoreCase(role)) {
                predicates.add(criteriaBuilder.equal(root.get("driver").get("id"), userId));
            } else if ("TRANSPORTER".equalsIgnoreCase(role)) {
                predicates.add(criteriaBuilder.equal(root.get("transporter").get("id"), userId));
            }

            // 3. Date Filters on completedAt
            if (dateFilter != null && !dateFilter.isEmpty()) {
                LocalDate now = LocalDate.now();
                switch (dateFilter.toLowerCase()) {
                    case "today":
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("completedAt"), now.atStartOfDay()));
                        break;
                    case "this_week":
                        LocalDate startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1);
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("completedAt"), startOfWeek.atStartOfDay()));
                        break;
                    case "this_month":
                        LocalDate startOfMonth = now.withDayOfMonth(1);
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("completedAt"), startOfMonth.atStartOfDay()));
                        break;
                    case "custom":
                        if (startDate != null) {
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("completedAt"), startDate.atStartOfDay()));
                        }
                        if (endDate != null) {
                            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("completedAt"), endDate.atTime(23, 59, 59)));
                        }
                        break;
                }
            }

            // 4. Search text
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate tripNumberMatches = criteriaBuilder.like(criteriaBuilder.lower(root.get("tripNumber")), searchPattern);
                // Also search in vehicle registration
                Predicate vehicleMatches = criteriaBuilder.like(criteriaBuilder.lower(root.get("vehicle").get("registrationNumber")), searchPattern);
                // Search in driver name
                Predicate driverMatches = criteriaBuilder.like(criteriaBuilder.lower(root.get("driver").get("fullName")), searchPattern);
                
                predicates.add(criteriaBuilder.or(tripNumberMatches, vehicleMatches, driverMatches));
            }

            // Need to handle N+1 by eager fetching load, bid, shipper, transporter if this is a fetch query
            if (Long.class != query.getResultType()) {
                root.fetch("load", jakarta.persistence.criteria.JoinType.LEFT);
                root.fetch("bid", jakarta.persistence.criteria.JoinType.LEFT);
                root.fetch("shipper", jakarta.persistence.criteria.JoinType.LEFT);
                root.fetch("transporter", jakarta.persistence.criteria.JoinType.LEFT);
            }

            // Sort by completedAt descending
            query.orderBy(criteriaBuilder.desc(root.get("completedAt")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
