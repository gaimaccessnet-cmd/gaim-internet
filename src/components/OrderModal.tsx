import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Mail, Phone, MapPin, User, MessageCircle, CreditCard } from 'lucide-react';
import { InternetPackage, CustomerOrder } from '../types';
import { formatRupiah } from '../data';

interface OrderModalProps {
  selectedPackage: InternetPackage | null;
  onClose: () => void;
  onSubmitOrder: (orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => void;
}

export default function OrderModal({ selectedPackage, onClose, onSubmitOrder }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [transferBank, setTransferBank] = useState('BCA');
  const [senderName, setSenderName] = useState('');

  if (!selectedPackage) return null;

  const getWhatsAppUrl = () => {
    const formattedMessage = `*PENDAFTARAN GAIM INTERNET* 🚀

*Data Pelanggan:*
- *Nama Lengkap:* ${customerName}
- *No. WhatsApp:* ${customerPhone}
- *Alamat Email:* ${customerEmail || '-'}
- *Alamat Pemasangan:* ${customerAddress}

*Pilihan Layanan:*
- *Paket:* Paket ${selectedPackage.name}
- *Kecepatan:* ${selectedPackage.speed}
- *Biaya Bulanan:* ${formatRupiah(selectedPackage.price)} (Flat)


Mohon segera diproses dan dijadwalkan survei lokasi pemasangan. Terima kasih!`;

    return `https://wa.me/6282124986552?text=${encodeURIComponent(formattedMessage)}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      return;
    }

    // Submit order data back to main app state
    onSubmitOrder({
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packageSpeed: selectedPackage.speed,
      packagePrice: selectedPackage.price,
    });

    // Auto open WhatsApp in new tab
    const waUrl = getWhatsAppUrl();
    window.open(waUrl, '_blank');
    
    // Proceed to success step
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="order-modal-container">
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Pendaftaran GAIM Internet</h3>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5 tracking-wider uppercase">
              Paket {selectedPackage.name} - {selectedPackage.speed}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            id="btn-close-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-8 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>1</span>
            <span className={step >= 1 ? 'text-blue-600' : 'text-slate-400'}>Isi Data & Pilihan</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-4" />
          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 2 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>2</span>
            <span className={step >= 2 ? 'text-green-600' : 'text-slate-400'}>Selesai & Kirim</span>
          </div>
        </div>

        {/* Body (Scrollable if too tall) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {step === 1 && (
            <form onSubmit={handleFormSubmit} className="space-y-4" id="form-customer-info">
              
              {/* Customer Info Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Data Lengkap Pelanggan:</span>
                
                <div className="space-y-1">
                  <label htmlFor="input-cust-name" className="text-xs font-bold text-slate-700 block">Nama Lengkap Sesuai KTP:</label>
                  <div className="relative">
                    <input
                      id="input-cust-name"
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="input-cust-phone" className="text-xs font-bold text-slate-700 block">No. WhatsApp Aktif:</label>
                    <div className="relative">
                      <input
                        id="input-cust-phone"
                        type="tel"
                        required
                        placeholder="Contoh: 0812XXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="input-cust-email" className="text-xs font-bold text-slate-700 block">Alamat Email (Opsional):</label>
                    <div className="relative">
                      <input
                        id="input-cust-email"
                        type="email"
                        placeholder="Contoh: budi@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="input-cust-address" className="text-xs font-bold text-slate-700 block">Alamat Pemasangan Lengkap (Sertakan RT/RW & Kelurahan):</label>
                  <div className="relative">
                    <textarea
                      id="input-cust-address"
                      required
                      rows={2}
                      placeholder="Contoh: Perumahan Indah Blok C5 No. 12, RT 02/RW 08, Kel. Mekarjaya, Kec. Sukmajaya"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm focus:outline-hidden resize-none"
                    />
                    <MapPin className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Payment Section Combined in Single View */}
              
              {/* Total Package Details */} 

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mt-6">
                <div>
                  <span className="text-xs text-slate-400 block">Total Biaya Bulanan (Flat)</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-blue-600">{formatRupiah(selectedPackage.price)}</span>
                    {selectedPackage.originalPrice && (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        {formatRupiah(selectedPackage.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-blue-600/5 px-3 py-1.5 rounded-lg border border-blue-100 text-right">
                  <span className="text-[10px] font-black text-blue-600 uppercase block">
                    {selectedPackage.isPromo ? 'Promo Terpilih' : 'Paket Terpilih'}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{selectedPackage.name} ({selectedPackage.speed})</span>
                </div>
              </div>

              <div className="pt-4 shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-order-wa"
                  className="flex-1 bg-[#25d366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Daftar & Kirim WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-6 space-y-6 animate-scale-up" id="order-success-pane">
              <div className="mx-auto bg-green-50 text-green-600 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-green-100 shadow-md">
                <CheckCircle2 className="h-10 w-10 stroke-[2.5] animate-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Pendaftaran Sukses & Terkirim!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Terima kasih <span className="font-bold text-slate-800">{customerName}</span>. Langkah selanjutnya adalah memastikan data pendaftaran ini terkirim langsung ke WhatsApp Admin GAIM untuk verifikasi cepat.
                </p>
              </div>

              {/* High profile WhatsApp action button */}
              <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span className="text-xs font-black uppercase tracking-wider">KIRIM SEKARANG VIA WHATSAPP:</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-normal">
                  Sistem telah menyiapkan format pendaftaran otomatis. Silakan klik tombol di bawah ini jika aplikasi WhatsApp Anda tidak terbuka secara otomatis.
                </p>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366] text-white py-3.5 px-6 rounded-xl font-extrabold text-sm hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                  id="btn-send-whatsapp-redirect"
                >
                  <MessageCircle className="h-5 w-5 fill-white" />
                  Kirim Data ke WhatsApp (0821-2498-6552)
                </a>
              </div>

              {/* Status instructions for the user */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-2.5 max-w-md mx-auto">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">INFORMASI STATUS & PROSES:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Setelah mengirim pesan WhatsApp di atas, Admin GAIM akan segera memverifikasi kelengkapan berkas Anda dan menjadwalkan tim teknisi ke lokasi Anda.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1.5 text-[11px] font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Pendaftaran:</span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase font-black">MENUNGGU VERIFIKASI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rencana Pemasangan:</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase font-black">Survei Lokasi Segera</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer"
                  id="btn-finish-order"
                >
                  Selesai & Kembali ke Beranda
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
