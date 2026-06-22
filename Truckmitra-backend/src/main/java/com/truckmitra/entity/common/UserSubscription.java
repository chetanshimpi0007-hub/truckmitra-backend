package com.truckmitra.entity.common;

import jakarta.persistence.Column;
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
@Table(name = "user_subscriptions")
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    @Column(name = "startdate")
    private LocalDateTime startDate;
    
    @Column(name = "enddate")
    private LocalDateTime endDate;

    @Column(name = "autorenew")
    @Builder.Default
    private Boolean autoRenew = true;

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, CANCELLED

    @Column(name = "razorpaysubscriptionid")
    private String razorpaySubscriptionId;

    @Column(name = "razorpaycustomerid")
    private String razorpayCustomerId;

}
