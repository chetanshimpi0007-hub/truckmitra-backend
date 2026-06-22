package com.truckmitra.service.common;

import com.truckmitra.entity.common.SubscriptionPlan;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import com.razorpay.Subscription;

public interface RazorpaySubscriptionService {
    Subscription createSubscription(SubscriptionPlan plan, User user);
    Subscription cancelSubscription(String razorpaySubscriptionId);
    Subscription fetchSubscription(String razorpaySubscriptionId);
}
