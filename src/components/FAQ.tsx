import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Apakah internet GAIM benar-benar unlimited tanpa FUP?',
      a: 'Ya, seluruh paket internet GAIM menggunakan teknologi serat optik murni 100% dengan kuota tanpa batas (unlimited) tanpa adanya batasan kuota penurunan kecepatan atau Fair Usage Policy (FUP). Anda bebas mendownload dan mengupload sepuasnya kapan saja.'
    },
    {
      q: 'Berapa lama proses instalasi sejak melakukan pendaftaran?',
      a: 'Proses instalasi normal memakan waktu 1 hingga maksimal 3 hari kerja setelah survei lokasi Anda dinyatakan tercover oleh tim teknis kami. Jadwal penarikan kabel akan disepakati bersama oleh tim penjadwalan kami.'
    },
    {
      q: 'Bagaimana sistem pembayaran bulanan internet GAIM?',
      a: 'Pembayaran bersifat pascabayar atau prabayar tergantung kesepakatan awal. Admin kami akan mengirimkan invoice bulanan di tanggal jatuh tempo Anda, kemudian Anda dapat melakukan transfer bank manual dan mengonfirmasikannya di portal web ini agar diaktivasi kembali oleh admin.'
    },
    {
      q: 'Apakah ada kontrak berlangganan minimum?',
      a: 'Ya, kami menerapkan kontrak berlangganan minimum selama 12 bulan demi menjaga kualitas pelayanan flat tanpa kenaikan harga mendadak. Pemutusan dini sebelum masa kontrak berakhir dapat dikenakan biaya penalti administrasi.'
    },
    {
      q: 'Apakah biaya perangkat router WiFi dipinjamkan atau dibeli?',
      a: 'Selama masa aktif berlangganan, seluruh perangkat seperti ONT Router WiFi dipinjamkan secara gratis (hak sewa). Apabila masa berlangganan berakhir, perangkat tersebut akan diambil kembali oleh teknisi resmi kami.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">FAQ</span>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight" id="faq-title">
            Pertanyaan Umum
          </h3>
          <p className="text-base text-slate-500">
            Temukan jawaban cepat mengenai prosedur pendaftaran, teknis instalasi, billing pembayaran, dan informasi penunjang lainnya.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4" id="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden shadow-xs ${
                  isOpen ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                id={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform text-slate-400 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-blue-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 text-sm text-slate-600 leading-relaxed bg-white">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
