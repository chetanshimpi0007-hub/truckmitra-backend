package com.truckmitra.repository.user;

import com.truckmitra.entity.user.DeviceToken;
import com.truckmitra.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    List<DeviceToken> findByUserAndIsActiveTrue(User user);

    List<DeviceToken> findByUserIdAndIsActiveTrue(Long userId);

    Optional<DeviceToken> findByToken(String token);

    @Modifying
    @Query("UPDATE DeviceToken d SET d.isActive = false WHERE d.user.id = :userId")
    void deactivateAllTokensForUser(Long userId);

    @Modifying
    @Query("DELETE FROM DeviceToken d WHERE d.token = :token")
    void deleteByToken(String token);

    @Query("SELECT COUNT(d) FROM DeviceToken d WHERE d.isActive = true")
    long countByIsActiveTrue();
}
