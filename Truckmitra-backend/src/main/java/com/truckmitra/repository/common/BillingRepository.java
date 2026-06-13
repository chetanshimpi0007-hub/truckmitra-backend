package com.truckmitra.repository.common;

import com.truckmitra.entity.common.BillingDetails;
import com.truckmitra.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingRepository extends JpaRepository<BillingDetails, Long> {
    java.util.Optional<BillingDetails> findByUser(User user);
}
