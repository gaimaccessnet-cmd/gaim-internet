import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  TrendingUp, Users, Clock, ShoppingCart, 
  Check, X, FileText, Download, Plus, Bell, 
  DollarSign, CheckCircle, ShieldAlert, Award, Calendar,
  Database, Lock, Terminal, LogOut, Key, Edit, Search, 
  Settings, CheckSquare, Square, Menu, Layers, Info, Trash2, Printer, Sun, Moon,
  ShieldCheck, UserPlus, KeyRound, RefreshCw, Server, HardDrive, Shield,
  ArrowLeft, Globe
} from 'lucide-react';
import { CustomerOrder, SystemNotification, EarningRecord, OrderStatus, BillingInvoice, AdminUser } from '../types';
import { formatRupiah, DEFAULT_PACKAGES } from '../data';
import { 
  authenticateAdmin, 
  subscribeAdminUsers, 
  saveAdminUser, 
  deleteAdminUser, 
  updateAdminPassword 
} from '../firebase';

interface AdminDashboardProps {
  orders: CustomerOrder[];
  notifications: SystemNotification[];
  earnings: EarningRecord[];
  invoices: BillingInvoice[];
  onApproveOrder: (orderId: string, ipAddress?: string) => void;
  onRejectOrder: (orderId: string) => void;
  onAddManualOrder: (order: CustomerOrder) => void;
  onClearNotifications: () => void;
  onUpdateOrders: (updatedOrders: CustomerOrder[]) => void;
  onUpdateInvoices: (updatedInvoices: BillingInvoice[]) => void;
  onUpdateEarnings: (updatedEarnings: EarningRecord[]) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onBackToLanding?: () => void;
}

type AdminTab = 'overview' | 'registrations' | 'customers' | 'invoices' | 'earnings' | 'sqlConsole' | 'adminUsers';

export default function AdminDashboard({
  orders,
  notifications,
  earnings,
  invoices,
  onApproveOrder,
  onRejectOrder,
  onAddManualOrder,
  onClearNotifications,
  onUpdateOrders,
  onUpdateInvoices,
  onUpdateEarnings,
  isDarkMode = false,
  onToggleTheme,
  onBackToLanding
}: AdminDashboardProps) {
  
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_session') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sqlConsoleLogs, setSqlConsoleLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Accounts Management (Firestore)
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminFullname, setNewAdminFullname] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminUser['role']>('Network Engineer');
  const [adminActionSuccess, setAdminActionSuccess] = useState('');
  const [adminActionError, setAdminActionError] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [changingPasswordUser, setChangingPasswordUser] = useState<AdminUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Sidebar Tabs and Mobile Controls
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter and Search States
  const [selectedMonth, setSelectedMonth] = useState('2026-06');
  const [customerSearch, setCustomerSearch] = useState('');
  const [regSearch, setRegSearch] = useState('');

  // Bulk Selection States
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

  // Customer Edit & IP Assignment Modal/States
  const [editingCustomer, setEditingCustomer] = useState<CustomerOrder | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editIp, setEditIp] = useState('');
  const [editPkg, setEditPkg] = useState('');

  // Manual Customer Creation Modal/States
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualPkgId, setManualPkgId] = useState('pkg-family');
  const [manualIpAddress, setManualIpAddress] = useState('');

  // Mass Billing States
  const [billingMonth, setBillingMonth] = useState('Juli 2026');
  const [billingError, setBillingError] = useState('');
  const [billingSuccess, setBillingSuccess] = useState('');

  // Local clock state for Indonesian timezone
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time subscribe to Firestore admin_users collection
  useEffect(() => {
    const unsub = subscribeAdminUsers((users) => {
      setAdminUsersList(users);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setSqlConsoleLogs([
      '-- [GOOGLE CLOUD FIRESTORE ONLINE & CONNECTED]',
      '-- Endpoint: firestore.googleapis.com (Database: (default))',
      '-- Collections: admin_users, orders, invoices, earnings, notifications',
      '-- Status: Live Database Authentication Ready'
    ]);
  }, []);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setLoginError('');

    const queryLog = `db.collection('admin_users').where('username', '==', '${username.trim().toLowerCase()}').get()`;
    
    setSqlConsoleLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] FIRESTORE_QUERY: ${queryLog}`
    ]);

    try {
      const result = await authenticateAdmin(username.trim(), password.trim());

      if (result.success && result.user) {
        const matchedUser = result.user;

        setSqlConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] SUCCESS: Authenticated as ${matchedUser.fullname} (${matchedUser.role})`,
          `[${new Date().toLocaleTimeString()}] SESSION_GRANTED: user_id='${matchedUser.id}', role='${matchedUser.role}'`
        ]);

        sessionStorage.setItem('admin_session', 'true');
        sessionStorage.setItem('admin_username', matchedUser.username);
        sessionStorage.setItem('admin_fullname', matchedUser.fullname);
        sessionStorage.setItem('admin_role', matchedUser.role);

        setTimeout(() => {
          setIsLoggedIn(true);
          setIsSubmitting(false);
        }, 600);
      } else {
        setSqlConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] AUTH_FAILED: ${result.error || 'Akses ditolak.'}`
        ]);
        setLoginError(result.error || 'Username atau kata sandi tidak cocok di database Firestore.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Terjadi kendala saat menghubungkan ke database otentikasi.');
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_username');
    sessionStorage.removeItem('admin_fullname');
    sessionStorage.removeItem('admin_role');
    setIsLoggedIn(false);
    window.location.hash = '#beranda';
  };

  // Firestore Admin User CRUD Handlers
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError('');
    setAdminActionSuccess('');

    if (!newAdminUsername.trim() || !newAdminPassword.trim() || !newAdminFullname.trim()) {
      setAdminActionError('Semua kolom wajib diisi.');
      return;
    }

    const cleanUsername = newAdminUsername.trim().toLowerCase();
    if (adminUsersList.some(u => u.username.toLowerCase() === cleanUsername)) {
      setAdminActionError(`Username "${cleanUsername}" sudah terdaftar.`);
      return;
    }

    const newAdmin: AdminUser = {
      id: cleanUsername,
      username: cleanUsername,
      password: newAdminPassword,
      fullname: newAdminFullname.trim(),
      role: newAdminRole,
      createdAt: new Date().toISOString()
    };

    try {
      await saveAdminUser(newAdmin);
      setAdminActionSuccess(`Akun administrator "${newAdmin.fullname}" berhasil disimpan di database Firestore!`);
      setNewAdminUsername('');
      setNewAdminPassword('');
      setNewAdminFullname('');
      setIsAddingAdmin(false);
      setTimeout(() => setAdminActionSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving admin:', err);
      setAdminActionError('Gagal menyimpan akun ke Firestore.');
    }
  };

  const handleDeleteAdminAccount = async (adminId: string, adminName: string) => {
    if (adminUsersList.length <= 1) {
      alert('Tidak dapat menghapus akun admin terakhir.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus akun admin "${adminName}" dari database Firestore?`)) return;

    try {
      await deleteAdminUser(adminId);
      setAdminActionSuccess(`Akun ${adminName} berhasil dihapus dari database.`);
      setTimeout(() => setAdminActionSuccess(''), 4000);
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert('Gagal menghapus akun dari database.');
    }
  };

  const handleUpdateAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPasswordUser || !newPasswordInput.trim()) return;

    try {
      await updateAdminPassword(changingPasswordUser.id, newPasswordInput.trim());
      setAdminActionSuccess(`Kata sandi untuk ${changingPasswordUser.fullname} berhasil diperbarui di Firestore!`);
      setChangingPasswordUser(null);
      setNewPasswordInput('');
      setTimeout(() => setAdminActionSuccess(''), 4000);
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Gagal memperbarui kata sandi di database.');
    }
  };

  // Metric Computations
  const activeOrders = orders.filter(o => o.status === 'active');
  const pendingOrders = orders.filter(o => o.status === 'waiting_approval');
  
  // Dynamic Revenue over time based on Approved Earnings
  const totalRevenueAllTime = earnings.reduce((sum, e) => sum + e.amount, 0);
  const currentMonthRevenue = earnings
    .filter(e => e.date.startsWith(selectedMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingRevenuePotential = pendingOrders.reduce((sum, o) => sum + o.packagePrice, 0);

  // Unpaid/Paid Invoices total
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const unpaidInvoicesTotalAmount = unpaidInvoices.reduce((sum, i) => sum + i.packagePrice, 0);
  const paidInvoicesTotalAmount = paidInvoices.reduce((sum, i) => sum + i.packagePrice, 0);

  // Bulk Approvals Handlers
  const handleToggleSelectReg = (id: string) => {
    setSelectedRegIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllPending = () => {
    if (selectedRegIds.length === pendingOrders.length) {
      setSelectedRegIds([]);
    } else {
      setSelectedRegIds(pendingOrders.map(o => o.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedRegIds.length === 0) return;
    
    // Approve each of the selected IDs
    selectedRegIds.forEach(id => {
      onApproveOrder(id);
    });

    setSelectedRegIds([]);
    alert(`Berhasil menyetujui ${selectedRegIds.length} pendaftaran pelanggan secara masal.`);
  };

  const handleBulkReject = () => {
    if (selectedRegIds.length === 0) return;
    if (!window.confirm(`Apakah Anda yakin ingin menolak ${selectedRegIds.length} pesanan ini?`)) return;

    selectedRegIds.forEach(id => {
      onRejectOrder(id);
    });

    setSelectedRegIds([]);
  };

  const handleApproveAllPending = () => {
    if (pendingOrders.length === 0) return;
    if (!window.confirm(`Apakah Anda yakin ingin menyetujui SEMUA (${pendingOrders.length}) pendaftaran yang tertunda sekaligus?`)) return;

    pendingOrders.forEach(o => {
      onApproveOrder(o.id);
    });

    setSelectedRegIds([]);
  };

  // Customer Editor Handlers
  const openEditCustomer = (cust: CustomerOrder) => {
    setEditingCustomer(cust);
    setEditName(cust.customerName);
    setEditPhone(cust.customerPhone);
    setEditAddress(cust.customerAddress);
    setEditIp(cust.ipAddress || '');
    setEditPkg(cust.packageId);
  };

  const handleSaveCustomerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const matchedPkg = DEFAULT_PACKAGES.find(p => p.id === editPkg) || DEFAULT_PACKAGES[0];

    const updated = orders.map(o => {
      if (o.id === editingCustomer.id) {
        return {
          ...o,
          customerName: editName,
          customerPhone: editPhone,
          customerAddress: editAddress,
          ipAddress: editIp,
          packageId: editPkg,
          packageName: matchedPkg.name,
          packageSpeed: matchedPkg.speed,
          packagePrice: matchedPkg.price
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    setEditingCustomer(null);
    alert('Informasi pelanggan & IP Address berhasil diperbarui!');
  };

  // Mass Billing (Tagihan Masal) Generator
  const handleGenerateMassBilling = () => {
    setBillingError('');
    setBillingSuccess('');

    if (activeOrders.length === 0) {
      setBillingError('Tidak ada pelanggan aktif untuk diterbitkan tagihan.');
      return;
    }

    let newlyCreated = 0;
    const currentInvoices = [...invoices];
    const todayStr = new Date().toISOString();

    activeOrders.forEach(cust => {
      // Check if an invoice for this customer in this specific month already exists
      const exists = currentInvoices.some(
        inv => inv.orderId === cust.id && inv.month.toLowerCase() === billingMonth.toLowerCase()
      );

      if (!exists) {
        const randomSegment = Math.floor(1000 + Math.random() * 9000);
        const monthSlug = billingMonth.replace(/\s+/g, '').toUpperCase();
        const invoiceNumber = `INV-${monthSlug}-${cust.id.slice(-4)}-${randomSegment}`;

        currentInvoices.push({
          id: `inv-${Date.now()}-${cust.id}-${randomSegment}`,
          invoiceNumber,
          orderId: cust.id,
          customerName: cust.customerName,
          packageName: cust.packageName,
          packagePrice: cust.packagePrice,
          month: billingMonth,
          status: 'unpaid',
          createdAt: todayStr
        });
        newlyCreated++;
      }
    });

    if (newlyCreated > 0) {
      onUpdateInvoices(currentInvoices);
      setBillingSuccess(`Sukses menerbitkan ${newlyCreated} tagihan baru untuk periode ${billingMonth}!`);
    } else {
      setBillingError(`Seluruh pelanggan aktif sudah memiliki tagihan untuk periode ${billingMonth}.`);
    }
  };

  // Record manual invoice payment and sync to earnings/revenue monitoring
  const handlePayInvoice = (invoiceId: string) => {
    const todayStr = new Date().toISOString();
    const todayDateOnly = todayStr.split('T')[0];

    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        // Log into Earnings Records
        const newEarning: EarningRecord = {
          id: `earn-inv-${Date.now()}`,
          date: todayDateOnly,
          amount: inv.packagePrice,
          orderId: inv.orderId,
          customerName: inv.customerName,
          packageName: inv.packageName
        };

        const updatedEarningsList = [newEarning, ...earnings];
        onUpdateEarnings(updatedEarningsList);

        return {
          ...inv,
          status: 'paid' as const
        };
      }
      return inv;
    });

    onUpdateInvoices(updatedInvoices);
    alert('Pembayaran tagihan berhasil dicatat! Pendapatan telah diperbarui dalam real-time monitoring.');
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (!window.confirm('Hapus record tagihan ini?')) return;
    onUpdateInvoices(invoices.filter(i => i.id !== invoiceId));
  };

  // Manual Add Order Form Submission
  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    const selectedPkg = DEFAULT_PACKAGES.find(p => p.id === manualPkgId) || DEFAULT_PACKAGES[0];
    const orderId = `ord-man-${Date.now()}`;
    const todayStr = new Date().toISOString();
    const randomSegment = Math.floor(100 + Math.random() * 900);
    const orderNumber = `GAIM-CASH-${todayStr.split('T')[0].replace(/-/g, '')}-${randomSegment}`;

    const newOrder: CustomerOrder = {
      id: orderId,
      orderNumber,
      customerName: manualName,
      customerPhone: manualPhone,
      customerEmail: manualEmail || '-',
      customerAddress: manualAddress,
      packageId: manualPkgId,
      packageName: selectedPkg.name,
      packageSpeed: selectedPkg.speed,
      packagePrice: selectedPkg.price,
      status: 'active',
      createdAt: todayStr,
      approvedAt: todayStr,
      transferBank: 'TUNAI/CASH',
      senderName: 'ADMINISTRATOR',
      ipAddress: manualIpAddress || `192.168.10.${Math.floor(15 + Math.random() * 230)}`
    };

    onAddManualOrder(newOrder);

    // Reset Form
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setManualAddress('');
    setManualIpAddress('');
    setIsAddingManual(false);
  };

  // PDF Audit Report Exporter
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const primaryColor = [37, 99, 235]; // Blue 600
    const darkColor = [15, 23, 42]; // Slate 900
    
    // Header styling
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('PT GAIM INTERNET NUSANTARA', 15, 18);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Gedung Cyber Core Lt. 3, Margonda Depok, Jawa Barat', 15, 26);
    doc.text('Email: finance@gaim.net.id | Telp: +62 856-7858-897', 15, 31);
    
    // Title Segment
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('LAPORAN AUDIT PENDAPATAN BULANAN', 15, 52);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Periode Bulan: ${selectedMonth}`, 15, 59);
    doc.text(`Dicetak Pada: ${new Date().toLocaleString('id-ID')}`, 15, 64);
    
    // Table Header
    const tableY = 74;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, tableY, 180, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal', 18, tableY + 5.5);
    doc.text('Nomor Transaksi', 40, tableY + 5.5);
    doc.text('Nama Pelanggan', 75, tableY + 5.5);
    doc.text('Paket', 125, tableY + 5.5);
    doc.text('Jenis Transaksi', 150, tableY + 5.5);
    doc.text('Jumlah', 172, tableY + 5.5);

    const monthlyEarningsList = earnings.filter(e => e.date.startsWith(selectedMonth));

    let rowY = tableY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    if (monthlyEarningsList.length === 0) {
      doc.text('Tidak ada catatan pemasukan/transaksi disetujui pada bulan ini.', 20, rowY + 6);
      doc.line(15, rowY + 10, 195, rowY + 10);
      rowY += 10;
    } else {
      monthlyEarningsList.forEach((earn, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 248, 248);
          doc.rect(15, rowY, 180, 8, 'F');
        }
        
        doc.text(earn.date, 18, rowY + 5.5);
        
        const matchedOrd = orders.find(o => o.id === earn.orderId);
        const orderNoStr = matchedOrd ? matchedOrd.orderNumber : `GEN-EARN-${earn.id.slice(-4)}`;
        const typeStr = earn.id.startsWith('earn-inv-') ? 'Tagihan Bulanan' : 'Aktivasi Baru';

        doc.text(orderNoStr, 40, rowY + 5.5);
        doc.text(earn.customerName, 75, rowY + 5.5);
        doc.text(earn.packageName, 125, rowY + 5.5);
        doc.text(typeStr, 150, rowY + 5.5);
        doc.text(formatRupiah(earn.amount), 172, rowY + 5.5);
        
        doc.setDrawColor(240, 240, 240);
        doc.line(15, rowY + 8, 195, rowY + 8);
        rowY += 8;
      });
    }

    // Total row
    doc.setFillColor(240, 245, 255);
    doc.rect(15, rowY, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PENDAPATAN AUDIT', 18, rowY + 5.5);
    doc.text(formatRupiah(currentMonthRevenue), 172, rowY + 5.5);
    rowY += 12;

    const sigY = Math.min(rowY + 15, 230);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text('Dokumen laporan audit pendapatan ini dihasilkan secara otomatis oleh sistem penagihan GAIM.', 15, sigY);
    doc.text('Data sinkronisasi pelanggan bersifat sah dan diotorisasi secara digital.', 15, sigY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text('Disetujui Oleh,', 155, sigY);
    doc.text('Finance Controller GAIM', 140, sigY + 22);
    doc.setDrawColor(180, 180, 180);
    doc.line(140, sigY + 18, 185, sigY + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Sistem Otomatis Terverifikasi', 142, sigY + 25);

    doc.save(`Laporan_GAIM_${selectedMonth}.pdf`);
  };

  const handlePrintMockInvoice = (inv: BillingInvoice) => {
    const printableWindow = window.open('', '_blank');
    if (!printableWindow) return;

    printableWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${inv.invoiceNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #333; line-height: 1.5; }
            .border-box { border: 2px dashed #000; padding: 30px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .field { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .label { font-weight: bold; }
            .total-box { margin-top: 25px; border-top: 2px dashed #000; padding-top: 15px; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #777; }
            @media print {
              body { padding: 0; }
              .border-box { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="border-box">
            <div class="header">
              <div class="logo">GAIM INTERNET</div>
              <div style="font-size: 11px; margin-top: 5px;">PT GAIM INTERNET NUSANTARA</div>
              <div style="font-size: 11px;">Koneksi Rumah Berkecepatan Tinggi</div>
            </div>
            
            <div class="field">
              <span class="label">NO INVOICE:</span>
              <span>${inv.invoiceNumber}</span>
            </div>
            <div class="field">
              <span class="label">PERIODE TAGIHAN:</span>
              <span>${inv.month}</span>
            </div>
            <div class="field">
              <span class="label">TANGGAL TERBIT:</span>
              <span>${new Date(inv.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            <div class="field">
              <span class="label">NAMA PELANGGAN:</span>
              <span>${inv.customerName}</span>
            </div>
            <div class="field">
              <span class="label">PAKET INTERNET:</span>
              <span>${inv.packageName}</span>
            </div>
            <div class="field">
              <span class="label">STATUS PEMBAYARAN:</span>
              <span style="color: ${inv.status === 'paid' ? 'green' : 'red'}; font-weight: bold;">
                ${inv.status === 'paid' ? 'LUNAS (PAID)' : 'BELUM DIBAYAR (UNPAID)'}
              </span>
            </div>

            <div class="total-box">
              <span>TOTAL TAGIHAN:</span>
              <span>${formatRupiah(inv.packagePrice)}</span>
            </div>

            <div class="footer">
              <p>Terima kasih telah menggunakan layanan GAIM Internet!</p>
              <p>Invoice ini sah dicetak secara digital dan dapat digunakan sebagai bukti pembayaran resmi.</p>
              <p>--------------------------------------------------</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printableWindow.document.close();
  };

  // Login Gate Render
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center transition-colors" id="admin-login-gate">
        <div className="max-w-4xl w-full mb-4 flex justify-between items-center">
          <button
            onClick={() => {
              if (onBackToLanding) onBackToLanding();
              else window.location.hash = '#beranda';
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Website Utama</span>
          </button>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 shadow-xs cursor-pointer"
              title="Toggle Mode Gelap/Terang"
            >
              {isDarkMode ? <Sun className="h-4 w-4 fill-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>
          )}
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800" id="admin-login-card">
          
          <div className="p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6">
                <Database className="h-6 w-6" />
                <span className="text-xs font-black uppercase tracking-widest font-mono">Firebase Cloud Firestore</span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Login Portal Administrator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Akses dashboard otentikasi aman terhubung ke database Cloud Firestore untuk memantau pendaftaran, IP Address, tagihan, dan manajemen akun admin.
              </p>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 mt-6">
                <div className="space-y-1">
                  <label htmlFor="login-username" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Username Administrator:</label>
                  <div className="relative">
                    <input
                      id="login-username"
                      type="text"
                      required
                      placeholder="Masukkan username (contoh: admin)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="login-password" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Kata Sandi (Password):</label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type="password"
                      required
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 p-3 rounded-lg border border-red-100 dark:border-red-900 animate-pulse">
                    ⚠️ {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memverifikasi ke Database Firestore...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Masuk ke Dashboard Admin
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-slate-950 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 text-slate-300 font-mono text-[11px] min-h-[300px] md:min-h-auto">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="font-bold text-[10px] tracking-wider uppercase text-slate-300">FIRESTORE_AUTH_CONSOLE</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">FIRESTORE_AUTH_QUERY:</span>
                <p className="text-emerald-400 font-bold whitespace-pre-wrap break-all leading-normal">
                  db.collection(&apos;admin_users&apos;)
                  <br />&nbsp;&nbsp;.where(&apos;username&apos;, &apos;==&apos;, &apos;{username || '...'}&apos;)
                  <br />&nbsp;&nbsp;.get()
                </p>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[180px] md:max-h-[250px] space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-slate-400 scrollbar-thin">
                {sqlConsoleLogs.map((log, index) => (
                  <div key={index} className="leading-normal break-words font-mono text-[10px]">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-500">
              <span>CLOUD: Google Cloud Firestore</span>
              <span className="text-emerald-500 font-bold animate-pulse">● DATABASE ONLINE</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Filter pending orders by search query
  const filteredPending = pendingOrders.filter(o => 
    o.customerName.toLowerCase().includes(regSearch.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(regSearch.toLowerCase()) ||
    o.packageName.toLowerCase().includes(regSearch.toLowerCase())
  );

  // Filter active customers by search query
  const filteredActive = activeOrders.filter(o => 
    o.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (o.ipAddress && o.ipAddress.includes(customerSearch))
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 transition-colors" id="admin-main-view">
      
      {/* MOBILE BAR */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-40 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onBackToLanding) onBackToLanding();
              else window.location.hash = '#beranda';
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            title="Kembali ke Website Utama"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Database className="h-5 w-5 text-blue-500" />
          <span className="font-black text-xs uppercase tracking-widest">GAIM CORE ADMIN</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 hover:bg-slate-800 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0 md:translate-x-0'}
        ${isSidebarOpen ? 'block' : 'hidden md:flex'}
      `} id="admin-sidebar">
        
        <div className="flex flex-col h-full justify-between">
          
          <div>
            {/* Sidebar Brand Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <h1 className="text-sm font-black text-white tracking-wider uppercase leading-none">GAIM Net</h1>
                  <span className="text-[9px] text-emerald-400 font-bold block mt-1 tracking-widest font-mono">SECURE CONSOLE</span>
                </div>
              </div>
              <button 
                className="md:hidden p-1 text-slate-400 hover:text-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs List */}
            <nav className="p-4 space-y-1" id="sidebar-nav-tabs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">Monitor Utama</span>
              
              <button
                onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4" />
                  <span>Ringkasan Keuangan</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('registrations'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'registrations' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Persetujuan Pendaftaran</span>
                </div>
                {pendingOrders.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse shrink-0">
                    {pendingOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('customers'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'customers' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4" />
                  <span>Pelanggan & IP Address</span>
                </div>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded shrink-0">
                  {activeOrders.length}
                </span>
              </button>

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block pt-4 mb-2">Penagihan & Transaksi</span>

              <button
                onClick={() => { setActiveTab('invoices'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'invoices' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4" />
                  <span>Tagihan Bulanan</span>
                </div>
                {unpaidInvoices.length > 0 && (
                  <span className="bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shrink-0">
                    {unpaidInvoices.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('earnings'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'earnings' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4" />
                  <span>Log Audit Pendapatan</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('sqlConsole'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sqlConsole' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className="h-4 w-4" />
                  <span>Cloud Database Manager</span>
                </div>
              </button>

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block pt-4 mb-2">Keamanan & Sistem</span>

              <button
                onClick={() => { setActiveTab('adminUsers'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'adminUsers' ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Kelola Akun Admin (Firestore)</span>
                </div>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded shrink-0">
                  {adminUsersList.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Sidebar footer with user info & logout */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs">
                {sessionStorage.getItem('admin_fullname')?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-extrabold text-white block truncate">
                  {sessionStorage.getItem('admin_fullname') || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  {sessionStorage.getItem('admin_role') || 'Super Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onBackToLanding) onBackToLanding();
                else window.location.hash = '#beranda';
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              Lihat Website Publik
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-900 text-red-200 text-[11px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar Sesi Admin
            </button>
          </div>

        </div>
      </aside>

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen" id="admin-main-content">
        
        {/* TOP STATUS BAR ACCENTS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              LIVE MONITORING SYSTEM
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {activeTab === 'overview' && 'Ringkasan Statistik Keuangan & Jaringan'}
              {activeTab === 'registrations' && 'Persetujuan Registrasi Baru'}
              {activeTab === 'customers' && 'Manajemen Pelanggan & Alokasi IP'}
              {activeTab === 'invoices' && 'Sistem Penerbitan Tagihan Masal'}
              {activeTab === 'earnings' && 'Log Transaksi & Pengawasan Kas'}
              {activeTab === 'sqlConsole' && 'Secure PostgreSQL Admin Client'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <button
              onClick={() => {
                if (onBackToLanding) onBackToLanding();
                else window.location.hash = '#beranda';
              }}
              className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-bold"
              title="Kembali ke Tampilan Website Publik"
            >
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Website Publik</span>
            </button>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                id="admin-theme-toggle"
                className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 py-2 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-bold"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-4 w-4 fill-amber-400 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900 py-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs font-mono">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-700 dark:text-slate-200">WIB: {currentTime.toLocaleTimeString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* ==================================== */}
        {/* TAB 1: OVERVIEW & GENERAL METRICS */}
        {/* ==================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                <div className="absolute right-4 top-4 text-emerald-100 bg-emerald-50 dark:bg-emerald-950/80 p-2 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Akumulasi Pendapatan</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block mt-2">{formatRupiah(totalRevenueAllTime)}</span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Lunas dari aktivasi & tagihan terbayar</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                <div className="absolute right-4 top-4 text-blue-100 bg-blue-50 dark:bg-blue-950/80 p-2 rounded-2xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Pelanggan Aktif</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block mt-2">{activeOrders.length} Users</span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Status aktif & teralokasikan IP</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                <div className="absolute right-4 top-4 text-amber-100 bg-amber-50 dark:bg-amber-950/80 p-2 rounded-2xl">
                  <ShoppingCart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Registrasi Pending</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block mt-2">{pendingOrders.length} Antrean</span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Menunggu persetujuan manual admin</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                <div className="absolute right-4 top-4 text-red-100 bg-red-50 dark:bg-red-950/80 p-2 rounded-2xl">
                  <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Piutang Tagihan</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block mt-2">{formatRupiah(unpaidInvoicesTotalAmount)}</span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Total {unpaidInvoices.length} tagihan belum terbayar</p>
              </div>

            </div>

            {/* Income Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Earnings breakdown over months */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-6 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Performa Pemasukan Bulanan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monitoring real-time transaksi yang disetujui</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="select-revenue-month" className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Bulan:</label>
                    <input
                      id="select-revenue-month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total Pemasukan Bulan Ini:</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatRupiah(currentMonthRevenue)}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <span>Jumlah Transaksi: </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm block">
                      {earnings.filter(e => e.date.startsWith(selectedMonth)).length} Transaksi
                    </span>
                  </div>
                </div>

                {/* Simulated Chart using Pure Tailwind */}
                <div className="space-y-3.5">
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Visualisasi Transaksi per Paket (Bulan Terpilih):</span>
                  
                  {['BASIC', 'FAMILY', 'PREMIUM'].map(pkgName => {
                    const filteredEarnings = earnings.filter(e => e.date.startsWith(selectedMonth) && e.packageName === pkgName);
                    const packageRevenue = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
                    const pct = currentMonthRevenue > 0 ? (packageRevenue / currentMonthRevenue) * 100 : 0;
                    
                    return (
                      <div key={pkgName} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>Paket {pkgName}</span>
                          <span>{formatRupiah(packageRevenue)} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${pct || 2}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              pkgName === 'BASIC' ? 'bg-sky-500' :
                              pkgName === 'FAMILY' ? 'bg-indigo-600' : 'bg-purple-600'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Info Panel */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col justify-between border border-slate-800">
                <div className="absolute right-0 bottom-0 text-slate-800 opacity-20 pointer-events-none translate-y-8 translate-x-8">
                  <Layers className="h-44 w-44" />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">SISTEM DIAGNOSTIK</span>
                  </div>
                  
                  <h4 className="text-base font-black tracking-tight">Status Kapasitas Server & IP</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sistem GAIM secara otomatis memantau ketersediaan slot alamat IP subnet pelanggan lokal (192.168.10.0/24).
                  </p>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">IP Subnet:</span>
                      <span className="text-slate-300">192.168.10.0/24</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">IP Terpakai:</span>
                      <span className="text-emerald-400 font-bold">{activeOrders.filter(o => o.ipAddress).length} Host</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">IP Tersedia:</span>
                      <span className="text-blue-400 font-bold">{254 - activeOrders.filter(o => o.ipAddress).length} Host</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs relative z-10">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Gateway Status:</span>
                  <span className="text-emerald-500 font-black flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    ONLINE
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* TAB 2: REGISTRATIONS (BULK / ALL APPROVE) */}
        {/* ==================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Persetujuan Manual</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Daftar pendaftaran masuk yang membutuhkan verifikasi pembayaran serta alokasi IP Address.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Select All Checkbox Action Button */}
                  {pendingOrders.length > 0 && (
                    <>
                      <button
                        onClick={handleSelectAllPending}
                        className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
                      >
                        {selectedRegIds.length === pendingOrders.length ? 'Deselect All' : 'Select All'}
                      </button>

                      <button
                        disabled={selectedRegIds.length === 0}
                        onClick={handleBulkApprove}
                        className="px-3.5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Check className="h-4 w-4" />
                        Setujui Terpilih ({selectedRegIds.length})
                      </button>

                      <button
                        disabled={selectedRegIds.length === 0}
                        onClick={handleBulkReject}
                        className="px-3.5 py-2 text-xs font-bold bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 disabled:bg-slate-50 dark:disabled:bg-slate-800/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 disabled:text-slate-400 rounded-xl transition-all cursor-pointer"
                      >
                        Tolak Terpilih
                      </button>

                      <button
                        onClick={handleApproveAllPending}
                        className="px-3.5 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <CheckCircle className="h-4 w-4 animate-bounce" />
                        Setujui Semua ({pendingOrders.length})
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Filter search box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pendaftaran pending berdasarkan nama, nomor, atau paket..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>

              {/* Table list */}
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <ShoppingCart className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Tidak ada antrean pendaftaran baru</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                    Seluruh pendaftaran dari calon pelanggan telah disetujui (aktif) atau ditolak.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 w-10 text-center">
                          <button 
                            type="button"
                            onClick={handleSelectAllPending}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 inline-block focus:outline-hidden"
                          >
                            {selectedRegIds.length === pendingOrders.length ? (
                              <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Pelanggan / Tiket</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Paket Pilihan</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Alamat Pasang</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Pilihan Bank</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Nama Pemegang Rek.</th>
                        <th className="p-3 text-right uppercase tracking-wider text-[11px]">Aksi Manual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredPending.map(o => {
                        const isSelected = selectedRegIds.includes(o.id);
                        return (
                          <tr key={o.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/50' : ''}`}>
                            <td className="p-3 text-center">
                              <button 
                                type="button"
                                onClick={() => handleToggleSelectReg(o.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-hidden shrink-0 inline-block"
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                            <td className="p-3 space-y-1">
                              <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{o.customerName}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{o.orderNumber}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{o.customerPhone}</span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="font-bold text-blue-600 dark:text-blue-400 block">Paket {o.packageName}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{o.packageSpeed}</span>
                              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-black block">{formatRupiah(o.packagePrice)}</span>
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={o.customerAddress}>
                              {o.customerAddress}
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                                {o.transferBank || 'BELUM SET'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">
                              {o.senderName || '-'}
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  const customIp = prompt('Masukkan alokasi IP Address untuk pelanggan ini (atau biarkan kosong untuk alokasi otomatis):', `192.168.10.${Math.floor(15 + Math.random() * 230)}`);
                                  if (customIp === null) return; // cancel
                                  onApproveOrder(o.id, customIp || undefined);
                                }}
                                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 p-1.5 rounded-lg transition-all cursor-pointer font-bold text-[10px]"
                                title="Setujui Pembayaran"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => onRejectOrder(o.id)}
                                className="bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 p-1.5 rounded-lg transition-all cursor-pointer font-bold text-[10px]"
                                title="Tolak Pesanan"
                              >
                                Tolak
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 3: CUSTOMER MANAGER & IP ALLOCATION */}
        {/* ==================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in" id="admin-customer-tab">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pelanggan Terdaftar (Active Customers)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Seluruh pelanggan dengan status aktif beserta alokasi IP Address lokal LAN jaringan fiber optik.</p>
                </div>
                
                <button
                  onClick={() => setIsAddingManual(true)}
                  className="px-4 py-2.5 text-xs font-black bg-slate-900 dark:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-sm shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Pelanggan Manual
                </button>
              </div>

              {/* Search customer list */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pelanggan berdasarkan nama, nomor invoice, atau IP Address..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>

              {/* Table active customers */}
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <Users className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada pelanggan aktif</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                    Setujui pesanan baru di tab &quot;Persetujuan Pendaftaran&quot; atau tambahkan pelanggan tunai secara manual di atas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 uppercase tracking-wider text-[11px]">Pelanggan / Alamat</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Kontak WA</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Paket Terpasang</th>
                        <th className="p-3 font-mono uppercase tracking-wider text-[11px]">Alokasi IP Address</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Tanggal Aktif</th>
                        <th className="p-3 text-right uppercase tracking-wider text-[11px]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredActive.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 space-y-1">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{cust.customerName}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{cust.orderNumber}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[250px]" title={cust.customerAddress}>
                              {cust.customerAddress}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold font-mono">
                            {cust.customerPhone}
                          </td>
                          <td className="p-3 space-y-0.5">
                            <span className="font-black text-indigo-700 dark:text-indigo-400 block">Paket {cust.packageName}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{cust.packageSpeed}</span>
                          </td>
                          <td className="p-3 font-mono">
                            {cust.ipAddress ? (
                              <span className="bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold border border-blue-100 dark:border-blue-900">
                                {cust.ipAddress}
                              </span>
                            ) : (
                              <span className="bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100 dark:border-amber-900 animate-pulse">
                                Belum Terpencar IP
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 font-mono">
                            {cust.approvedAt ? new Date(cust.approvedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openEditCustomer(cust)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all cursor-pointer font-bold inline-flex items-center gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit / IP
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* MODAL: Edit Customer IP Address Details */}
            {editingCustomer && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">Ubah Informasi Pelanggan</h3>
                    <button 
                      onClick={() => setEditingCustomer(null)}
                      className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCustomerEdit} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="edit-cust-name" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Nama Lengkap:</label>
                      <input
                        id="edit-cust-name"
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="edit-cust-phone" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">No. WhatsApp:</label>
                      <input
                        id="edit-cust-phone"
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="edit-cust-address" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Alamat Pemasangan:</label>
                      <textarea
                        id="edit-cust-address"
                        required
                        rows={2}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="edit-cust-ip" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Alokasi IP Address Lokal:</label>
                      <input
                        id="edit-cust-ip"
                        type="text"
                        required
                        placeholder="Contoh: 192.168.10.123"
                        value={editIp}
                        onChange={(e) => setEditIp(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="edit-cust-package" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Paket Internet:</label>
                      <select
                        id="edit-cust-package"
                        value={editPkg}
                        onChange={(e) => setEditPkg(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {DEFAULT_PACKAGES.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.speed}) - {formatRupiah(p.price)}/bln</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                        className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL: Add Customer Manual Entry */}
            {isAddingManual && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-4 flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
                    <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                      <Plus className="h-5 w-5 text-blue-600" />
                      Registrasi Pelanggan Manual (Lunas Cash)
                    </h3>
                    <button 
                      onClick={() => setIsAddingManual(false)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddManualSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
                    <div className="space-y-1">
                      <label htmlFor="manual-cust-name" className="text-xs font-bold text-slate-700 block">Nama Lengkap Sesuai KTP:</label>
                      <input
                        id="manual-cust-name"
                        type="text"
                        required
                        placeholder="Contoh: Ahmad Subarjo"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="manual-cust-phone" className="text-xs font-bold text-slate-700 block">No. WhatsApp:</label>
                        <input
                          id="manual-cust-phone"
                          type="tel"
                          required
                          placeholder="Contoh: 0812XXXXXXXX"
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="manual-cust-email" className="text-xs font-bold text-slate-700 block">Alamat Email:</label>
                        <input
                          id="manual-cust-email"
                          type="email"
                          placeholder="budi@gmail.com"
                          value={manualEmail}
                          onChange={(e) => setManualEmail(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="manual-cust-address" className="text-xs font-bold text-slate-700 block">Alamat Pemasangan Lengkap:</label>
                      <textarea
                        id="manual-cust-address"
                        required
                        rows={2}
                        placeholder="Detail RT/RW dan Kelurahan"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="manual-cust-ip" className="text-xs font-bold text-slate-700 block">IP Address (Opsional, Kosongkan untuk Auto):</label>
                        <input
                          id="manual-cust-ip"
                          type="text"
                          placeholder="Contoh: 192.168.10.15"
                          value={manualIpAddress}
                          onChange={(e) => setManualIpAddress(e.target.value)}
                          className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="manual-cust-pkg" className="text-xs font-bold text-slate-700 block">Pilihan Paket:</label>
                        <select
                          id="manual-cust-pkg"
                          value={manualPkgId}
                          onChange={(e) => setManualPkgId(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
                        >
                          {DEFAULT_PACKAGES.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.speed}) - {formatRupiah(p.price)}/bln</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 shrink-0 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingManual(false)}
                        className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
                      >
                        Simpan & Daftarkan Aktif
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 4: MASS BILLING (TAGIHAN MASAL) */}
        {/* ==================================== */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-fade-in" id="admin-billing-tab">
            
            {/* Mass billing trigger module */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center transition-colors">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-wider font-mono">Sistem Invoice Masal GAIM</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Menerbitkan Tagihan Bulanan Secara Masal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gunakan modul ini untuk menerbitkan invoice tagihan bulanan kepada <span className="font-extrabold text-slate-900 dark:text-slate-100">{activeOrders.length} Pelanggan Aktif</span> secara sekaligus. Pelanggan yang sudah memiliki tagihan pada bulan terpilih akan di-skip untuk mencegah duplikasi.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="select-billing-month" className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Pilih Periode Tagihan:</label>
                  <select
                    id="select-billing-month"
                    value={billingMonth}
                    onChange={(e) => setBillingMonth(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Juli 2026">Juli 2026</option>
                    <option value="Agustus 2026">Agustus 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="Oktober 2026">Oktober 2026</option>
                    <option value="November 2026">November 2026</option>
                    <option value="Desember 2026">Desember 2026</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateMassBilling}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  Terbitkan Tagihan Masal
                </button>

                {billingError && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/60 p-2 rounded border border-red-100 dark:border-red-900 text-center">
                    ⚠️ {billingError}
                  </p>
                )}

                {billingSuccess && (
                  <p className="text-[10px] text-green-700 dark:text-green-400 font-black bg-green-50 dark:bg-green-950/60 p-2 rounded border border-green-100 dark:border-green-900 text-center animate-pulse">
                    ✅ {billingSuccess}
                  </p>
                )}
              </div>
            </div>

            {/* List generated invoices */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Arsip Tagihan Bulanan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Log penagihan invoice beserta status pembayaran.</p>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada tagihan diterbitkan</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                    Mulai dengan mengklik &quot;Terbitkan Tagihan Masal&quot; di atas untuk pelanggan aktif Anda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 uppercase tracking-wider text-[11px]">No. Invoice</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Nama Pelanggan</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Bulan / Periode</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Layanan / Tarif</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Status</th>
                        <th className="p-3 text-right uppercase tracking-wider text-[11px]">Aksi Penagihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {inv.invoiceNumber}
                          </td>
                          <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                            {inv.customerName}
                          </td>
                          <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                            {inv.month}
                          </td>
                          <td className="p-3 space-y-0.5">
                            <span className="font-bold text-blue-600 dark:text-blue-400 block">{inv.packageName}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">{formatRupiah(inv.packagePrice)}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                              inv.status === 'paid' 
                                ? 'bg-green-50 dark:bg-green-950/80 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                                : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}>
                              {inv.status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {inv.status === 'unpaid' && (
                              <button
                                onClick={() => handlePayInvoice(inv.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Bayar Lunas
                              </button>
                            )}
                            <button
                              onClick={() => handlePrintMockInvoice(inv)}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Printer className="h-3 w-3" />
                              Cetak
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(inv.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all cursor-pointer inline-block"
                              title="Hapus Tagihan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 5: EARNINGS MONITORING (AUDIT) */}
        {/* ==================================== */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 animate-fade-in" id="admin-earnings-tab">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Arsip Laporan Audit Kas Masuk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Seluruh penerimaan dana yang telah disetujui (baik aktivasi awal maupun pelunasan tagihan bulanan).</p>
                </div>
                
                <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                  <div className="flex items-center gap-1">
                    <label htmlFor="select-audit-month" className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Filter:</label>
                    <input
                      id="select-audit-month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    Unduh Laporan Audit PDF
                  </button>
                </div>
              </div>

              {/* Earnings table list */}
              {earnings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <DollarSign className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada dana masuk terdaftar</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Pemasukan akan terekam otomatis ketika pesanan baru disetujui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 uppercase tracking-wider text-[11px]">ID Transaksi</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Tanggal Disetujui</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Pelanggan</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Paket Layanan</th>
                        <th className="p-3 uppercase tracking-wider text-[11px]">Jenis Transaksi</th>
                        <th className="p-3 text-right uppercase tracking-wider text-[11px]">Nominal Masuk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {earnings.filter(e => e.date.startsWith(selectedMonth)).map(earn => (
                        <tr key={earn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-500 dark:text-slate-400">
                            {earn.id.slice(0, 15)}...
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300 font-mono font-semibold">
                            {earn.date}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                            {earn.customerName}
                          </td>
                          <td className="p-3">
                            <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 px-2.5 py-0.5 rounded font-bold">
                              Paket {earn.packageName}
                            </span>
                          </td>
                          <td className="p-3">
                            {earn.id.startsWith('earn-inv-') ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tagihan Bulanan</span>
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400 font-bold">Aktivasi Pemasangan</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900 dark:text-slate-100 font-mono">
                            {formatRupiah(earn.amount)}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Subtotal summary row */}
                      <tr className="bg-blue-50/50 dark:bg-blue-950/40 font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800">
                        <td colSpan={5} className="p-3 text-right text-xs uppercase tracking-wider font-extrabold">TOTAL PENDAPATAN BULAN {selectedMonth.toUpperCase()}:</td>
                        <td className="p-3 text-right font-black text-blue-600 dark:text-blue-400 font-mono text-sm">
                          {formatRupiah(currentMonthRevenue)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* TAB 6: CLOUD FIRESTORE DATABASE MANAGER */}
        {/* ==================================== */}
        {activeTab === 'sqlConsole' && (
          <div className="space-y-6 animate-fade-in" id="admin-sql-tab">
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 text-slate-300 font-mono text-xs flex flex-col min-h-[500px] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-400" />
                  <span className="font-extrabold uppercase tracking-wider text-slate-200">Firebase Cloud Firestore Live Database Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-bold">
                    Real-Time Active
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Firestore Collections Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 shrink-0 font-mono text-[11px]">
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">/orders</span>
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-black">{orders.length} docs</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Pendaftaran & aktivasi pelanggan LAN/FTTH</p>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-400 font-bold">/invoices</span>
                    <span className="bg-sky-950 text-sky-300 text-[10px] px-1.5 py-0.5 rounded font-black">{invoices.length} docs</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Tagihan bulanan & riwayat pembayaran</p>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">/earnings</span>
                    <span className="bg-amber-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-black">{earnings.length} docs</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Log audit kas penerimaan digital</p>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">/admin_users</span>
                    <span className="bg-purple-950 text-purple-300 text-[10px] px-1.5 py-0.5 rounded font-black">{adminUsersList.length} docs</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Kredensial & otentikasi login admin</p>
                </div>
              </div>

              {/* Interactive Database Console Stream */}
              <div className="flex-1 overflow-y-auto space-y-2.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-900 text-slate-400 min-h-[160px] scrollbar-thin">
                <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase border-b border-slate-800/80 pb-1.5 mb-2">
                  DATABASE TRANSACTION & QUERY STREAM
                </div>
                {sqlConsoleLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed break-all font-mono text-[10.5px]">
                    {log}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] text-slate-500 shrink-0 font-mono">
                <span>DATABASE: Google Cloud Firestore (Multi-region Cloud)</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping inline-block" />
                  PERSISTENT CLOUD STORAGE ACTIVE
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* TAB 7: ADMIN USERS & SECURITY (FIRESTORE) */}
        {/* ==================================== */}
        {activeTab === 'adminUsers' && (
          <div className="space-y-6 animate-fade-in" id="admin-users-tab">
            
            {/* Feedback Alerts */}
            {adminActionSuccess && (
              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 flex items-center justify-between text-xs text-green-800 dark:text-green-200 font-bold animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                  <span>{adminActionSuccess}</span>
                </div>
                <button onClick={() => setAdminActionSuccess('')} className="text-green-600 hover:text-green-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {adminActionError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-between text-xs text-red-800 dark:text-red-200 font-bold animate-fade-in">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>{adminActionError}</span>
                </div>
                <button onClick={() => setAdminActionError('')} className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Manajemen Akun Administrator & Staf</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kredensial disimpan langsung secara permanen di database Cloud Firestore koleksi <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono font-bold">admin_users</code>.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingAdmin(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-center cursor-pointer shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  Tambah Akun Admin Baru
                </button>
              </div>

              {/* Admin Accounts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 uppercase tracking-wider text-[11px]">Nama Lengkap</th>
                      <th className="p-3 uppercase tracking-wider text-[11px]">Username Database</th>
                      <th className="p-3 uppercase tracking-wider text-[11px]">Peran / Jabatan</th>
                      <th className="p-3 uppercase tracking-wider text-[11px]">Login Terakhir</th>
                      <th className="p-3 text-right uppercase tracking-wider text-[11px]">Aksi Keamanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {adminUsersList.map(admin => (
                      <tr key={admin.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                            {admin.fullname.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{admin.fullname}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          @{admin.username}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                            admin.role === 'Super Admin'
                              ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : admin.role === 'Finance Billing'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                          }`}>
                            <ShieldCheck className="h-3 w-3" />
                            {admin.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                          {admin.lastLogin 
                            ? new Date(admin.lastLogin).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
                            : 'Belum pernah login'}
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setChangingPasswordUser(admin);
                              setNewPasswordInput('');
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Ganti Password Akun"
                          >
                            <KeyRound className="h-3 w-3 text-amber-500" />
                            Ganti Password
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAdminAccount(admin.id, admin.fullname)}
                            disabled={adminUsersList.length <= 1}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all cursor-pointer inline-block disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Hapus Akun Admin"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Tambah Admin Baru */}
            {isAddingAdmin && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-in">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <UserPlus className="h-5 w-5" />
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Tambah Akun Administrator</h4>
                    </div>
                    <button onClick={() => setIsAddingAdmin(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateAdminUser} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Nama Lengkap Pengguna:</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Rian Pratama"
                        value={newAdminFullname}
                        onChange={(e) => setNewAdminFullname(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Username Login:</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: rian_noc"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Password:</label>
                      <input
                        type="password"
                        required
                        placeholder="Masukkan password aman"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Peran / Hak Akses:</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as AdminUser['role'])}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      >
                        <option value="Super Admin">Super Admin (Akses Penuh)</option>
                        <option value="Finance Billing">Finance Billing (Kelola Tagihan & Kas)</option>
                        <option value="Network Engineer">Network Engineer (IP Address & Approval)</option>
                        <option value="Customer Support">Customer Support (Monitoring Pelanggan)</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAdmin(false)}
                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Simpan ke Firestore
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Ganti Kata Sandi */}
            {changingPasswordUser && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <KeyRound className="h-5 w-5" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Ganti Password Admin</h4>
                    </div>
                    <button onClick={() => setChangingPasswordUser(null)} className="p-1 text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Memperbarui kata sandi untuk akun <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">@{changingPasswordUser.username}</span> ({changingPasswordUser.fullname}).
                  </p>

                  <form onSubmit={handleUpdateAdminPasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Password Baru:</label>
                      <input
                        type="password"
                        required
                        placeholder="Masukkan password baru"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setChangingPasswordUser(null)}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Perbarui Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
