import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CustomerOrder, BillingInvoice, EarningRecord, SystemNotification, AdminUser } from './types';
import { DEFAULT_ORDERS, DEFAULT_NOTIFICATIONS, DEFAULT_EARNINGS } from './data';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Collection Names
const ORDERS_COLLECTION = 'orders';
const INVOICES_COLLECTION = 'invoices';
const EARNINGS_COLLECTION = 'earnings';
const NOTIFICATIONS_COLLECTION = 'notifications';
const ADMIN_USERS_COLLECTION = 'admin_users';

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin',
    username: 'admin',
    password: 'password123',
    fullname: 'Budi Santoso',
    role: 'Super Admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'staff',
    username: 'staff',
    password: 'staffpassword',
    fullname: 'Siti Rahma',
    role: 'Finance Billing',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'noc',
    username: 'noc',
    password: 'nocpassword',
    fullname: 'Ahmad Fauzi',
    role: 'Network Engineer',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

/**
 * Automatically seed default initial data into Firestore if empty
 */
export async function seedInitialDataIfEmpty() {
  try {
    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders, notifications, and earnings to Firestore...');
      const batch = writeBatch(db);

      // Seed orders
      DEFAULT_ORDERS.forEach(order => {
        const docRef = doc(db, ORDERS_COLLECTION, order.id);
        batch.set(docRef, order);
      });

      // Seed notifications
      DEFAULT_NOTIFICATIONS.forEach(notif => {
        const docRef = doc(db, NOTIFICATIONS_COLLECTION, notif.id);
        batch.set(docRef, notif);
      });

      // Seed earnings
      DEFAULT_EARNINGS.forEach(earn => {
        const docRef = doc(db, EARNINGS_COLLECTION, earn.id);
        batch.set(docRef, earn);
      });

      await batch.commit();
      console.log('Firestore initial seeding completed successfully.');
    }

    // Seed admin accounts into Firestore if empty
    const adminsSnap = await getDocs(collection(db, ADMIN_USERS_COLLECTION));
    if (adminsSnap.empty) {
      console.log('Seeding initial admin users into Firestore database...');
      const adminBatch = writeBatch(db);
      DEFAULT_ADMIN_USERS.forEach(admin => {
        const docRef = doc(db, ADMIN_USERS_COLLECTION, admin.id);
        adminBatch.set(docRef, admin);
      });
      await adminBatch.commit();
      console.log('Admin users seeded to Firestore successfully.');
    }
  } catch (error) {
    console.warn('Initial seeding note (will use local fallback if offline):', error);
  }
}

// -------------------------------------------------------------
// Real-time Subscriptions (Syncs automatically across all devices)
// -------------------------------------------------------------

export function subscribeOrders(onUpdate: (orders: CustomerOrder[]) => void) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const orders: CustomerOrder[] = [];
      snapshot.forEach(d => {
        orders.push(d.data() as CustomerOrder);
      });
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    }, (error) => {
      console.warn('Orders subscription error, using cached data:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe orders:', error);
    return () => {};
  }
}

export function subscribeInvoices(onUpdate: (invoices: BillingInvoice[]) => void) {
  try {
    const q = query(collection(db, INVOICES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const invoices: BillingInvoice[] = [];
      snapshot.forEach(d => {
        invoices.push(d.data() as BillingInvoice);
      });
      invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(invoices);
    }, (error) => {
      console.warn('Invoices subscription error:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe invoices:', error);
    return () => {};
  }
}

export function subscribeEarnings(onUpdate: (earnings: EarningRecord[]) => void) {
  try {
    const q = query(collection(db, EARNINGS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const earnings: EarningRecord[] = [];
      snapshot.forEach(d => {
        earnings.push(d.data() as EarningRecord);
      });
      earnings.sort((a, b) => b.date.localeCompare(a.date));
      onUpdate(earnings);
    }, (error) => {
      console.warn('Earnings subscription error:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe earnings:', error);
    return () => {};
  }
}

export function subscribeNotifications(onUpdate: (notifs: SystemNotification[]) => void) {
  try {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const notifs: SystemNotification[] = [];
      snapshot.forEach(d => {
        notifs.push(d.data() as SystemNotification);
      });
      notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onUpdate(notifs);
    }, (error) => {
      console.warn('Notifications subscription error:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe notifications:', error);
    return () => {};
  }
}

// -------------------------------------------------------------
// CRUD Operations
// -------------------------------------------------------------

// 1. Orders / Registrations
export async function createOrder(order: CustomerOrder): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(docRef, order);
}

export async function updateOrder(orderId: string, updates: Partial<CustomerOrder>): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, updates);
}

export async function deleteOrder(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(docRef);
}

// 2. Invoices
export async function createInvoice(invoice: BillingInvoice): Promise<void> {
  const docRef = doc(db, INVOICES_COLLECTION, invoice.id);
  await setDoc(docRef, invoice);
}

export async function createBatchInvoices(newInvoices: BillingInvoice[]): Promise<void> {
  const batch = writeBatch(db);
  newInvoices.forEach(inv => {
    const docRef = doc(db, INVOICES_COLLECTION, inv.id);
    batch.set(docRef, inv);
  });
  await batch.commit();
}

export async function updateInvoice(invoiceId: string, updates: Partial<BillingInvoice>): Promise<void> {
  const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
  await updateDoc(docRef, updates);
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
  await deleteDoc(docRef);
}

// 3. Earnings
export async function createEarning(earning: EarningRecord): Promise<void> {
  const docRef = doc(db, EARNINGS_COLLECTION, earning.id);
  await setDoc(docRef, earning);
}

export async function deleteEarning(earningId: string): Promise<void> {
  const docRef = doc(db, EARNINGS_COLLECTION, earningId);
  await deleteDoc(docRef);
}

// 4. Notifications
export async function createNotification(notif: SystemNotification): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notif.id);
  await setDoc(docRef, notif);
}

export async function markAllNotificationsAsRead(notifications: SystemNotification[]): Promise<void> {
  const batch = writeBatch(db);
  notifications.forEach(n => {
    if (!n.read) {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, n.id);
      batch.update(docRef, { read: true });
    }
  });
  await batch.commit();
}

export async function deleteNotification(notifId: string): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notifId);
  await deleteDoc(docRef);
}

// 5. Admin Users & Authentication in Firestore
export async function authenticateAdmin(usernameInput: string, passwordInput: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const snap = await getDocs(collection(db, ADMIN_USERS_COLLECTION));
    let matchedDoc: AdminUser | null = null;

    snap.forEach(docSnap => {
      const u = docSnap.data() as AdminUser;
      if (u.username.toLowerCase() === usernameInput.toLowerCase()) {
        matchedDoc = u;
      }
    });

    // Fallback to default admin list if firestore collection is still initializing
    if (!matchedDoc && snap.empty) {
      const fallback = DEFAULT_ADMIN_USERS.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
      if (fallback) matchedDoc = fallback;
    }

    if (!matchedDoc) {
      return { success: false, error: `Username "${usernameInput}" tidak ditemukan dalam database admin.` };
    }

    const admin = matchedDoc as AdminUser;
    if (admin.password !== passwordInput) {
      return { success: false, error: 'Kata sandi salah. Silakan periksa kembali.' };
    }

    // Update lastLogin in Firestore
    const nowIso = new Date().toISOString();
    try {
      const adminDocRef = doc(db, ADMIN_USERS_COLLECTION, admin.id);
      await updateDoc(adminDocRef, { lastLogin: nowIso });
    } catch {
      // Non-critical if offline
    }

    return { 
      success: true, 
      user: { ...admin, lastLogin: nowIso } 
    };
  } catch (error) {
    console.error('Firestore admin authentication error:', error);
    // Offline local fallback verification
    const fallback = DEFAULT_ADMIN_USERS.find(
      u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput
    );
    if (fallback) {
      return { success: true, user: fallback };
    }
    return { success: false, error: 'Gagal terhubung ke database otentikasi.' };
  }
}

export function subscribeAdminUsers(onUpdate: (users: AdminUser[]) => void) {
  try {
    const q = query(collection(db, ADMIN_USERS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const users: AdminUser[] = [];
      snapshot.forEach(d => {
        users.push(d.data() as AdminUser);
      });
      if (users.length > 0) {
        onUpdate(users);
      } else {
        onUpdate(DEFAULT_ADMIN_USERS);
      }
    }, (error) => {
      console.warn('Admin users subscription note:', error);
      onUpdate(DEFAULT_ADMIN_USERS);
    });
  } catch (error) {
    console.error('Failed to subscribe admin users:', error);
    return () => {};
  }
}

export async function saveAdminUser(adminUser: AdminUser): Promise<void> {
  const docRef = doc(db, ADMIN_USERS_COLLECTION, adminUser.id);
  await setDoc(docRef, adminUser);
}

export async function deleteAdminUser(adminId: string): Promise<void> {
  const docRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
  await deleteDoc(docRef);
}

export async function updateAdminPassword(adminId: string, newPassword: string): Promise<void> {
  const docRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
  await updateDoc(docRef, { password: newPassword });
}

