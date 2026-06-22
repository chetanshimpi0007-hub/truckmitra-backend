package com.truckmitra.repository.common;

import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByUser(User user);
    Optional<UserSubscription> findByRazorpaySubscriptionId(String razorpaySubscriptionId);
}
