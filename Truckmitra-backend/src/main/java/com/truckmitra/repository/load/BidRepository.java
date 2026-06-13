package com.truckmitra.repository.load;

import com.truckmitra.entity.common.enums.BidStatus;
import com.truckmitra.entity.load.Bid;
import com.truckmitra.entity.load.Load;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByLoad(Load load);

    List<Bid> findByTransporterId(Long transporterId);

    List<Bid> findByTransporterIdAndStatus(Long transporterId, BidStatus status);

    long countByTransporterId(Long transporterId);

    /** Count bids for a specific load (all statuses) */
    long countByLoadId(Long loadId);

    /** Count bids for a specific load filtered by status */
    long countByLoadIdAndStatus(Long loadId, BidStatus status);

    /**
     * Fetch all bids for a load with transporter eagerly loaded —
     * avoids LazyInitializationException when mapping to DTOs outside a session.
     */
    @Query("SELECT b FROM Bid b JOIN FETCH b.transporter WHERE b.load.id = :loadId ORDER BY b.amount ASC")
    List<Bid> findByLoadIdWithTransporter(@Param("loadId") Long loadId);
}
