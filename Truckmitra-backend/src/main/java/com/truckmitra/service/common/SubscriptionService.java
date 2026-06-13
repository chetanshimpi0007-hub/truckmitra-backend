package com.truckmitra.service.common;

import com.truckmitra.entity.common.SubscriptionPlan;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;

import java.util.List;

public interface SubscriptionService {
    List<SubscriptionPlan> getAllPlans();
    UserSubscription subscribe(User user, Long planId);
    UserSubscription getCurrentSubscription(User user);
    boolean canPerformAction(User user, String action);
}
