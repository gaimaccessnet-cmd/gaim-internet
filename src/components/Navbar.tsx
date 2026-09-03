import React, { useState } from 'react';
import { Menu, X, Wifi, MessageCircle, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  isAdminView?: boolean;
  setIsAdminView?: (val: boolean) => void;
  onOpenContact: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isAdminView, setIsAdminView, onOpenContact, isDarkMode, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang Kami', href: '#tentang-kami' },
    { name: 'Paket', href: '#paket' },
    { name: 'Area Layanan', href: '#area' },
    { name: 'Testimoni', href: '#testimoni' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    setIsAdminView(false); // Switch to customer view when a customer link is clicked
    window.location.hash = href;
    
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#beranda" onClick={(e) => handleScroll(e, '#beranda')} className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
                <Wifi className="h-6 w-6" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white block leading-none">GAIM</span>
                <span className="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 block mt-0.5">INTERNET</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    !isAdminView ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>

            {/* View Switchers & Theme Toggle */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={onToggleTheme}
                id="btn-theme-toggle"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center"
              >
                {isDarkMode ? <Sun className="h-4 w-4 fill-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={onOpenContact}
                id="btn-whatsapp"
                className="flex items-center gap-1.5 bg-[#25d366] text-white px-4 h-10 rounded-full text-xs font-semibold hover:bg-[#20ba5a] transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                Hubungi WhatsApp
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              id="btn-theme-toggle-mobile"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5 fill-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {link.name}
              </a>
            ))}
            
            <div className="border-t border-gray-100 dark:border-slate-800 my-2 pt-2 px-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenContact();
                }}
                className="flex items-center justify-center gap-2 bg-[#25d366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20ba5a] w-full cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                Hubungi WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
