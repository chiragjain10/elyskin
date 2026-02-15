import React from 'react';
import { Shield, Users, Heart, Award, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C6A664]/10 text-[#C6A664] text-[10px] font-black uppercase tracking-[0.3em]">
              The Mumbai Laboratory
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-[#4A4A4A] leading-[0.85] tracking-tighter">
              Skin <br />
              <span className="text-[#C6A664] italic">Health</span> <br />
              Redefined
            </h1>
            <p className="text-lg text-[#4A4A4A]/60 font-medium leading-relaxed max-w-xl">
              Founded in 2025, ElySkin represents the intersection of clinical dermatology and botanical purity. We believe that true skin health is the foundation of lasting confidence.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden bg-[#FDFBF7] border border-[#E6CCB2]/20">
              <img 
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800" 
                alt="Laboratory" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#FDFBF7] rounded-[40px] p-8 shadow-2xl border border-[#E6CCB2]/20 hidden md:block">
              <p className="text-4xl font-black text-[#C6A664] mb-2">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]">Clinical Safety</p>
              <div className="mt-6 h-1 w-full bg-[#E6CCB2]/20 rounded-full overflow-hidden">
                <div className="h-full w-[100%] bg-[#C6A664]" />
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Shield size={32} />,
              title: "Molecular Precision",
              desc: "Every formulation is engineered with high-potency actives that target skin concerns at a cellular level."
            },
            {
              icon: <Heart size={32} />,
              title: "Botanical Integrity",
              desc: "We source ethically grown, pure extracts from across the Indian subcontinent for maximum nutrient density."
            },
            {
              icon: <Users size={32} />,
              title: "Dermal Expertise",
              desc: "Developed by Mumbai's leading dermatologists to ensure long-term skin health over short-term hacks."
            }
          ].map((value, i) => (
            <div key={i} className="p-12 rounded-[48px] bg-[#FDFBF7] border border-[#E6CCB2]/20 space-y-6 hover:shadow-[0_20px_60px_rgba(198,166,100,0.05)] transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] border border-[#E6CCB2]/20 flex items-center justify-center text-[#C6A664] shadow-sm group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-2xl font-black text-[#4A4A4A]">{value.title}</h3>
              <p className="text-sm text-[#4A4A4A]/60 font-medium leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-[#4A4A4A] rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A664] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6A664] mb-8 block">The Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-black mb-12 leading-tight tracking-tighter">
              "We prioritize skin health over cosmetic cover-ups, bridging the gap between clinical science and nature."
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Award className="text-[#C6A664]" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">Mumbai 2025</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Dermatologist Founded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;