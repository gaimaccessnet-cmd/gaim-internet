import { motion } from 'motion/react';
import { Check, Flame, Sparkles, Crown } from 'lucide-react';
import { InternetPackage } from '../types';
import { DEFAULT_PACKAGES, formatRupiah } from '../data';

interface PackagesProps {
  onSelectPackage: (pkg: InternetPackage) => void;
}

export default function Packages({ onSelectPackage }: PackagesProps) {
  return (
    <section id="paket" className="py-24 bg-slate-50/60 relative border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Pilihan Berlangganan
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Paket Internet GAIM
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Pilih kecepatan dan harga paket bulanan yang sesuai dengan jumlah perangkat serta aktivitas digital keluarga atau bisnis Anda.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {DEFAULT_PACKAGES.map((pkg, index) => {
            const isPromo = pkg.isPromo;
            const isPremium = pkg.name === 'PREMIUM';
            const isBasic = pkg.name === 'BASIC';
            const isPopular = pkg.popular;
            const isDarkCard = isPremium || isPopular || isPromo;
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPremium
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl border-2 border-amber-400/40 hover:border-amber-400/80 hover:shadow-amber-500/10'
                    : isPopular
                    ? 'bg-slate-900 text-white shadow-2xl md:-translate-y-3 ring-2 ring-blue-500/50 hover:shadow-blue-900/20'
                    : isPromo
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-blue-600/50 hover:shadow-blue-900/20'
                    : 'bg-white text-slate-900 shadow-md border border-slate-200/90 hover:border-blue-500 hover:shadow-xl'
                }`}
                id={`package-card-${pkg.id}`}
              >
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] tracking-wider uppercase py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/20 border border-amber-300/40">
                    <Crown className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                    ULTRA SPEED
                  </div>
                )}

                {/* Promo Badge for BASIC */}
                {isPromo && !isPremium && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 font-black text-[11px] tracking-wider uppercase py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="h-3.5 w-3.5 fill-amber-950 text-amber-950" />
                    {pkg.promoBadge || 'PROMO SPESIAL'}
                  </div>
                )}

                {/* Popular Badge for FAMILY */}
                {isPopular && !isPromo && !isPremium && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 font-black text-[11px] tracking-wider uppercase py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-md">
                    <Flame className="h-3.5 w-3.5 fill-amber-950" />
                    TERPOPULER
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Speed */}
                  <div className="text-center pt-2">
                    <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                      isPremium
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                        : isDarkCard 
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      PAKET {pkg.name}
                    </span>
                    <h4 className={`text-4xl font-black tracking-tight mt-3 ${
                      isDarkCard ? 'text-white' : 'text-slate-900'
                    }`}>
                      {pkg.speed}
                    </h4>
                    <p className={`text-xs font-medium mt-2 leading-snug ${
                      isPremium ? 'text-amber-200/80' : isDarkCard ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {pkg.connectionSubtitle || (pkg.name === 'BASIC' ? 'Koneksi Dedicated Tanpa Batasan Kuota (FUP)' : 'Koneksi Broadband')}
                    </p>
                  </div>

                  <div className={`h-px ${
                    isPremium ? 'bg-amber-400/20' : isDarkCard ? 'bg-slate-800' : 'bg-slate-100'
                  }`} />

                  {/* Pricing */}
                  <div className="text-center">
                    {pkg.originalPrice ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs font-bold text-slate-400 line-through">
                            {formatRupiah(pkg.originalPrice)}
                          </span>
                          <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Hemat {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                          </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-white">
                          {formatRupiah(pkg.price)}
                        </div>
                        <span className={`text-xs font-semibold block ${isDarkCard ? 'text-slate-400' : 'text-slate-500'}`}>/ bulan</span>
                      </div>
                    ) : (
                      <div>
                        <span className={`text-3xl sm:text-4xl font-black ${
                          isPremium
                            ? 'text-white drop-shadow-sm'
                            : isDarkCard
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}>
                          {formatRupiah(pkg.price)}
                        </span>
                        <span className={`text-xs font-semibold block mt-1 ${
                          isPremium ? 'text-amber-200/70' : isDarkCard ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          / bulan
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`h-px ${
                    isPremium ? 'bg-amber-400/20' : isDarkCard ? 'bg-slate-800' : 'bg-slate-100'
                  }`} />

                  {/* Features */}
                  <ul className="space-y-3.5">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm">
                        <span className={`p-1 rounded-full mt-0.5 shrink-0 ${
                          isPremium
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : isBasic
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isDarkCard 
                            ? 'bg-blue-600/30 text-blue-400' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                        <span className={`font-medium ${
                          isPremium ? 'text-slate-100' : isDarkCard ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit Action */}
                <div className="pt-8 mt-6">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    id={`btn-select-pkg-${pkg.id}`}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-xs cursor-pointer transition-all active:scale-95 ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30'
                        : isBasic
                        ? 'bg-emerald-500 text-white font-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20'
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 mt-12 italic">
          * Harga flat sudah termasuk sewa ONT Router Wifi, belum termasuk biaya instalasi pertama kali (sekali bayar).
          <br />
          Hubungi tim penjualan kami untuk mendapatkan informasi promo gratis instalasi bulan ini.
        </p>

      </div>
    </section>
  );
}
