import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { Star, Shield, Truck, RotateCcw, Heart, ShoppingBag, ArrowLeft, Share2, Info } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const addToCollection = async (collectionName) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;

    try {
      const itemRef = doc(db, "users", user.uid, collectionName, product.id);
      await setDoc(itemRef, {
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        addedAt: new Date().toISOString(),
        quantity: quantity
      });
      alert(`Added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C6A664]/20 border-t-[#C6A664] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A4A4A]/40">Gathering ingredients...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6">
        <p className="text-xl font-black text-[#4A4A4A]">Product disappeared into thin air.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-2xl bg-[#4A4A4A] text-white font-black text-xs uppercase tracking-widest hover:bg-[#C6A664] transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#4A4A4A]/40 hover:text-[#C6A664] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-[#E6CCB2]/20 flex items-center justify-center group-hover:border-[#C6A664]/20 transition-all">
              <ArrowLeft size={14} />
            </div>
            Back to Catalog
          </button>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-[#E6CCB2]/20 flex items-center justify-center text-[#4A4A4A]/40 hover:text-[#C6A664] hover:border-[#C6A664]/20 transition-all">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Left: Visuals */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-[#FDFBF7] rounded-[48px] overflow-hidden border border-[#E6CCB2]/20 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-12 transform transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-8 left-8">
                <span className="px-4 py-2 rounded-2xl bg-[#FDFBF7]/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-[#4A4A4A] shadow-sm border border-[#E6CCB2]/20">
                  {product.category || 'Luxury Care'}
                </span>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Shield size={20} />, text: 'Dermatologically Tested' },
                { icon: <Truck size={20} />, text: 'Express Delivery' },
                { icon: <RotateCcw size={20} />, text: '30-Day Returns' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-[32px] bg-[#FDFBF7] border border-[#E6CCB2]/20 space-y-3 shadow-sm hover:border-[#C6A664]/20 transition-all">
                  <div className="text-[#C6A664]">{item.icon}</div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#4A4A4A]/60 leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < 4 ? "#C6A664" : "none"} className={i < 4 ? "text-[#C6A664]" : "text-[#4A4A4A]/10"} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-[#4A4A4A]/40 uppercase tracking-widest">(124 Reviews)</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-[#4A4A4A] leading-[0.9] tracking-tighter">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-[#C6A664]">
                  ₹{product.price}.00
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl font-bold text-[#4A4A4A]/20 line-through">
                    ₹{product.original_price}.00
                  </span>
                )}
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  In Stock
                </div>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="space-y-6 pt-6 border-t border-[#E6CCB2]/20">
              <div className="flex items-center gap-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40">Quantity</p>
                  <div className="flex items-center bg-[#FDFBF7] rounded-2xl p-1 border border-[#E6CCB2]/20">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center font-black text-[#4A4A4A] hover:text-[#C6A664] transition-colors"
                    >-</button>
                    <span className="w-12 text-center font-black text-[#4A4A4A]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center font-black text-[#4A4A4A] hover:text-[#C6A664] transition-colors"
                    >+</button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40">Size / Volume</p>
                  <div className="flex gap-2">
                    {['50ml', '100ml'].map((size) => (
                      <button key={size} className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${size === '50ml' ? 'bg-[#4A4A4A] text-white' : 'bg-[#FDFBF7] text-[#4A4A4A] border border-[#E6CCB2]/20 hover:bg-[#4A4A4A]/5'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => addToCollection("cart")}
                  className="flex-1 h-16 rounded-[24px] bg-[#C6A664] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#C6A664]/20 hover:bg-[#4A4A4A] transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={18} />
                  Add to Shopping Bag
                </button>
                <button
                  onClick={() => addToCollection("wishlist")}
                  className="w-16 h-16 rounded-[24px] bg-[#FDFBF7] border-2 border-[#E6CCB2]/20 flex items-center justify-center text-[#4A4A4A] hover:text-[#C6A664] hover:border-[#C6A664]/20 transition-all"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Info Tabs */}
            <div className="space-y-6 pt-10 border-t border-[#E6CCB2]/20">
              <div className="flex gap-8 border-b border-[#E6CCB2]/20 pb-4">
                {['description', 'ingredients', 'usage'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative ${activeTab === tab ? 'text-[#4A4A4A]' : 'text-[#4A4A4A]/30 hover:text-[#4A4A4A]/60'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute -bottom-[17px] left-0 right-0 h-1 bg-[#C6A664] rounded-full" />}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[120px] animate-fadeIn">
                {activeTab === 'description' && (
                  <p className="text-sm leading-relaxed text-[#4A4A4A]/70 font-medium">
                    {product.description || "Indulge in our premium formulation designed to rejuvenate and protect. This luxury elixir combines traditional wisdom with modern science to deliver visible results within weeks."}
                  </p>
                )}
                {activeTab === 'ingredients' && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C6A664]">Key Actives</p>
                    <p className="text-sm leading-relaxed text-[#4A4A4A]/70 font-medium">
                      Purified Water, Botanical Squalane, Niacinamide (Vitamin B3), Hyaluronic Acid, Organic Rosehip Oil, Vitamin E, Essential Mineral Complex.
                    </p>
                  </div>
                )}
                {activeTab === 'usage' && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C6A664]">Application Ritual</p>
                    <p className="text-sm leading-relaxed text-[#4A4A4A]/70 font-medium">
                      Gently massage 2-3 pumps onto cleansed face and neck using upward circular motions. For optimal results, use morning and night after your favorite serum.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-6 rounded-[32px] bg-[#FDFBF7] border border-[#E6CCB2]/20 flex gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E6CCB2]/20 flex items-center justify-center text-[#C6A664] flex-shrink-0 shadow-sm">
                <Info size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]">Beauty Secret</p>
                <p className="text-xs text-[#4A4A4A]/60 font-medium leading-relaxed">Combine with our Nocturnal Elixir for a complete 24-hour hydration cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


