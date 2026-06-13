// src/main/java/com/truckmitra/service/impl/LoadServiceImpl.java
package com.truckmitra.service.impl;

import com.truckmitra.dto.request.LoadRequest;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.user.Shipper;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.user.ShipperRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.service.LoadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoadServiceImpl implements LoadService {

    private final LoadRepository loadRepository;
    private final ShipperRepository shipperRepository;
    private final TransporterRepository transporterRepository;
    private final com.truckmitra.service.common.SubscriptionService subscriptionService;

    @Override
    @Transactional
    public Load createLoad(LoadRequest request, User user) {
        // Enforce plan limits
        if (!subscriptionService.canPerformAction(user, "LOAD_POST")) {
            throw new RuntimeException("Subscription limit reached for posting loads. Please upgrade your plan.");
        }
        Load.LoadBuilder<?, ?> loadBuilder = Load.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .weight(request.getWeight())
                .materialType(request.getMaterialType())
                .description(request.getDescription())
                .pickupDate(request.getPickupDate())
                .budget(request.getBudget())
                .status(LoadStatus.PENDING);

        if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            Shipper shipper = shipperRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Shipper profile not found"));
            loadBuilder.shipper(shipper);
            loadBuilder.isBiddingEnabled(request.getIsBiddingEnabled());
            
            Load load = loadBuilder.build();
            if (request.getTransporterId() != null) {
                Transporter transporter = transporterRepository.findById(request.getTransporterId())
                        .orElseThrow(() -> new RuntimeException("Transporter not found"));
                load.setTransporter(transporter);
                load.setStatus(LoadStatus.ASSIGNED);
            }
            return loadRepository.save(load);
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            Transporter transporter = transporterRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Transporter profile not found"));
            loadBuilder.transporter(transporter);
            loadBuilder.isBiddingEnabled(false);
            
            Load load = loadBuilder.build();
            return loadRepository.save(load);
        }
        
        throw new RuntimeException("Invalid role for creating a load");
    }

    @Override
    public List<Load> getShipperLoads(User user) {
        Shipper shipper = shipperRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Shipper profile not found"));
        return loadRepository.findByShipper(shipper);
    }

    @Override
    public List<Load> getTransporterLoads(Long transporterId) {
        return loadRepository.findByTransporterId(transporterId);
    }

    @Override
    public Load getLoadById(Long id) {
        return loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found"));
    }

    @Override
    @Transactional
    public Load assignTransporter(Long loadId, Long transporterId) {
        Load load = getLoadById(loadId);
        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));
        
        load.setTransporter(transporter);
        load.setStatus(LoadStatus.ASSIGNED);
        return loadRepository.save(load);
    }

    @Override
    public List<Load> getLoadsByStatus(LoadStatus status) {
        return loadRepository.findByStatus(status);
    }

    @Override
    public List<Load> getLoadsByStatusAndBidding(LoadStatus status, Boolean isBiddingEnabled) {
        return loadRepository.findByStatusAndIsBiddingEnabled(status, isBiddingEnabled);
    }

    @Override
    @Transactional
    public Load updateLoad(Long loadId, LoadRequest request, User user) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));
                
        // Verify ownership
        if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            if (load.getShipper() == null || !load.getShipper().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to edit this load");
            }
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            if (load.getShipper() != null || load.getTransporter() == null || !load.getTransporter().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to edit this load");
            }
        } else {
             throw new RuntimeException("Unauthorized role");
        }
        
        load.setSource(request.getSource());
        load.setDestination(request.getDestination());
        load.setWeight(request.getWeight());
        load.setMaterialType(request.getMaterialType());
        load.setDescription(request.getDescription());
        load.setPickupDate(request.getPickupDate());
        load.setBudget(request.getBudget());
        
        return loadRepository.save(load);
    }

    @Override
    @Transactional
    public void deleteLoad(Long loadId, User user) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));
        // Verify ownership
        if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            if (load.getShipper() == null || !load.getShipper().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to delete this load");
            }
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            if (load.getShipper() != null || load.getTransporter() == null || !load.getTransporter().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to delete this load");
            }
        } else {
             throw new RuntimeException("Unauthorized role");
        }
        
        loadRepository.delete(load);
    }
}
