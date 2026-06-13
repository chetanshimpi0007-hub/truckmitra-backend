// src/main/java/com/truckmitra/service/LoadService.java
package com.truckmitra.service;

import com.truckmitra.dto.request.LoadRequest;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.user.User;
import java.util.List;

public interface LoadService {
    Load createLoad(LoadRequest request, User shipper);
    List<Load> getShipperLoads(User shipper);
    List<Load> getTransporterLoads(Long transporterId);
    Load getLoadById(Long id);
    Load assignTransporter(Long loadId, Long transporterId);
    List<Load> getLoadsByStatus(LoadStatus status);
    List<Load> getLoadsByStatusAndBidding(LoadStatus status, Boolean isBiddingEnabled);
    Load updateLoad(Long loadId, LoadRequest request, User user);
    void deleteLoad(Long loadId, User user);
}

