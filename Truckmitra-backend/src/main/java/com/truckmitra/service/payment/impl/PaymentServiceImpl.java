package com.truckmitra.service.payment.impl;

import com.truckmitra.exception.AppExceptions;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl {

    public void completePayment(Long paymentId, Long orderId, Double amount) {
        throw new AppExceptions.ValidationException(
                "Payment module not implemented"
        );
    }
}