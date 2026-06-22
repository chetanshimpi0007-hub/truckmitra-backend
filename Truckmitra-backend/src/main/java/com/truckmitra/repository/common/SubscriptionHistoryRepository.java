package com.truckmitra.repository.common;

import com.truckmitra.entity.common.SubscriptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionHistoryRepository extends JpaRepository<SubscriptionHistory, Long> {
    List<SubscriptionHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SubscriptionHistory> findByRazorpaySubscriptionId(String subscriptionId);
}
