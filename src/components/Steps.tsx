import { PhoneCall, MapPin, Wrench, Wifi, ArrowRight } from 'lucide-react';

export default function Steps() {
  const steps = [
    {
      num: '1',
      title: 'Hubungi Kami',
      desc: 'Kirim koordinat lokasi atau alamat lengkap Anda kepada tim admin melalui WhatsApp.',
      icon: <PhoneCall className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      num: '2',
      title: 'Survei Lokasi',
      desc: 'Kami melakukan pengecekan tiang ODP terdekat untuk memastikan jaringan tersedia di rumah Anda.',
      icon: <MapPin className="h-6 w-6 text-amber-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      num: '3',
      title: 'Pemasangan',
      desc: 'Teknisi datang ke lokasi Anda sesuai jadwal kesepakatan untuk penarikan kabel dan pasang Router WiFi.',
      icon: <Wrench className="h-6 w-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      num: '4',
      title: 'Internet Siap',
      desc: 'Aktivasi selesai! Selamat menikmati koneksi internet super cepat, unlimited, dan stabil.',
      icon: <Wifi className="h-6 w-6 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    }
  ];

  return (
    <section id="cara" className="py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Langkah Mudah</span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" id="steps-title">
            Cara Berlangganan GAIM
          </h3>
          <p className="text-base text-gray-500">
            Ikuti 4 proses sederhana berikut untuk memasang internet fiber terbaik di tempat tinggal atau perkantoran Anda.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center text-center group" id={`step-item-${idx}`}>
              
              {/* Connector Arrow for Large Screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[70%] w-full h-0.5 border-t-2 border-dashed border-gray-200 z-0" />
              )}

              {/* Step Circle with Icon */}
              <div className="relative z-10 flex items-center justify-center mb-5">
                <div className={`p-5 rounded-2xl ${step.bgColor} border-2 ${step.borderColor} shadow-xs group-hover:scale-105 transition-all`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 rounded-full font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  {step.num}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 max-w-xs px-2">
                <h4 className="text-base font-extrabold text-gray-900">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
