import { InternetPackage, CustomerOrder, SystemNotification, EarningRecord, CoverageArea } from './types';

export const DEFAULT_PACKAGES: InternetPackage[] = [
  {
    id: 'pkg-basic',
    name: 'BASIC',
    speed: '20 Mbps',
    price: 150000,
    originalPrice: 200000,
    isPromo: true,
    promoBadge: 'PROMO HEMAT 25%',
    connectionType: 'Dedicated',
    connectionSubtitle: 'Koneksi Dedicated Tanpa Batasan Kuota (FUP)',
    features: [
      'Koneksi Stabil',
      'Cocok untuk 1-5 perangkat',
      'Streaming & Browsing standar'
    ]
  },
  {
    id: 'pkg-family',
    name: 'FAMILY',
    speed: '50 Mbps',
    price: 350000,
    connectionType: 'Broadband',
    connectionSubtitle: 'Koneksi Broadband',
    features: [
      'Koneksi Sangat Stabil',
      'Cocok untuk 1-10 perangkat',
      'Streaming Full HD & Meeting Online',
      'Prioritas Bandwidth Game'
    ],
    popular: true
  },
  {
    id: 'pkg-premium',
    name: 'PREMIUM',
    speed: '100 Mbps',
    price: 500000,
    connectionType: 'Broadband',
    connectionSubtitle: 'Koneksi Broadband',
    features: [
      'Koneksi Super Cepat & Stabil',
      'Cocok untuk 1-15 perangkat',
      'Streaming Ultra HD/4K & Gaming berat',
      'Dukungan SLA 99.9% untuk Bisnis'
    ]
  }
];

export const COVERAGE_AREAS: CoverageArea[] = [
  { id: 'area-1', name: 'Mekarjaya', district: 'Sukmajaya', status: 'tersedia' },
  { id: 'area-2', name: 'Abadijaya', district: 'Sukmajaya', status: 'tersedia' },
  { id: 'area-3', name: 'Baktijaya', district: 'Sukmajaya', status: 'tersedia' },
  { id: 'area-4', name: 'Margonda', district: 'Pancoran Mas', status: 'tersedia' },
  { id: 'area-5', name: 'Depok Jaya', district: 'Pancoran Mas', status: 'tersedia' },
  { id: 'area-6', name: 'Beji Timur', district: 'Beji', status: 'tersedia' },
  { id: 'area-7', name: 'Kemiri Muka', district: 'Beji', status: 'tersedia' },
  { id: 'area-8', name: 'Kukusan', district: 'Beji', status: 'segera' },
  { id: 'area-9', name: 'Pondok Cina', district: 'Beji', status: 'tersedia' },
  { id: 'area-10', name: 'Cinere', district: 'Cinere', status: 'segera' },
  { id: 'area-11', name: 'Limo', district: 'Limo', status: 'tidak_tersedia' },
  { id: 'area-12', name: 'Sawangan Baru', district: 'Sawangan', status: 'segera' },
  { id: 'area-13', name: 'Jl. Hj Gaim', district: 'Pesanggrahan', status: 'tersedia' },
  { id: 'area-14', name: 'Petukangan Utara', district: 'Pesanggrahan', status: 'tersedia' },
  { id: 'area-15', name: 'Petukangan Selatan', district: 'Pesanggrahan', status: 'tersedia' },
  { id: 'area-16', name: 'Pesanggrahan', district: 'Jakarta Selatan', status: 'tersedia' }
];

export const DEFAULT_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'GAIM-20260115-001',
    customerName: 'Ahmad Subarjo',
    customerPhone: '081234567890',
    customerEmail: 'ahmad.subarjo@gmail.com',
    customerAddress: 'Jl. Melati No. 45, RT 02/RW 04, Mekarjaya',
    packageId: 'pkg-family',
    packageName: 'FAMILY',
    packageSpeed: '50 Mbps',
    packagePrice: 275000,
    status: 'active',
    createdAt: '2026-01-15T09:30:00Z',
    approvedAt: '2026-01-15T14:15:00Z',
    transferBank: 'BCA',
    senderName: 'AHMAD SUBARJO'
  },
  {
    id: 'ord-102',
    orderNumber: 'GAIM-20260210-002',
    customerName: 'Siti Aminah',
    customerPhone: '085712345678',
    customerEmail: 'siti.aminah@yahoo.com',
    customerAddress: 'Apartemen Margonda Residence Tower B Lt. 5, Depok',
    packageId: 'pkg-basic',
    packageName: 'BASIC',
    packageSpeed: '20 Mbps',
    packagePrice: 150000,
    status: 'active',
    createdAt: '2026-02-10T11:20:00Z',
    approvedAt: '2026-02-10T16:00:00Z',
    transferBank: 'Mandiri',
    senderName: 'SITI AMINAH'
  },
  {
    id: 'ord-103',
    orderNumber: 'GAIM-20260322-003',
    customerName: 'CV. Maju Jaya Kreatif',
    customerPhone: '082198765432',
    customerEmail: 'admin@majujayakreatif.com',
    customerAddress: 'Ruko Margonda Raya No. 12B, Kemiri Muka',
    packageId: 'pkg-premium',
    packageName: 'PREMIUM',
    packageSpeed: '100 Mbps',
    packagePrice: 450000,
    status: 'active',
    createdAt: '2026-03-22T14:45:00Z',
    approvedAt: '2026-03-23T09:30:00Z',
    transferBank: 'BNI',
    senderName: 'BUDI SETIAWAN'
  },
  {
    id: 'ord-104',
    orderNumber: 'GAIM-20260405-004',
    customerName: 'Diana Putri',
    customerPhone: '081388887777',
    customerEmail: 'diana.putri@gmail.com',
    customerAddress: 'Perumahan Depok Indah Blok C No. 9, Depok Jaya',
    packageId: 'pkg-family',
    packageName: 'FAMILY',
    packageSpeed: '50 Mbps',
    packagePrice: 275000,
    status: 'active',
    createdAt: '2026-04-05T08:15:00Z',
    approvedAt: '2026-04-05T12:00:00Z',
    transferBank: 'BCA',
    senderName: 'DIANA PUTRI'
  },
  {
    id: 'ord-105',
    orderNumber: 'GAIM-20260518-005',
    customerName: 'Hendra Wijaya',
    customerPhone: '081122223333',
    customerEmail: 'hendra.wijaya@outlook.com',
    customerAddress: 'Jl. Margonda No. 101, Beji Timur',
    packageId: 'pkg-basic',
    packageName: 'BASIC',
    packageSpeed: '20 Mbps',
    packagePrice: 150000,
    status: 'active',
    createdAt: '2026-05-18T10:00:00Z',
    approvedAt: '2026-05-18T15:30:00Z',
    transferBank: 'BCA',
    senderName: 'HENDRA WIJAYA'
  },
  {
    id: 'ord-106',
    orderNumber: 'GAIM-20260612-006',
    customerName: 'Rian Hidayat',
    customerPhone: '087855554444',
    customerEmail: 'rian.hidayat@gmail.com',
    customerAddress: 'Jl. Kamboja No. 14, RT 01/RW 03, Baktijaya',
    packageId: 'pkg-family',
    packageName: 'FAMILY',
    packageSpeed: '50 Mbps',
    packagePrice: 275000,
    status: 'active',
    createdAt: '2026-06-12T16:25:00Z',
    approvedAt: '2026-06-13T09:15:00Z',
    transferBank: 'Mandiri',
    senderName: 'RIAN HIDAYAT'
  },
  {
    id: 'ord-107',
    orderNumber: 'GAIM-20260628-007',
    customerName: 'Budi Santoso',
    customerPhone: '085211119999',
    customerEmail: 'budi.santoso@gmail.com',
    customerAddress: 'Jl. Kenanga No. 8, Abadijaya',
    packageId: 'pkg-family',
    packageName: 'FAMILY',
    packageSpeed: '50 Mbps',
    packagePrice: 275000,
    status: 'waiting_approval',
    createdAt: '2026-06-28T13:40:00Z',
    transferBank: 'BCA',
    senderName: 'BUDI SANTOSO'
  },
  {
    id: 'ord-108',
    orderNumber: 'GAIM-20260630-008',
    customerName: 'Dewi Lestari',
    customerPhone: '081299998888',
    customerEmail: 'dewi.lestari@gmail.com',
    customerAddress: 'Cluster Jasmine No. F-12, Mekarjaya',
    packageId: 'pkg-premium',
    packageName: 'PREMIUM',
    packageSpeed: '100 Mbps',
    packagePrice: 450000,
    status: 'waiting_approval',
    createdAt: '2026-06-30T10:15:00Z',
    transferBank: 'BRI',
    senderName: 'DEWI LESTARI'
  }
];

export const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'new_order',
    message: 'Registrasi paket baru oleh Dewi Lestari - Paket PREMIUM (100 Mbps)',
    timestamp: '2026-06-30T10:15:00Z',
    read: false,
    orderId: 'ord-108'
  },
  {
    id: 'notif-2',
    type: 'payment_submitted',
    message: 'Konfirmasi transfer pembayaran diterima dari Budi Santoso (BCA - Rp 275.000)',
    timestamp: '2026-06-28T13:40:00Z',
    read: false,
    orderId: 'ord-107'
  },
  {
    id: 'notif-3',
    type: 'approved',
    message: 'Pembayaran disetujui! Layanan Rian Hidayat aktif (Paket FAMILY - 50 Mbps)',
    timestamp: '2026-06-13T09:15:00Z',
    read: true,
    orderId: 'ord-106'
  },
  {
    id: 'notif-4',
    type: 'new_order',
    message: 'Registrasi paket baru oleh Rian Hidayat - Paket FAMILY (50 Mbps)',
    timestamp: '2026-06-12T16:25:00Z',
    read: true,
    orderId: 'ord-106'
  }
];

export const DEFAULT_EARNINGS: EarningRecord[] = [
  { id: 'earn-1', date: '2026-01-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-2', date: '2026-02-10', amount: 150000, orderId: 'ord-102', customerName: 'Siti Aminah', packageName: 'BASIC' },
  { id: 'earn-3', date: '2026-03-23', amount: 450000, orderId: 'ord-103', customerName: 'CV. Maju Jaya Kreatif', packageName: 'PREMIUM' },
  { id: 'earn-4', date: '2026-04-05', amount: 275000, orderId: 'ord-104', customerName: 'Diana Putri', packageName: 'FAMILY' },
  { id: 'earn-5', date: '2026-05-18', amount: 150000, orderId: 'ord-105', customerName: 'Hendra Wijaya', packageName: 'BASIC' },
  { id: 'earn-6', date: '2026-06-13', amount: 275000, orderId: 'ord-106', customerName: 'Rian Hidayat', packageName: 'FAMILY' },
  // Let's add subscription renewals mock data to make earnings look higher and more realistic
  { id: 'earn-renew-1', date: '2026-02-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-renew-2', date: '2026-03-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-renew-3', date: '2026-03-10', amount: 150000, orderId: 'ord-102', customerName: 'Siti Aminah', packageName: 'BASIC' },
  { id: 'earn-renew-4', date: '2026-04-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-renew-5', date: '2026-04-10', amount: 150000, orderId: 'ord-102', customerName: 'Siti Aminah', packageName: 'BASIC' },
  { id: 'earn-renew-6', date: '2026-05-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-renew-7', date: '2026-05-10', amount: 150000, orderId: 'ord-102', customerName: 'Siti Aminah', packageName: 'BASIC' },
  { id: 'earn-renew-8', date: '2026-05-05', amount: 275000, orderId: 'ord-104', customerName: 'Diana Putri', packageName: 'FAMILY' },
  { id: 'earn-renew-9', date: '2026-06-15', amount: 275000, orderId: 'ord-101', customerName: 'Ahmad Subarjo', packageName: 'FAMILY' },
  { id: 'earn-renew-10', date: '2026-06-10', amount: 150000, orderId: 'ord-102', customerName: 'Siti Aminah', packageName: 'BASIC' },
  { id: 'earn-renew-11', date: '2026-06-05', amount: 275000, orderId: 'ord-104', customerName: 'Diana Putri', packageName: 'FAMILY' },
  { id: 'earn-renew-12', date: '2026-06-18', amount: 150000, orderId: 'ord-105', customerName: 'Hendra Wijaya', packageName: 'BASIC' },
  { id: 'earn-renew-13', date: '2026-06-23', amount: 450000, orderId: 'ord-103', customerName: 'CV. Maju Jaya Kreatif', packageName: 'PREMIUM' }
];

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export const getStoredData = () => {
  if (typeof window === 'undefined') {
    return {
      orders: DEFAULT_ORDERS,
      notifications: DEFAULT_NOTIFICATIONS,
      earnings: DEFAULT_EARNINGS
    };
  }

  const storedOrders = localStorage.getItem('gaim_orders');
  const storedNotifs = localStorage.getItem('gaim_notifications');
  const storedEarnings = localStorage.getItem('gaim_earnings');

  return {
    orders: storedOrders ? JSON.parse(storedOrders) : DEFAULT_ORDERS,
    notifications: storedNotifs ? JSON.parse(storedNotifs) : DEFAULT_NOTIFICATIONS,
    earnings: storedEarnings ? JSON.parse(storedEarnings) : DEFAULT_EARNINGS
  };
};

export const saveStoredData = (
  orders: CustomerOrder[],
  notifications: SystemNotification[],
  earnings: EarningRecord[]
) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gaim_orders', JSON.stringify(orders));
    localStorage.setItem('gaim_notifications', JSON.stringify(notifications));
    localStorage.setItem('gaim_earnings', JSON.stringify(earnings));
  }
};
