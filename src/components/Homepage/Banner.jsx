import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Subtle parallax effect based on mouse movement
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 50;
    const y = (clientY - innerHeight / 2) / 50;
    setMousePosition({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-14 md:py-20 px-4 md:px-12 bg-[#FDFBF7] overflow-hidden"
    >
      {/* Ambient background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#C6A664]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative">
        <div className={`flex flex-col lg:flex-row items-center transition-all duration-1000 ease-out-expo ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          
          {/* IMAGE SECTION - Occupies more space for premium feel */}
          <div className="w-full lg:w-[60%] relative group">
            <div className="relative aspect-[16/10] md:aspect-[16/8] lg:aspect-square overflow-hidden rounded-[30px] md:rounded-[60px] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600"
                alt="Premium Skincare Collection"
                className="w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
                style={{
                  transform: `scale(1.05) translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`
                }}
              />
              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C6A664]/20 to-transparent mix-blend-multiply" />
            </div>

            {/* Floating Badge */}
            <div 
              className="absolute -bottom-6 -right-6 md:bottom-12 md:-right-12 bg-[#FDFBF7] p-6 md:p-10 rounded-[40px] shadow-2xl z-20 hidden sm:block transition-transform duration-500 hover:scale-105"
              style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[40px] font-serif italic text-[#4A4A4A]">15%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C6A664]">Welcome Offer</span>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION - Overlapping the image on large screens */}
          <div className="w-full lg:w-[50%] mt-[-60px] lg:mt-0 lg:ml-[-10%] relative z-10">
            <div className="bg-[#FDFBF7] p-8 md:p-16 lg:p-20 rounded-[40px] md:rounded-[60px] text-[#4A4A4A] shadow-2xl border border-[#E6CCB2]/20 relative overflow-hidden">
              
              {/* Internal Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A664]/10 rounded-full blur-[80px]" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <Sparkles size={20} className="text-[#C6A664]" />
                  <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#C6A664]">
                    The Essential Edit
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tight">
                  Modern <br />
                  <span className="italic font-light text-[#C6A664]">Self-Care</span>
                </h2>

                <p className="text-lg md:text-xl text-[#4A4A4A]/60 font-light leading-relaxed max-w-md">
                  Experience our dermatologist-formulated essentials designed for 
                  <span className="text-[#4A4A4A] font-medium"> sustainable skin health</span> and a natural, lasting glow.
                </p>

                <div className="pt-6 space-y-10">
                  <button className="group relative overflow-hidden flex items-center justify-between bg-[#C6A664] px-8 py-6 rounded-2xl w-full sm:w-auto sm:min-w-[280px] transition-all hover:bg-[#4A4A4A] transition-colors duration-500">
                    <span className="text-white font-black uppercase tracking-[0.3em] text-sm">Explore Essentials</span>
                    <ArrowRight size={20} className="text-white group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;