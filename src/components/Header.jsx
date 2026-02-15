import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, User, Search, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';

const Header = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' }, // Renamed for premium feel
    { name: 'Shop', to: '/shop' }, // Renamed for premium feel
    { name: 'Contact us', to: '/contact' }, // Renamed for premium feel
  ];

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-[#FDFBF7]/90 backdrop-blur-xl py-4 border-[#E6CCB2]/20 shadow-2xl shadow-[#D4A373]/10' 
            : 'bg-transparent py-6 lg:py-8 border-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* --- LEFT: Logo --- */}
          <Link to="/" className="relative z-[110] flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gradient-to-tr from-[#C6A664] to-[#D4A373] border border-[#F5F0E6]/10 flex items-center justify-center">
              <span className="text-[#FDFBF7] font-black text-xl relative z-10 transition-transform duration-500 group-hover:scale-110">+</span>
              <div className="absolute inset-0 bg-[#FDFBF7] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tighter leading-none transition-colors duration-300 ${isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A]' : 'text-[#4A4A4A]'}`}>
                ELY<span className="text-[#C6A664]">SKIN</span>
              </span>
              <span className={`text-[9px] uppercase tracking-[0.4em] font-medium opacity-60 ${isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A]' : 'text-[#4A4A4A]'}`}>
                Est. 2024
              </span>
            </div>
          </Link>

          {/* --- CENTER: Desktop Nav (Floating Pill) --- */}
          <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full border transition-all duration-500 ${
            isScrolled 
              ? 'bg-[#FDFBF7]/50 border-[#E6CCB2]/30 backdrop-blur-md' 
              : 'bg-[#FDFBF7]/60 border-[#FDFBF7]/40 backdrop-blur-sm shadow-sm'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="relative px-6 py-2.5 rounded-full group overflow-hidden"
              >
                <span className={`relative z-10 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled ? 'text-[#4A4A4A] group-hover:text-[#FDFBF7]' : 'text-[#4A4A4A] group-hover:text-[#FDFBF7]'
                }`}>
                  {link.name}
                </span>
                {/* Hover Background Pill */}
                <div className="absolute inset-0 bg-[#C6A664] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* --- RIGHT: Actions --- */}
          <div className="flex items-center gap-2 md:gap-6 relative z-[110]">
            
            {/* Icons Group --- */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* <button className={`p-2 rounded-full transition-all duration-300 hover:bg-[#C6A664]/10 group ${
                isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A] hover:text-[#C6A664]' : 'text-[#4A4A4A] hover:text-[#C6A664]'
              }`}>
                <Search size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </button> */}
              <Link to="/wishlist" className={`p-2 rounded-full transition-all duration-300 hover:bg-[#C6A664]/10 group ${
                isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A] hover:text-[#C6A664]' : 'text-[#4A4A4A] hover:text-[#C6A664]'
              }`}>
                <Heart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/cart" className={`p-2 rounded-full transition-all duration-300 hover:bg-[#C6A664]/10 group ${
                isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A] hover:text-[#C6A664]' : 'text-[#4A4A4A] hover:text-[#C6A664]'
              }`}>
                <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/account" className={`p-2 rounded-full transition-all duration-300 hover:bg-[#C6A664]/10 group ${
                isScrolled || isMobileMenuOpen ? 'text-[#4A4A4A] hover:text-[#C6A664]' : 'text-[#4A4A4A] hover:text-[#C6A664]'
              }`}>
                <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            <div className={`hidden lg:block w-[1px] h-6 ${isScrolled ? 'bg-[#4A4A4A]/10' : 'bg-[#4A4A4A]/10'}`} />

            {/* Desktop CTA --- */}
            <button className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isScrolled 
                ? 'bg-[#C6A664] text-[#FDFBF7] hover:bg-[#B59554]' 
                : 'bg-[#C6A664] text-[#FDFBF7] hover:bg-[#B59554]'
            }`}>
              <span>Book Appointment</span>
              <Sparkles size={14} />
            </button>

            {/* Mobile Toggle --- */}
            <button 
              className={`lg:hidden relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isScrolled || isMobileMenuOpen ? 'bg-[#4A4A4A]/5 text-[#4A4A4A]' : 'bg-[#4A4A4A]/5 text-[#4A4A4A]'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-5 h-5">
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : 'bottom-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-[#FDFBF7] z-[100] transition-all duration-700 cubic-bezier(0.7, 0, 0.3, 1) ${
          isMobileMenuOpen ? 'clip-path-open' : 'clip-path-closed'
        }`}
      >
        {/* Decorative Background Elements --- */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C6A664] rounded-full mix-blend-multiply opacity-5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E6CCB2] rounded-full mix-blend-multiply opacity-10 blur-[80px] pointer-events-none" />
        
        {/* Huge Watermark --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
          <span className="text-[20vw] font-black text-[#4A4A4A] leading-none tracking-tighter">ELY</span>
        </div>

        {/* Close Button --- */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-[#4A4A4A]/5 backdrop-blur-sm text-[#4A4A4A] hover:bg-[#4A4A4A]/10 transition-all duration-300"
        >
          <X size={24} />
        </button>

        <div className="h-full flex flex-col pt-32 pb-10 px-8 justify-between relative z-10">
          
          {/* Main Mobile Navigation --- */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center justify-between p-4 border-b border-[#4A4A4A]/5 transition-all duration-700 ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${100 + idx * 50}ms` }}
              >
                <span className="text-3xl md:text-4xl font-light text-[#4A4A4A] group-hover:text-[#C6A664] group-hover:pl-4 transition-all duration-300">
                  {link.name}
                </span>
                <span className="w-10 h-10 rounded-full border border-[#4A4A4A]/10 flex items-center justify-center text-[#4A4A4A]/30 group-hover:bg-[#C6A664] group-hover:border-[#C6A664] group-hover:text-[#FDFBF7] transition-all duration-300">
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </nav>

          {/* Bottom Card Section --- */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Account Snippet --- */}
            <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block bg-[#FDFBF7] backdrop-blur-md rounded-2xl p-5 border border-[#E6CCB2]/30 active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6A664] to-[#D4A373] flex items-center justify-center text-[#FDFBF7] shadow-lg shadow-[#D4A373]/20">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[#4A4A4A] font-bold text-lg">{user ? 'Welcome Back' : 'Sign In / Join'}</p>
                  <p className="text-[#4A4A4A] text-xs uppercase tracking-wider mt-0.5">{user ? 'View Dashboard' : 'Unlock Exclusive Offers'}</p>
                </div>
              </div>
            </Link>

            <div className="flex gap-4">
              <a href="tel:+1234567890" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-transparent border border-[#4A4A4A]/10 text-[#4A4A4A] font-bold uppercase text-xs tracking-widest hover:bg-[#4A4A4A]/5">
                <Phone size={16} /> Support
              </a>
              <Link to="/book" className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl bg-[#C6A664] text-[#FDFBF7] font-black uppercase text-xs tracking-widest shadow-lg shadow-[#C6A664]/5 active:scale-95 transition-transform">
                Book Now
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      <style>{`
        .clip-path-open {
          clip-path: circle(150% at 100% 0%);
        }
        .clip-path-closed {
          clip-path: circle(0% at 100% 0%);
        }
      `}</style>
    </>
  );
};

export default Header;