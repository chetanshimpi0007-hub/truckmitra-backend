package com.truckmitra.entity.rating;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import com.truckmitra.entity.load.Trip;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_id", nullable = false)
    private User rated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Column(name = "load_id")
    private Long loadId;

    @Column(name = "bid_id")
    private Long bidId;

    @Column(name = "rating_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RatingType ratingType;

    @Column(name = "ratingvalue", nullable = false)
    private Integer ratingValue; // 1 to 5

    @Column(length = 1000)
    private String comment;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "helpful_count", nullable = false)
    private Integer helpfulCount = 0;

    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous = false;

    @Column(name = "is_flagged", nullable = false)
    private Boolean isFlagged = false;

    @Column(name = "is_response_given", nullable = false)
    private Boolean isResponseGiven = false;

    @Column(name = "response_comment", length = 1000)
    private String responseComment;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
