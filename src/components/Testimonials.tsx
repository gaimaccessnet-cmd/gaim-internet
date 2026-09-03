import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Andi Pratama',
      role: 'Pelanggan Rumah',
      initials: 'AP',
      text: '"Internetnya sangat stabil dan jarang sekali gangguan. Kalau ada kendala teknis ringan, teknisinya sangat cepat tanggap langsung datang ke rumah."',
      avatarBg: 'bg-indigo-100 text-indigo-700'
    },
    {
      name: 'Siti Nurhaliza',
      role: 'Pelanggan Rumah',
      initials: 'SN',
      text: '"Harga paket bulanan sangat terjangkau dengan kecepatan download upload yang konsisten sesuai pilihan paket. Pelayanannya sangat memuaskan!"',
      avatarBg: 'bg-rose-100 text-rose-700'
    },
    {
      name: 'Rizky Maulana',
      role: 'Pelanggan Bisnis',
      initials: 'RM',
      text: '"Sangat membantu kelancaran operasional usaha digital saya. Speed upload sangat cepat dan simetris, membuat pelanggan cafe kami jadi betah."',
      avatarBg: 'bg-emerald-100 text-emerald-700'
    }
  ];

  return (
    <section id="testimoni" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Ulasan Pengguna</span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" id="testimonials-title">
            Testimonial Pelanggan
          </h3>
          <p className="text-base text-slate-500">
            Dengarkan langsung pengalaman jujur dari para pelanggan rumah tangga dan pemilik usaha yang telah menggunakan layanan internet GAIM.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <div
              key={testi.name}
              className="bg-slate-50/50 rounded-xl p-8 border border-slate-200 relative hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
              id={`testi-card-${index}`}
            >
              {/* Quote Icon Overlay */}
              <Quote className="absolute right-6 top-6 h-10 w-10 text-gray-200/50 pointer-events-none" />

              <div className="space-y-4">
                {/* 5-Star Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-600 leading-relaxed italic relative z-10">
                  {testi.text}
                </p>
              </div>

              {/* Profile Details */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-gray-200/50">
                <div className={`h-11 w-11 rounded-full ${testi.avatarBg} font-bold text-sm flex items-center justify-center shrink-0 border border-white shadow-xs`}>
                  {testi.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-none">{testi.name}</h4>
                  <span className="text-xs text-gray-400 mt-1 block font-medium">{testi.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
