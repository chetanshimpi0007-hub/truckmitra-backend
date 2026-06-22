package com.truckmitra.entity.common;

import com.truckmitra.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscription_history")
public class SubscriptionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    private String razorpayPaymentId;

    private String razorpaySubscriptionId;

    private String razorpaySignature;

    private Double amount;

    private String currency;

    private String status; // SUCCESS, FAILED, PENDING

    private String eventType; // CHARGED, CANCELLED, ACTIVATED

    private LocalDateTime createdAt;
}
