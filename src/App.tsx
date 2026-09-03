import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, X, Wifi, AlertCircle, 
  Info, CheckCircle, Database, Cloud
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Packages from './components/Packages';
import Coverage from './components/Coverage';
import Testimonials from './components/Testimonials';
import Steps from './components/Steps';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import AdminDashboard from './components/AdminDashboard';

import { InternetPackage, CustomerOrder, SystemNotification, EarningRecord, BillingInvoice } from './types';
import { getStoredData, saveStoredData } from './data';
import { 
  seedInitialDataIfEmpty,
  subscribeOrders,
  subscribeInvoices,
  subscribeEarnings,
  subscribeNotifications,
  createOrder,
  updateOrder,
  createInvoice,
  deleteInvoice,
  createEarning,
  createNotification,
  markAllNotificationsAsRead
} from './firebase';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);

  // Dark mode theme state with persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('gaim_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gaim_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gaim_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Route detection via hash and query parameters
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.toLowerCase();

      const isHashAdmin = 
        hash === '#/admin' || 
        hash === '#/admin-panel' || 
        hash === '#/panel-admin' || 
        hash === '#/portal-admin' || 
        hash === '#/login-admin' || 
        hash.startsWith('#/admin');

      const isParamAdmin = 
        params.get('view') === 'admin' ||
        params.get('page') === 'admin' ||
        params.get('mode') === 'admin' ||
        params.get('admin') === 'true' ||
        params.get('admin') === '1' ||
        params.get('portal') === 'admin';

      const isPathAdmin = pathname.endsWith('/admin') || pathname.endsWith('/admin-panel');

      if (isHashAdmin || isParamAdmin || isPathAdmin) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);
  
  // Shared persistent states initialized with local fallback
  const [orders, setOrders] = useState<CustomerOrder[]>(() => getStoredData().orders);
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => getStoredData().notifications);
  const [earnings, setEarnings] = useState<EarningRecord[]>(() => getStoredData().earnings);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    try {
      const stored = localStorage.getItem('gaim_invoices');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Selection states
  const [selectedPackage, setSelectedPackage] = useState<InternetPackage | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // WhatsApp Support Simulator variables
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Halo! Selamat datang di Pusat Bantuan GAIM Internet. Saya Maya, asisten virtual Anda. Ada yang bisa saya bantu hari ini?',
      time: 'Baru saja'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // -------------------------------------------------------------
  // Real-time Cloud Firestore Subscriptions & Auto-seed
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Check and seed initial data if Firestore collection is fresh
    seedInitialDataIfEmpty().catch(err => {
      console.warn('Firestore initial seeding skipped or offline:', err);
    });

    // 2. Real-time Firestore sync for Orders
    const unsubOrders = subscribeOrders((firebaseOrders) => {
      if (firebaseOrders.length > 0) {
        setOrders(firebaseOrders);
        setIsDbConnected(true);
      }
    });

    // 3. Real-time Firestore sync for Invoices
    const unsubInvoices = subscribeInvoices((firebaseInvoices) => {
      setInvoices(firebaseInvoices);
      setIsDbConnected(true);
    });

    // 4. Real-time Firestore sync for Earnings
    const unsubEarnings = subscribeEarnings((firebaseEarnings) => {
      if (firebaseEarnings.length > 0) {
        setEarnings(firebaseEarnings);
        setIsDbConnected(true);
      }
    });

    // 5. Real-time Firestore sync for Notifications
    const unsubNotifs = subscribeNotifications((firebaseNotifs) => {
      if (firebaseNotifs.length > 0) {
        setNotifications(firebaseNotifs);
        setIsDbConnected(true);
      }
    });

    return () => {
      unsubOrders();
      unsubInvoices();
      unsubEarnings();
      unsubNotifs();
    };
  }, []);

  // Sync to localStorage as offline cache
  useEffect(() => {
    if (orders.length > 0 || notifications.length > 0 || earnings.length > 0 || invoices.length > 0) {
      saveStoredData(orders, notifications, earnings);
      localStorage.setItem('gaim_invoices', JSON.stringify(invoices));
    }
  }, [orders, notifications, earnings, invoices]);

  // Show Toast Alert helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Submit Order from Modal (Customer side)
  const handleSubmitOrder = async (orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => {
    const orderId = `ord-${Date.now()}`;
    const todayStr = new Date().toISOString();
    
    // Generate invoice like GAIM-20260630-123
    const dateSegment = todayStr.split('T')[0].replace(/-/g, '');
    const randomSegment = Math.floor(100 + Math.random() * 900);
    const orderNumber = `GAIM-${dateSegment}-${randomSegment}`;

    const newOrder: CustomerOrder = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: 'waiting_approval',
      createdAt: todayStr
    };

    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: 'payment_submitted',
      message: `Konfirmasi pembayaran diterima dari ${orderData.customerName} - Paket ${orderData.packageName} (${orderData.packageSpeed})`,
      timestamp: todayStr,
      read: false,
      orderId: orderId
    };

    // Optimistic state update
    setOrders(prev => [newOrder, ...prev]);
    setNotifications(prev => [newNotification, ...prev]);
    showToast('Pendaftaran Berhasil Disimpan ke Cloud Firestore! Silakan cek Admin Panel.', 'success');

    // Persist to Cloud Firestore
    try {
      await createOrder(newOrder);
      await createNotification(newNotification);
    } catch (err) {
      console.warn('Firestore write fallback:', err);
    }
  };

  // 2. Approve Order Payment (Admin side)
  const handleApproveOrder = async (orderId: string, ipAddress?: string) => {
    const todayStr = new Date().toISOString();
    const todayDateOnly = todayStr.split('T')[0];
    const finalIp = ipAddress || `192.168.10.${Math.floor(15 + Math.random() * 230)}`;

    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    // Create matching EarningRecord
    const newEarning: EarningRecord = {
      id: `earn-${Date.now()}`,
      date: todayDateOnly,
      amount: targetOrder.packagePrice,
      orderId: targetOrder.id,
      customerName: targetOrder.customerName,
      packageName: targetOrder.packageName
    };

    // Trigger notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: 'approved',
      message: `Pembayaran disetujui! Layanan ${targetOrder.customerName} telah diaktifkan (Paket ${targetOrder.packageName})`,
      timestamp: todayStr,
      read: false,
      orderId: targetOrder.id
    };

    // Optimistic UI updates
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'active', approvedAt: todayStr, ipAddress: finalIp } : o));
    setEarnings(prev => [newEarning, ...prev]);
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Pembayaran ${targetOrder.customerName} disetujui & tercatat di Database Firestore!`, 'success');

    // Persist to Cloud Firestore
    try {
      await updateOrder(orderId, {
        status: 'active',
        approvedAt: todayStr,
        ipAddress: finalIp
      });
      await createEarning(newEarning);
      await createNotification(newNotif);
    } catch (err) {
      console.warn('Firestore approve write error:', err);
    }
  };

  // 3. Reject Order Payment (Admin side)
  const handleRejectOrder = async (orderId: string) => {
    const todayStr = new Date().toISOString();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: 'rejected',
      message: `Pembayaran atau pendaftaran ${targetOrder.customerName} ditolak oleh admin.`,
      timestamp: todayStr,
      read: false,
      orderId: targetOrder.id
    };

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Pesanan ${targetOrder.customerName} ditolak.`, 'error');

    try {
      await updateOrder(orderId, { status: 'rejected' });
      await createNotification(newNotif);
    } catch (err) {
      console.warn('Firestore reject write error:', err);
    }
  };

  // 4. Add Manual Cash Order (Admin side)
  const handleAddManualOrder = async (newOrder: CustomerOrder) => {
    const todayStr = new Date().toISOString();
    const todayDateOnly = todayStr.split('T')[0];

    const newEarning: EarningRecord = {
      id: `earn-man-${Date.now()}`,
      date: todayDateOnly,
      amount: newOrder.packagePrice,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      packageName: newOrder.packageName
    };

    const newNotif: SystemNotification = {
      id: `notif-man-${Date.now()}`,
      type: 'manual_addition',
      message: `Registrasi manual (TUNAI LUNAS) didaftarkan oleh Admin untuk ${newOrder.customerName} (Paket ${newOrder.packageName})`,
      timestamp: todayStr,
      read: false,
      orderId: newOrder.id
    };

    setOrders(prev => [newOrder, ...prev]);
    setEarnings(prev => [newEarning, ...prev]);
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Registrasi manual ${newOrder.customerName} tersimpan di Database!`, 'success');

    try {
      await createOrder(newOrder);
      await createEarning(newEarning);
      await createNotification(newNotif);
    } catch (err) {
      console.warn('Firestore manual order error:', err);
    }
  };

  // 5. Clear or Mark Notifications Read
  const handleClearNotifications = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifikasi ditandai telah dibaca.', 'info');
    try {
      await markAllNotificationsAsRead(notifications);
    } catch (err) {
      console.warn('Firestore mark notifications error:', err);
    }
  };

  // 6. Updaters for direct state synchronizations from Admin Dashboard
  const handleUpdateOrders = async (updatedOrders: CustomerOrder[]) => {
    setOrders(updatedOrders);
    // Find modified order and update in Firestore
    try {
      for (const order of updatedOrders) {
        await createOrder(order);
      }
    } catch (err) {
      console.warn('Firestore orders sync error:', err);
    }
  };

  const handleUpdateInvoices = async (updatedInvoices: BillingInvoice[]) => {
    const oldInvoices = invoices;
    setInvoices(updatedInvoices);

    try {
      // Sync created/updated
      for (const inv of updatedInvoices) {
        await createInvoice(inv);
      }
      // Check for deleted
      for (const oldInv of oldInvoices) {
        if (!updatedInvoices.some(n => n.id === oldInv.id)) {
          await deleteInvoice(oldInv.id);
        }
      }
    } catch (err) {
      console.warn('Firestore invoices sync error:', err);
    }
  };

  const handleUpdateEarnings = async (updatedEarnings: EarningRecord[]) => {
    setEarnings(updatedEarnings);
    try {
      for (const earn of updatedEarnings) {
        await createEarning(earn);
      }
    } catch (err) {
      console.warn('Firestore earnings sync error:', err);
    }
  };

  // 7. Handle customer click "Daftar Sekarang" from hero
  const handleHeroRegisterClick = () => {
    const element = document.getElementById('paket');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // WhatsApp chat simulation reply logic
  const handleSendChat = (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    const userTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const updatedMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: messageText, time: userTime }
    ];
    setChatMessages(updatedMessages);
    setChatInput('');

    // Simulated reply based on content
    setTimeout(() => {
      let replyText = 'Terima kasih atas pesan Anda. Silakan isi form pendaftaran paket atau cek jangkauan area fiber terlebih dahulu pada tombol yang tersedia di website kami.';
      
      const lower = messageText.toLowerCase();
      if (lower.includes('promo') || lower.includes('daftar') || lower.includes('pasang')) {
        replyText = 'Kabar gembira! Bulan ini kami mengadakan promo GRATIS biaya pemasangan instalasi awal untuk seluruh paket internet rumah tangga. Anda cukup mendaftar melalui form tombol "Pilih Paket" di landing page!';
      } else if (lower.includes('kendala') || lower.includes('rusak') || lower.includes('gangguan')) {
        replyText = 'Mohon maaf atas ketidaknyamanannya. Tim teknisi lokal kami selalu siap siaga. Silakan infokan Nomor Pelanggan atau Alamat lengkap Anda agar tim dispatch segera menjadwalkan kunjungan teknisi.';
      } else if (lower.includes('bayar') || lower.includes('tagihan') || lower.includes('rekening')) {
        replyText = 'Untuk pembayaran bulanan, silakan transfer manual ke rekening bank BCA (887-1122-334) atau Mandiri (123-00-998877-66) atas nama PT GAIM INTERNET NUSANTARA. Setelah transfer, kirimkan konfirmasi Anda ke sistem kami!';
      }

      const agentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [
        ...prev,
        { sender: 'agent', text: replyText, time: agentTime }
      ]);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-gray-800 dark:text-slate-100 flex flex-col font-sans transition-colors" id="gaim-app-root">
      
      {/* Dynamic Global Top Toast System Notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none"
            id="global-toast-banner"
          >
            <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 pointer-events-auto bg-white dark:bg-slate-900 ${
              toastMessage.type === 'success' ? 'border-green-100 dark:border-green-800 text-green-900 dark:text-green-200 shadow-green-100/50 dark:shadow-green-950/50' :
              toastMessage.type === 'error' ? 'border-red-100 dark:border-red-800 text-red-900 dark:text-red-200 shadow-red-100/50 dark:shadow-red-950/50' : 'border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-200 shadow-blue-100/50 dark:shadow-blue-950/50'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />}
              {toastMessage.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />}
              {toastMessage.type === 'info' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />}
              <div>
                <span className="font-extrabold text-xs uppercase block text-slate-900 dark:text-white">DATABASE CLOUD UPDATE</span>
                <p className="text-xs font-semibold mt-1 leading-normal text-slate-700 dark:text-slate-300">{toastMessage.text}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Top Header Navigation (Hidden in Admin Panel) */}
      {!isAdminView && (
        <Navbar 
          isAdminView={isAdminView} 
          setIsAdminView={setIsAdminView} 
          onOpenContact={() => setIsContactOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Container Switch */}
      <main className="flex-1">
        {isAdminView ? (
          // Admin Panel Monitoring
          <AdminDashboard
            orders={orders}
            notifications={notifications}
            earnings={earnings}
            invoices={invoices}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
            onAddManualOrder={handleAddManualOrder}
            onClearNotifications={handleClearNotifications}
            onUpdateOrders={handleUpdateOrders}
            onUpdateInvoices={handleUpdateInvoices}
            onUpdateEarnings={handleUpdateEarnings}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            onBackToLanding={() => {
              setIsAdminView(false);
              window.location.hash = '#beranda';
            }}
          />
        ) : (
          // Responsive Customer Landing Page
          <>
            <Hero 
              onRegisterClick={handleHeroRegisterClick} 
              onOpenContact={() => setIsContactOpen(true)} 
            />
            <Features />
            <Packages onSelectPackage={(pkg) => setSelectedPackage(pkg)} />
            <Coverage />
            <Testimonials />
            <Steps />
            <FAQ />
          </>
        )}
      </main>

      {/* Footer (Accessible only in customer landing page) */}
      {!isAdminView && (
        <Footer onAdminToggle={() => setIsAdminView(true)} />
      )}

      {/* MODAL: Customer Registration Wizard Form */}
      <AnimatePresence>
        {selectedPackage && (
          <OrderModal
            selectedPackage={selectedPackage}
            onClose={() => setSelectedPackage(null)}
            onSubmitOrder={handleSubmitOrder}
          />
        )}
      </AnimatePresence>

      {/* MODAL/DRAWER: WhatsApp Live Help Desk Simulator */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-xs animate-fade-in" id="whatsapp-simulator-overlay">
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col h-full"
              id="whatsapp-chat-box"
            >
              {/* Chat Header */}
              <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full relative">
                    <Wifi className="h-5 w-5 text-white animate-pulse" />
                    <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#075e54]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Customer Service GAIM</h4>
                    <span className="text-[10px] text-green-200 mt-1 block">Maya (Online) • Respon Cepat</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsContactOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Content Body */}
              <div className="flex-1 bg-[#ece5dd] dark:bg-slate-950 p-4 overflow-y-auto space-y-4" id="chat-messages-container">
                {chatMessages.map((msg, idx) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[80%] ${isAgent ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                    >
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isAgent 
                          ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700' 
                          : 'bg-[#dcf8c6] dark:bg-emerald-950/80 text-gray-800 dark:text-emerald-100 rounded-tr-none border border-emerald-200/50 dark:border-emerald-800'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 dark:text-slate-400 mt-1 pl-1 pr-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Quick Templates */}
              <div className="p-2.5 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0 flex flex-wrap gap-1.5 justify-center">
                <button
                  onClick={() => handleSendChat('Tanya promo pemasangan baru')}
                  className="bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-blue-200 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-slate-300 hover:text-[#004aad] cursor-pointer"
                >
                  🎁 Promo Pasang Baru
                </button>
                <button
                  onClick={() => handleSendChat('Laporkan kendala gangguan koneksi')}
                  className="bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-blue-200 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-slate-300 hover:text-[#004aad] cursor-pointer"
                >
                  🛠️ Gangguan Koneksi
                </button>
                <button
                  onClick={() => handleSendChat('Bantuan cara konfirmasi pembayaran bulanan')}
                  className="bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-blue-200 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-slate-300 hover:text-[#004aad] cursor-pointer"
                >
                  💳 Cara Bayar Tagihan
                </button>
              </div>

              {/* Chat Input form */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik pesan Anda..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:bg-gray-50 dark:focus:bg-slate-700 focus:ring-1 focus:ring-green-500 placeholder:text-slate-400"
                  id="chat-text-input"
                />
                <button
                  onClick={() => handleSendChat()}
                  className="bg-[#075e54] text-white p-2.5 rounded-xl hover:bg-[#064e45] transition-all cursor-pointer"
                  id="btn-send-chat"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
