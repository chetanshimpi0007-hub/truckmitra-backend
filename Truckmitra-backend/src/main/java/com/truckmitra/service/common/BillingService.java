package com.truckmitra.service.common;

import com.truckmitra.entity.common.BillingDetails;
import com.truckmitra.entity.common.Invoice;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import java.util.List;

public interface BillingService {
    BillingDetails getBillingDetails(User user);
    BillingDetails updateBillingDetails(BillingDetails details, User user);
    Invoice generateInvoice(UserSubscription subscription);
    List<Invoice> getMyInvoices(User user);
    byte[] downloadInvoice(String invoiceNumber, User user);
}
