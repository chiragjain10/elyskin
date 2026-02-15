import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Heart, ShoppingBag, Eye, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '../../components/Firebase';
import { getDocs, collection, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../components/useAuth';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import QuickView from '../QuickView';

// --- Toast Notification Component ---
const Toast = ({ message }) => (
  <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-[#FDFBF7] text-[#4A4A4A] px-6 py-4 rounded-2xl shadow-2xl border border-[#E6CCB2]/20">
    <div className="bg-[#C6A664] p-1.5 rounded-full">
      <CheckCircle2 size={16} className="text-white" />
    </div>
    <span className="text-sm font-bold tracking-wide">{message}</span>
  </div>
);

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      // Added more selectors to ensure all icons/buttons trigger the cursor
      const isInteractive = e.target.closest('button, a, .interactive, svg, img');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block mix-blend-difference">
      <div 
        className="absolute rounded-full bg-[#FDFBF7] transition-all duration-150 ease-out"
        style={{
          left: position.x, top: position.y,
          width: isHovering ? '60px' : '12px',
          height: isHovering ? '60px' : '12px',
          transform: `translate(-50%, -50%)`,
          opacity: isHovering ? 0.8 : 1
        }}
      />
    </div>
  );
};

// --- Single Product Card Component ---
const ProductCard = ({ product, showToast, setSelectedProduct }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingType, setLoadingType] = useState(null); // 'cart', 'wishlist', or null

  const addToCollection = async (e, collectionName) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoadingType(collectionName);
    
    try {
      const itemRef = doc(db, "users", user.uid, collectionName, product.id);
      await setDoc(itemRef, {
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        addedAt: new Date().toISOString()
      });
      showToast(`Added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error:`, error);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-[#FDFBF7] rounded-[40px] p-6 transition-all duration-500 hover:shadow-[0_30px_100px_rgba(198,166,100,0.1)] border border-[#E6CCB2]/30 cursor-pointer overflow-hidden"
    >
      <div className="relative aspect-square mb-8 bg-[#FDFBF7] rounded-[32px] overflow-hidden group-hover:scale-[0.98] transition-transform duration-700">
        <img 
          src={product.image || product.images?.[0]} 
          alt={product.name} 
          className="w-full h-full object-contain p-10 transform transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            disabled={loadingType === 'wishlist'}
            onClick={(e) => addToCollection(e, 'wishlist')}
            className="p-4 bg-[#FDFBF7] rounded-2xl text-[#4A4A4A] hover:bg-[#C6A664] hover:text-white transition-all shadow-xl cursor-pointer disabled:opacity-50"
          >
            {loadingType === 'wishlist' ? <Loader2 size={20} className="animate-spin" /> : <Heart size={20} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
            className="p-4 bg-[#FDFBF7] rounded-2xl text-[#4A4A4A] hover:bg-[#C6A664] hover:text-white transition-all shadow-xl cursor-pointer"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6A664]">{product.category || 'Skin Care'}</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-[#4A4A4A]">★ {product.rating || '4.8'}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-[#4A4A4A] leading-tight group-hover:text-[#C6A664] transition-colors">{product.name}</h3>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#E6CCB2]/20">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#4A4A4A]">₹{product.price}.00</span>
          </div>
          <button 
            disabled={loadingType === 'cart'}
            onClick={(e) => addToCollection(e, 'cart')}
            className="w-14 h-14 bg-[#4A4A4A] text-white rounded-2xl flex items-center justify-center hover:bg-[#C6A664] hover:scale-110 transition-all shadow-xl cursor-pointer disabled:bg-[#4A4A4A]/50"
          >
            {loadingType === 'cart' ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Grid Component ---
const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    };
    load();
  }, [activeCategory]);

  return (
    <>
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {selectedProduct && (
        <QuickView 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      <section className="relative py-20 bg-[#FDFBF7] overflow-hidden cursor-none">
        <CustomCursor />
        
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl lg:text-8xl text-[#4A4A4A] font-serif leading-[0.9]">
              Clinical <i className="font-light">Precision</i>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-2 mt-12 border-b border-[#E6CCB2]/20 pb-4">
              {['All Products', 'Daily', 'Intensive', 'Body'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 text-sm font-bold tracking-widest uppercase cursor-pointer interactive transition-colors ${activeCategory === cat ? 'text-[#4A4A4A]' : 'text-[#4A4A4A]/40'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showToast={showToast} setSelectedProduct={setSelectedProduct} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductGrid;
