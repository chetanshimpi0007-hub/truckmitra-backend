package com.truckmitra.repository.user;

import com.truckmitra.entity.user.TransporterPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransporterPreferenceRepository extends JpaRepository<TransporterPreference, Long> {
    Optional<TransporterPreference> findByTransporterId(Long transporterId);
}
