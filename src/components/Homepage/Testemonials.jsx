import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, Quote, ArrowRight } from 'lucide-react';

const TestimonialCard = ({ quote, author, product, rating, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

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
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative flex flex-col bg-[#FDFBF7] p-10 md:p-14 rounded-[2rem] transition-all duration-1000 ease-out border border-[#E6CCB2]/20 shadow-xl shadow-[#D4A373]/5 hover:shadow-[#D4A373]/15 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F5F0E6]/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote Icon - Refined */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-xl border border-[#E6CCB2]/30">
        <Quote size={20} fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Rating */}
        <div className="flex gap-1.5 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < rating ? "#C6A664" : "none"} 
              className={i < rating ? "text-[#C6A664]" : "text-[#2D2D2D]/10"} 
              strokeWidth={3}
            />
          ))}
        </div>

        {/* The Review - High Contrast Typography */}
        <blockquote className="mb-12">
          <p className="font-serif text-2xl md:text-3xl text-[#2D2D2D] leading-tight tracking-tight italic font-light">
            "{quote}"
          </p>
        </blockquote>

        {/* Author Detail */}
        <div className="mt-auto pt-8 border-t border-[#E6CCB2]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#2D2D2D] text-[#FDFBF7] flex items-center justify-center font-serif italic text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#C6A664]">
              {author[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-widest text-[#2D2D2D]">
                  {author}
                </span>
                <CheckCircle2 size={14} className="text-[#C6A664]" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D2D]/40 mt-0.5">
                Verified Resident
              </p>
            </div>
          </div>
          
          <div className="hidden sm:block">
             <span className="text-[10px] font-black uppercase tracking-tighter text-[#2D2D2D]/20 rotate-90 inline-block">
               {product}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const reviews = [
    {
      quote: "The texture is unlike anything I've used. My skin feels remarkably resilient and hydrated.",
      author: "Elena V.",
      product: "Nocturnal Elixir",
      rating: 5
    },
    {
      quote: "Finally, a clean formulation that actually delivers on its promise of a glass-skin finish.",
      author: "Marcus K.",
      product: "Hydra-Luminous",
      rating: 5
    },
    {
      quote: "An essential ritual. The results are visible within the first week of using the ElySkin set.",
      author: "Sophia R.",
      product: "Velvet Balm",
      rating: 5
    }
  ];

  return (
    <section className="py-15 md:py-25 bg-[#FDFBF7] relative overflow-hidden">
      {/* Decorative Brand Text Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full text-[25vw] font-black text-[#2D2D2D]/[0.02] pointer-events-none select-none whitespace-nowrap uppercase">
        ELYSKIN CLINIQUE
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4 text-[#C6A664]">
              <div className="h-px w-12 bg-[#C6A664]" />
              <span className="text-xs font-black uppercase tracking-[0.5em]">Global Community</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif text-[#2D2D2D] leading-[0.85] tracking-tighter">
              Client <br />
              <span className="italic font-light">Sentiments</span>
            </h2>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-10 bg-[#FDFBF7] p-8 rounded-[2.5rem] shadow-2xl shadow-[#D4A373]/10 border border-[#E6CCB2]/20">
            <div className="text-center px-4">
              <p className="text-4xl font-serif text-[#2D2D2D]">4.9</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C6A664] mt-2">Rating</p>
            </div>
            <div className="w-px h-12 bg-[#E6CCB2]/20" />
            <div className="text-center px-4">
              <p className="text-4xl font-serif text-[#2D2D2D]">15k</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C6A664] mt-2">Reviews</p>
            </div>
          </div>
        </div>

        {/* Testimonial Grid - Responsive & Asymmetrical focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {reviews.map((review, idx) => (
            <TestimonialCard key={idx} index={idx} {...review} />
          ))}
        </div>

        {/* The Trust Bar - Redesigned for High-End Feel */}
        <div className="mt-20">
          <div className="flex flex-col items-center justify-center space-y-16">
            <div className="flex items-center gap-6 w-full max-w-lg">
              <div className="h-px flex-1 bg-[#E6CCB2]/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#2D2D2D]/30 whitespace-nowrap">
                Endorsed By Excellence
              </span>
              <div className="h-px flex-1 bg-[#E6CCB2]/20" />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 md:gap-x-32 opacity-40 hover:opacity-100 transition-opacity duration-1000">
              <span className="font-serif text-3xl md:text-4xl tracking-tighter font-bold text-[#2D2D2D] hover:text-[#C6A664] transition-colors cursor-default">VOGUE</span>
              <span className="font-sans text-xl md:text-2xl font-black tracking-[0.5em] text-[#2D2D2D] hover:text-[#C6A664] transition-colors cursor-default">ELLE</span>
              <span className="font-serif text-2xl md:text-3xl italic font-bold text-[#2D2D2D] hover:text-[#C6A664] transition-colors cursor-default">Harper's BAZAAR</span>
              <span className="font-sans text-lg md:text-xl tracking-[0.3em] uppercase font-bold text-[#2D2D2D] hover:text-[#C6A664] transition-colors cursor-default underline underline-offset-8 decoration-[#C6A664]/30">Vanity Fair</span>
            </div>

            <button className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#2D2D2D] hover:text-[#C6A664] transition-all duration-300">
              Read More Clinical Success Stories
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
