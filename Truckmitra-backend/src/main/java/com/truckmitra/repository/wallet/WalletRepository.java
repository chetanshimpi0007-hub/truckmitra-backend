// src/main/java/com/truckmitra/repository/wallet/WalletRepository.java
package com.truckmitra.repository.wallet;

import com.truckmitra.entity.wallet.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUserIdAndUserRole(Long userId, String userRole);

    Optional<Wallet> findByWalletNumber(String walletNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM Wallet w WHERE w.userId = :userId AND w.userRole = :userRole")
    Optional<Wallet> findByUserIdAndUserRoleWithLock(@Param("userId") Long userId, 
                                                      @Param("userRole") String userRole);

    boolean existsByUserIdAndUserRole(Long userId, String userRole);

    Page<Wallet> findByWalletStatus(String status, Pageable pageable);

    @Query("SELECT SUM(w.currentBalance) FROM Wallet w WHERE w.walletStatus = 'ACTIVE'")
    BigDecimal getTotalActiveBalance();

    @Modifying
    @Query("UPDATE Wallet w SET w.walletStatus = 'FROZEN' WHERE w.userId = :userId")
    int freezeWallet(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Wallet w SET w.walletStatus = 'ACTIVE' WHERE w.userId = :userId")
    int unfreezeWallet(@Param("userId") Long userId);
}