import { motion } from 'motion/react';
import { Wifi, Zap, BadgePercent, Wrench, Smile } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Wifi className="h-6 w-6 text-blue-600" />,
      title: 'Koneksi Stabil',
      description: 'Internet cepat dan stabil menggunakan teknologi Fiber murni untuk semua kebutuhan streaming, browsing, dan belajar Anda.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: 'Respon Cepat',
      description: 'Kendala atau gangguan pada jaringan ditangani secepat mungkin secara prioritas oleh tim teknis tanggap kami.',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      icon: <BadgePercent className="h-6 w-6 text-green-600" />,
      title: 'Harga Terjangkau',
      description: 'Paket berlangganan internet lengkap disesuaikan kebutuhan bulanan Anda dengan harga yang sangat bersahabat.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100'
    },
    {
      icon: <Wrench className="h-6 w-6 text-cyan-600" />,
      title: 'Teknisi Lokal',
      description: 'Kantor dan tim kami sangat dekat dengan lokasi Anda, memudahkan pemasangan serta perawatan infrastruktur fisik.',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100'
    },
    {
      icon: <Smile className="h-6 w-6 text-pink-600" />,
      title: 'Layanan Ramah',
      description: 'Tim customer care kami siap melayani semua pertanyaan Anda dengan komunikatif, tulus, dan solutif.',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100'
    }
  ];

  return (
    <section id="tentang-kami" className="py-20 bg-slate-50 relative border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Keunggulan Kami</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kenapa Memilih GAIM Internet?
          </h3>
          <p className="text-base text-slate-500">
            Kami mengutamakan kepuasan pelanggan dengan menyediakan konektivitas prima, 
            layanan pelanggan responsif, serta harga yang transparan tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              id={`feature-card-${index}`}
            >
              <div className="space-y-4">
                <div className={`p-3 rounded-xl ${feat.bgColor} w-fit`}>
                  {feat.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">{feat.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
              <div className="pt-4 mt-auto">
                <div className="w-8 h-1 bg-blue-600/25 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
