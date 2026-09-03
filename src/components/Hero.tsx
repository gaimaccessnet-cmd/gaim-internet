import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, Wifi, Zap, BadgePercent, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onOpenContact: () => void;
}

export default function Hero({ onRegisterClick, onOpenContact }: HeroProps) {
  return (
    <section id="beranda" className="relative bg-gradient-to-b from-blue-50/70 via-white to-white overflow-hidden py-16 sm:py-24">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#004aad08_1px,transparent_1px),linear-gradient(to_bottom,#004aad08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-10 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600"
            >
              <Zap className="h-3.5 w-3.5 fill-blue-600" />
              Koneksi Fiber Optic 100% Murni
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
                id="hero-title"
              >
                Internet Cepat. <br />
                <span className="text-blue-600">Stabil. Selalu Dekat.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                id="hero-description"
              >
                GAIM Internet menyediakan layanan internet rumah dan bisnis dengan koneksi stabil, 
                harga terjangkau, serta pelayanan cepat dari tim lokal untuk mendukung semua aktivitas digital Anda.
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={onRegisterClick}
                id="btn-register-hero"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg scale-100 hover:scale-[1.02] cursor-pointer"
              >
                Daftar Sekarang
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={onOpenContact}
                id="btn-whatsapp-hero"
                className="flex items-center justify-center gap-2 bg-white border-2 border-[#25d366] text-[#25d366] px-8 py-4 rounded-xl font-bold hover:bg-[#25d366]/5 transition-all scale-100 hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 fill-[#25d366]" />
                Hubungi WhatsApp
              </button>
            </motion.div>

            {/* Floating Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 text-left max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                  <Wifi className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Koneksi Stabil</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-50 text-[#25d366]">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Respon Cepat</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                  <BadgePercent className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Harga Terbaik</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Network Tower Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-sm sm:max-w-md aspect-square bg-blue-600 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col justify-between p-8"
              id="hero-visual"
            >
              {/* Background Accent Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Decorative Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-300 rounded-full blur-2xl opacity-40" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-50" />

              {/* Card Top: Branding */}
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Wifi className="h-4 w-4 text-white animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-widest">GAIM NET</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  Keamanan Terjamin
                </div>
              </div>

              {/* Card Middle: Interactive Vector Representation of a Tower */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                {/* Wifi Waves */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                    className="absolute w-24 h-24 rounded-full border border-white/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.6], opacity: [0.7, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 0.8 }}
                    className="absolute w-24 h-24 rounded-full border border-white/40"
                  />
                  <div className="bg-white text-blue-600 p-4 rounded-full shadow-lg z-10 relative">
                    <Wifi className="h-10 w-10 animate-bounce" />
                  </div>
                </div>

                {/* Connection Lines & Points */}
                <div className="mt-6 text-center">
                  <span className="text-white text-sm font-bold tracking-wider uppercase block">Jaringan Ultra Stabil</span>
                  <span className="text-blue-100 text-xs block mt-1">Teknologi Fiber to the Home (FTTH)</span>
                </div>
              </div>

              {/* Card Bottom: Stats */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-2xl font-black text-white block">99.9%</span>
                  <span className="text-[10px] text-blue-100 uppercase font-semibold">Uptime SLA</span>
                </div>
                <div className="border-l border-white/10">
                  <span className="text-2xl font-black text-white block">&lt; 10ms</span>
                  <span className="text-[10px] text-blue-100 uppercase font-semibold">Latency Rendah</span>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
