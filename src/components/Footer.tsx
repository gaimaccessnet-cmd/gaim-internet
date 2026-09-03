import { Wifi, Phone, Mail, Clock, MapPin, Facebook, Instagram, Music2 } from 'lucide-react';

interface FooterProps {
  onAdminToggle?: () => void;
}

export default function Footer({ onAdminToggle }: FooterProps) {
  return (
    <footer id="kontak" className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Wifi className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">GAIM</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cepat • Stabil • Terpercaya.
              <br />
              Menghubungkan keluarga, usaha, dan masa depan dengan koneksi internet yang dapat diandalkan setiap saat tanpa hambatan.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-all">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-all" title="TikTok">
                <Music2 className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Contact Us Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white tracking-widest uppercase border-l-2 border-blue-600 pl-2.5">
              Hubungi Kami
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block text-slate-500">Telepon / WhatsApp</span>
                  <a href="https://wa.me/6282124986552" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 font-semibold block transition-colors">
                    0821-2498-6552
                  </a>
                  <a href="https://wa.me/6288200066612" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 font-semibold block transition-colors">
                    088-2000-666-12
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500">Email Resmi</span>
                  <a href="mailto:gaim.access.net@gmail.com" className="text-white hover:text-blue-400 font-semibold mt-0.5 block">gaim.access.net@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500">Jam Operasional</span>
                  <span className="text-white font-medium mt-0.5 block">Setiap Hari: 08.00 - 21.00 WIB</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Visit Us Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white tracking-widest uppercase border-l-2 border-blue-600 pl-2.5">
              Kunjungi Kami
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-500">Kantor Pemasaran Utama</span>
                <p className="text-white leading-relaxed mt-1 font-semibold">
                  G-Net - Jl. H. Gaim
                  <br />
                  Petukangan Utara
                </p>
                <p className="text-[10px] text-slate-500 mt-2">
                  Dapatkan brosur penawaran khusus dan konsultasi langsung gratis biaya kopi di kantor kami.
                </p>
              </div>
            </div>
          </div>

          {/* Service Area Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white tracking-widest uppercase border-l-2 border-blue-600 pl-2.5">
              Area Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#25d366]" />
                <span className="text-white font-medium">Jl Hj Gaim (Petukangan & Sekitarnya)</span>
              </li>
              
              <li className="flex items-center gap-1.5 text-slate-500 italic pl-3">
                <span>Serta kelurahan sekitarnya...</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-slate-600 gap-4">
          <p>© 2026 GAIM Internet. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <span className="text-slate-800">•</span>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
