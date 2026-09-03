import React, { useState } from 'react';
import { MapPin, Search, CheckCircle, Clock, AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react';
import { COVERAGE_AREAS } from '../data';
import { CoverageArea } from '../types';

export default function Coverage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<CoverageArea | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const result = COVERAGE_AREAS.find(
      (area) =>
        area.name.toLowerCase().includes(query) ||
        area.district.toLowerCase().includes(query)
    );

    if (result) {
      setSearchResult(result);
    } else {
      // Create a mock non-available coverage if not found
      setSearchResult({
        id: 'not-found',
        name: searchQuery,
        district: 'Luar Area Layanan',
        status: 'tidak_tersedia',
      });
    }
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchResult(null);
    setHasSearched(false);
  };

  return (
    <section id="area" className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2563eb0a_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Interactive Form */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Jangkauan Fiber</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight" id="area-title">
                Area Layanan Kami
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Kami melayani pemasangan internet cepat di berbagai wilayah kecamatan dan kelurahan lokal. 
                Gunakan alat pengecek di bawah ini untuk memastikan rumah Anda sudah berada di zona cover aktif kami.
              </p>
            </div>

            {/* Interactive Checker Form */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm" id="area-checker">
              {!hasSearched ? (
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <label htmlFor="input-search-area" className="block text-sm font-bold text-gray-700">
                      Masukkan Nama Kelurahan / Kecamatan Anda:
                    </label>
                    <div className="relative">
                      <input
                        id="input-search-area"
                        type="text"
                        placeholder="Contoh: Hj Gaim, Petukangan.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm placeholder:text-slate-400"
                        required
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                    <button
                      type="submit"
                      id="btn-search-area"
                      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all cursor-pointer flex justify-center items-center gap-2"
                    >
                      Cek Area Sekarang
                    </button>
                  </form>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <a
                    href="https://wa.me/6282124986552?text=Halo%20Admin%20GAIM,%20saya%20ingin%20cek%20apakah%20lokasi%20saya%20sudah%20terjangkau%20oleh%20jaringan%20GAIM%20Internet."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4 fill-white text-white" />
                    Tanyakan Admin via WhatsApp (Cek Manual)
                  </a>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in" id="search-result">
                  {searchResult?.status === 'tersedia' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto bg-green-50 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-green-100">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-gray-900">Selamat! Area Tercover</h4>
                        <p className="text-sm text-gray-500">
                          Jaringan internet cepat GAIM sudah aktif di <span className="font-bold text-blue-600">{searchResult.name}</span>, Kecamatan {searchResult.district}.
                        </p>
                      </div>
                      <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50 text-xs text-green-800 font-medium">
                        Estimasi pemasangan: 1-2 hari kerja setelah pendaftaran disetujui.
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleReset}
                          className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Cek Area Lain
                        </button>
                        <a
                          href="#paket"
                          className="flex-1 bg-blue-600 text-white py-3 font-semibold rounded-xl text-xs hover:bg-blue-700 transition-all flex items-center justify-center"
                        >
                          Pilih Paket
                        </a>
                      </div>
                    </div>
                  )}

                  {searchResult?.status === 'segera' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto bg-amber-50 text-amber-600 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-amber-100">
                        <Clock className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-gray-900">Area Segera Tercover</h4>
                        <p className="text-sm text-gray-500">
                          Wilayah <span className="font-bold text-amber-600">{searchResult.name}</span> sedang dalam proses pembangunan infrastruktur tiang fiber.
                        </p>
                      </div>
                      <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 text-xs text-amber-800 font-medium">
                        Rencana aktif: Segera. Silakan daftar antrean prioritas atau tanya tim admin.
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleReset}
                          className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          Cek Area Lain
                        </button>
                        <a
                          href={`https://wa.me/6282124986552?text=Halo%20Admin%20GAIM,%20saya%20ingin%20bertanya%20mengenai%20jadwal%20aktif%20area%20${encodeURIComponent(searchResult.name)}%20dan%20masuk%20daftar%20tunggu%20pemasangan.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-amber-500 text-white py-3 font-semibold rounded-xl text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-white" />
                          Hubungi Admin
                        </a>
                      </div>
                    </div>
                  )}

                  {searchResult?.status === 'tidak_tersedia' && (
                    <div className="text-center space-y-4">
                      <div className="mx-auto bg-gray-50 text-gray-500 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-gray-100">
                        <AlertTriangle className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-gray-900">Belum Terjangkau</h4>
                        <p className="text-sm text-gray-500">
                          Maaf, daerah <span className="font-semibold text-gray-800">{searchResult.name}</span> belum masuk ke dalam coverage fiber optic kami.
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">
                        Tenang! Tim admin kami dapat memeriksa koordinat rumah Anda secara manual untuk memastikan jangkauan tiang terdekat.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleReset}
                          className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Coba Lagi
                        </button>
                        <a
                          href={`https://wa.me/6282124986552?text=Halo%20Admin%20GAIM,%20wilayah%20saya%20${encodeURIComponent(searchResult.name)}%20belum%20terdaftar%20di%20sistem.%20Mohon%20bantu%20cek%20manual%20apakah%20rumah%20saya%20bisa%20ditarik%20kabel%20GAIM%20Internet.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-white" />
                          Tanya Admin (WA)
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Visual Map */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative border border-blue-100 bg-white rounded-3xl p-4 shadow-xl overflow-hidden aspect-video flex items-center justify-center">
              {/* Fake Map Grid Image */}
              <div className="absolute inset-0 bg-sky-50 opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(#004aad15_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />
              
              {/* Simulating Map Roads */}
              <svg className="absolute inset-0 w-full h-full stroke-blue-200/50 stroke-[3] fill-none" viewBox="0 0 400 200">
                <path d="M-50,50 Q100,20 200,80 T450,120" />
                <path d="M20,220 L150,-10" />
                <path d="M280,220 L350,-10" />
                <path d="M-20,150 L420,30" />
              </svg>

              {/* Decorative Cover Range Circle */}
              <div className="absolute w-44 h-44 bg-blue-100/50 rounded-full border border-blue-300/40 animate-pulse flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-200/50 rounded-full border border-blue-400/30" />
              </div>

              {/* Central HQ Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg relative border-4 border-white animate-bounce">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg py-1 px-2.5 shadow-sm text-[10px] font-bold text-blue-600 mt-2 block tracking-wide">
                  GAIM HUB UTAMA
                </div>
              </div>

              {/* Satellite Active Area Pins */}
              <div className="absolute top-1/4 left-1/4 flex flex-col items-center scale-75">
                <div className="bg-[#25d366] text-white p-1.5 rounded-full shadow-md border border-white">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[8px] font-bold text-gray-500 mt-1 bg-white px-1 rounded shadow-xs">Jl. Hj Gaim</span>
              </div>

              <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center scale-75">
                <div className="bg-[#25d366] text-white p-1.5 rounded-full shadow-md border border-white">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[8px] font-bold text-gray-500 mt-1 bg-white px-1 rounded shadow-xs">Petukangan Utara</span>
              </div>

              <div className="absolute top-1/3 right-1/3 flex flex-col items-center scale-75">
                <div className="bg-[#25d366] text-white p-1.5 rounded-full shadow-md border border-white">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[8px] font-bold text-gray-500 mt-1 bg-white px-1 rounded shadow-xs">Petukangan Selatan</span>
              </div>

              <div className="absolute bottom-1/3 left-1/3 flex flex-col items-center scale-75 opacity-70">
                <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-md border border-white">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[8px] font-bold text-gray-500 mt-1 bg-white px-1 rounded shadow-xs">Mekarjaya</span>
              </div>
            </div>

            {/* Real Google Maps Active Coverage Area Button */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-800">Peta Jangkauan Interaktif</h4>
                  <p className="text-xs text-slate-500">Lihat detail titik koordinat & tiang area Gaim</p>
                </div>
              </div>
              <a 
                href="https://maps.app.goo.gl/ayv5QQE3NaszeSco8"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                🗺️ Buka Google Maps
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
