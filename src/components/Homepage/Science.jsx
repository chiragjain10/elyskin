import React, { useState, useEffect, useRef } from 'react';
import { Shield, Microscope, Droplets, Zap, ChevronRight, Beaker } from 'lucide-react';

const FeatureCard = ({ iconEl, title, desc, index, isVisible }) => (
  <div 
    className={`group relative flex gap-6 p-6 rounded-[32px] transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
    style={{ transitionDelay: `${600 + (index * 150)}ms` }}
  >
    {/* Animated Background on Hover */}
    <div className="absolute inset-0 bg-[#FDFBF7]/0 group-hover:bg-[#FDFBF7] rounded-[32px] transition-all duration-500 -z-10 shadow-xl shadow-[#C6A664]/0 group-hover:shadow-[#C6A664]/10 backdrop-blur-sm border border-transparent group-hover:border-[#E6CCB2]/30" />
    
    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#4A4A4A] text-white flex items-center justify-center transition-all duration-500 group-hover:bg-[#C6A664] group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-[#4A4A4A]/10">
      {iconEl}
    </div>
    
    <div className="space-y-2">
      <h4 className="text-xl font-bold text-[#4A4A4A] tracking-tight group-hover:text-[#C6A664] transition-colors">
        {title}
      </h4>
      <p className="text-[#4A4A4A]/60 leading-relaxed text-sm font-medium max-w-[280px]">
        {desc}
      </p>
    </div>
  </div>
);

const ScienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      iconEl: <Microscope size={26} strokeWidth={1.5} />,
      title: 'Molecular Precision',
      desc: 'Advanced mapping technology to identify and address the biological requirements of your skin.'
    },
    {
      iconEl: <Shield size={26} strokeWidth={1.5} />,
      title: 'Barrier Resilience',
      desc: 'Formulations that strengthen the skin’s natural defenses against urban environmental stressors.'
    },
    {
      iconEl: <Droplets size={26} strokeWidth={1.5} />,
      title: 'Cellular Hydration',
      desc: 'Micro-encapsulated moisture delivery systems that sustain hydration deep within the epidermis.'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-14 md:py-20 bg-[#FDFBF7] relative overflow-hidden"
    >
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1800px] h-full pointer-events-none opacity-20">
        <div className="absolute top-40 right-10 text-[20vw] font-serif italic text-[#4A4A4A]/5 select-none uppercase tracking-widest">ElySkin</div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: THE VISUAL ARCHITECTURE */}
          <div className="lg:col-span-7 relative">
            <div className={`relative transition-all duration-[1.5s] cubic-bezier(0.2, 1, 0.3, 1) ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}>
              
              {/* Main Image Container with Unique Border Radius */}
              <div className="relative z-10 aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[60px_10px_60px_10px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(198,166,100,0.2)] group border border-[#E6CCB2]/20">
                <img 
                  src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=1200" 
                  alt="ElySkin laboratory research" 
                />
                <div className="absolute inset-0 bg-[#C6A664]/5 mix-blend-overlay" />
              </div>

              {/* Floating "Live Data" Card - Glassmorphism */}
              <div 
                className={`absolute -bottom-10 -right-6 md:right-10 z-20 backdrop-blur-xl bg-[#FDFBF7]/90 p-8 rounded-[40px] shadow-2xl border border-[#E6CCB2]/30 transition-all duration-1000 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-[#C6A664]/20 flex items-center justify-center">
                       <Zap className="text-[#C6A664] animate-pulse" size={32} fill="#C6A664" />
                    </div>
                    {/* Rotating Ring Effect */}
                    <div className="absolute inset-0 border-t-2 border-[#C6A664] rounded-full animate-spin [animation-duration:3s]" />
                  </div>
                  <div>
                    <p className="text-4xl font-serif italic text-[#4A4A4A]">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A4A4A]/40">Clinical Safety</p>
                  </div>
                </div>
              </div>

              {/* Background Shapes */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C6A664]/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* RIGHT: THE CONTENT NARRATIVE */}
          <div className="lg:col-span-5 space-y-12">
            <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FDFBF7] border border-[#E6CCB2]/30 shadow-sm">
                <Beaker size={14} className="text-[#C6A664]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A4A4A]">The Mumbai Laboratory</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif text-[#4A4A4A] leading-[1.1]">
                Dermatology <br />
                <span className="italic font-light">meets</span> <span className="text-[#C6A664] font-sans font-black uppercase tracking-tighter">Botany</span>
              </h2>
              
              <p className="text-lg text-[#4A4A4A]/70 font-medium leading-relaxed max-w-lg">
                We believe skin health is the foundation of confidence. Our Mumbai-based research center develops formulations that bridge the gap between <span className="text-[#4A4A4A] font-bold underline decoration-[#C6A664]/30 underline-offset-4">clinical science</span> and nature’s most potent extracts.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 gap-2">
              {features.map((item, i) => (
                <FeatureCard 
                  key={i} 
                  index={i} 
                  {...item} 
                  isVisible={isVisible} 
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className={`pt-6 transition-all duration-1000 delay-[1200ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <button className="group relative flex items-center gap-8 bg-[#4A4A4A] text-white pl-10 pr-4 py-4 rounded-full overflow-hidden transition-all hover:bg-[#C6A664] hover:shadow-2xl hover:shadow-[#C6A664]/20 active:scale-95 shadow-xl shadow-[#4A4A4A]/10">
                <span className="text-xs font-black uppercase tracking-[0.2em] relative z-10">
                  Our Formulation Philosophy
                </span>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:rotate-45 relative z-10">
                  <ChevronRight size={20} />
                </div>
                {/* Internal Slide Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
