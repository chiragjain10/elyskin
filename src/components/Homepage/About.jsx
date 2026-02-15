import React from 'react';
import { ShieldCheck, Leaf, Heart, Beaker } from 'lucide-react';

const TrustItem = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center px-4 group">
    <div className="mb-8 p-8 rounded-[32px] bg-[#FDFBF7] transition-all duration-500 group-hover:bg-[#C6A664] group-hover:-translate-y-3 shadow-xl shadow-[#4A4A4A]/5 group-hover:shadow-[#C6A664]/20 border border-[#E6CCB2]/20 group-hover:border-transparent">
      {icon}
    </div>
    <h3 className="text-sm uppercase tracking-[0.3em] font-black text-[#4A4A4A] mb-4 group-hover:text-[#C6A664] transition-colors">
      {title}
    </h3>
    <p className="text-sm leading-relaxed text-[#4A4A4A]/50 max-w-[220px] font-medium">
      {description}
    </p>
  </div>
);

const BrandTrust = () => {
  const trustPoints = [
    {
      icon: <ShieldCheck strokeWidth={2} size={36} className="text-[#4A4A4A] group-hover:text-white transition-colors duration-500" />,
      title: "Clinical Integrity",
      description: "Formulations developed and tested by dermatologists for maximum efficacy."
    },
    {
      icon: <Leaf strokeWidth={2} size={36} className="text-[#4A4A4A] group-hover:text-white transition-colors duration-500" />,
      title: "Botanical Purity",
      description: "High-performance natural extracts sourced ethically across the Indian subcontinent."
    },
    {
      icon: <Heart strokeWidth={2} size={36} className="text-[#4A4A4A] group-hover:text-white transition-colors duration-500" />,
      title: "Conscious Care",
      description: "Cruelty-free and vegan-friendly compositions that respect all life."
    },
    {
      icon: <Beaker strokeWidth={2} size={36} className="text-[#4A4A4A] group-hover:text-white transition-colors duration-500" />,
      title: "Evidence Based",
      description: "Results-driven skincare backed by rigorous scientific research and trials."
    }
  ];

  return (
    <section className="py-15 bg-[#FDFBF7]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-24">
          <div className="h-2 w-16 bg-[#C6A664] rounded-full mb-8"></div>
          <p className="text-xs uppercase tracking-[0.6em] text-[#C6A664] font-black">
            The ElySkin Standard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-12">
          {trustPoints.map((point, index) => (
            <TrustItem 
              key={index}
              icon={point.icon}
              title={point.title}
              description={point.description}
            />
          ))}
        </div>

        {/* Bottom Detail */}
        <div className="mt-24 flex justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4A4A4A]/30 border-2 border-[#E6CCB2]/20 px-8 py-4 rounded-full bg-[#FDFBF7] shadow-sm">
            Est. 2025 — Mumbai • Advanced Dermatological Research
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandTrust;
