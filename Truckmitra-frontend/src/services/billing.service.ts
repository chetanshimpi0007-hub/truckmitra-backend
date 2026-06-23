import { protectedApi as api } from './api/protectedAndPublicAPI';

export enum InvoicePaymentStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface TripInvoice {
  id: number;
  invoiceNumber: string;
  tripNumber: string;
  loadId: number;
  shipperName: string;
  transporterName: string;
  driverName: string;
  vehicleNumber: string;
  source: string;
  destination: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: InvoicePaymentStatus;
  invoiceDate: string;
  dueDate: string;
  pdfUrl: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: number;
  tripInvoiceId: number;
  invoiceNumber: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  remarks: string;
}

export interface BillingSummary {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalInvoices: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class BillingService {
  
  getInvoices(rolePath: string, page = 0, size = 20, search = '', status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    return api.get<PageResponse<TripInvoice>>(`/invoices${rolePath}?${params.toString()}`);
  }

  getInvoiceDetails(id: number) {
    return api.get<TripInvoice>(`/invoices/${id}`);
  }

  getSummary() {
    return api.get<BillingSummary>('/invoices/summary');
  }

  recordPayment(invoiceId: number, amount: number, paymentMethod: string, transactionId?: string, remarks?: string) {
    const params = new URLSearchParams({
      amount: amount.toString(),
      paymentMethod
    });
    if (transactionId) params.append('transactionId', transactionId);
    if (remarks) params.append('remarks', remarks);
    
    return api.post<PaymentRecord>(`/invoices/${invoiceId}/payments?${params.toString()}`);
  }

  getPaymentHistory(invoiceId: number) {
    return api.get<PaymentRecord[]>(`/invoices/${invoiceId}/payments`);
  }

  exportInvoicesUrl(rolePath: string, search = '', status = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    // Use the base URL or rely on proxy. 
    // In React dev it's typically /api/invoices/export
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/invoices/export?${params.toString()}`;
  }
}

const billingService = new BillingService();
export default billingService;
