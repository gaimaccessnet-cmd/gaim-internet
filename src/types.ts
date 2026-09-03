export interface InternetPackage {
  id: string;
  name: string;
  speed: string;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  promoBadge?: string;
  features: string[];
  popular?: boolean;
  connectionType?: 'Dedicated' | 'Broadband';
  connectionSubtitle?: string;
}

export type OrderStatus = 'pending' | 'waiting_approval' | 'active' | 'rejected';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  packageId: string;
  packageName: string;
  packageSpeed: string;
  packagePrice: number;
  status: OrderStatus;
  createdAt: string;
  approvedAt?: string;
  transferBank?: string;
  senderName?: string;
  ipAddress?: string; // IP Address assigned to customer
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  packageName: string;
  packagePrice: number;
  month: string; // e.g., "July 2026"
  status: 'unpaid' | 'paid';
  createdAt: string;
}

export type NotificationType = 'new_order' | 'payment_submitted' | 'approved' | 'rejected' | 'manual_addition';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface EarningRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  orderId: string;
  customerName: string;
  packageName: string;
}

export interface CoverageArea {
  id: string;
  name: string;
  status: 'tersedia' | 'segera' | 'tidak_tersedia';
  district: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  fullname: string;
  role: 'Super Admin' | 'Finance Billing' | 'Network Engineer' | 'Customer Support';
  createdAt?: string;
  lastLogin?: string;
}
