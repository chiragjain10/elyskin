import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../components/Firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const CategoryCard = ({ category, index }) => {
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden group cursor-pointer ${category.gridClass} transition-all duration-1000 ease-out rounded-[60px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image with luxury treatment */}
      <div className="w-full h-full aspect-[4/5] md:aspect-auto overflow-hidden bg-[#FDFBF7]">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-all duration-[2.5s] ease-out group-hover:scale-110"
        />
        {/* Navy/Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#C6A664]/80 via-[#FDFBF7]/20 to-transparent opacity-60 group-hover:opacity-90 group-hover:from-[#C6A664]/90 transition-all duration-1000" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-12 flex flex-col justify-end items-start">
        <div className="overflow-hidden mb-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-black translate-y-full group-hover:translate-y-0 transition-transform duration-700">
            {category.subtitle}
          </p>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
          {category.title}
        </h3>

        {/* Refined Button */}
        <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#4A4A4A] group-hover:bg-[#C6A664] group-hover:text-white transition-all duration-500 transform group-hover:rotate-[360deg] shadow-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

const CategorySection = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "categories"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setItems(list);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  const fallback = [
    {
      title: "Essential Care",
      subtitle: "Daily Foundations",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
      gridClass: "md:col-span-7 md:row-span-2",
    },
    {
      title: "Regenerative",
      subtitle: "Molecular Repair",
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800",
      gridClass: "md:col-span-5 md:row-span-1",
    },
    {
      title: "Body Rituals",
      subtitle: "Holistic Texture",
      image: "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=800",
      gridClass: "md:col-span-6 md:row-span-1",
    },
    {
      title: "The Scalp Edit",
      subtitle: "Follicular Health",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      gridClass: "md:col-span-6 md:row-span-1",
    }
  ];
  const categories = items.length ? items : fallback;
  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-2 w-12 bg-[#C6A664] rounded-full"></div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-[#C6A664]">The Collections</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#4A4A4A] leading-[1.1] tracking-tighter">
              Curated by <br />
              <span className="text-[#C6A664]">Skin Health.</span>
            </h2>
          </div>
          <div className="max-w-xs space-y-6">
            <p className="text-lg text-[#4A4A4A]/60 font-bold leading-relaxed italic">
              "We prioritize long-term skin health over short-term trends, bridging the gap between clinical science and botanical purity."
            </p>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-[#E6CCB2]/20 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#C6A664]" />
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[1100px]">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
