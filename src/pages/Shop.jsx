import React, { useState, useEffect } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, SlidersHorizontal, ArrowRight, Heart, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import QuickView from '../components/QuickView';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCollection = async (e, product, collectionName) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const itemRef = doc(db, "users", user.uid, collectionName, product.id);
      await setDoc(itemRef, {
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        addedAt: new Date().toISOString()
      });
      alert(`Added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
    }
  };

  const categories = ['All', 'Serums', 'Cleansers', 'Moisturizers', 'Treatments'];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      {selectedProduct && (
        <QuickView 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C6A664]/10 text-[#C6A664] text-[10px] font-black uppercase tracking-[0.3em]">
              The Collection
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-[#4A4A4A] leading-[0.85] tracking-tighter">
              All <span className="text-[#C6A664] italic">Products</span>
            </h1>
          </div>
          <p className="text-lg text-[#4A4A4A]/40 font-black uppercase tracking-widest pb-2">
            {filteredProducts.length} Results
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4A4A4A]/20 group-focus-within:text-[#C6A664] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search our formulations..." 
              className="w-full bg-[#FDFBF7] border border-[#E6CCB2]/20 rounded-[24px] pl-16 pr-8 py-5 text-sm font-bold text-[#4A4A4A] outline-none focus:border-[#C6A664]/30 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#4A4A4A] text-white shadow-xl shadow-[#4A4A4A]/20' : 'bg-[#FDFBF7] text-[#4A4A4A] hover:bg-[#4A4A4A]/5 border border-[#E6CCB2]/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[40px] bg-[#FDFBF7] border border-[#E6CCB2]/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group relative bg-[#FDFBF7] rounded-[40px] p-6 transition-all duration-500 hover:shadow-[0_30px_100px_rgba(198,166,100,0.05)] border border-[#E6CCB2]/20 cursor-pointer overflow-hidden"
              >
                <div className="relative aspect-square mb-8 bg-[#FDFBF7] rounded-[32px] border border-[#E6CCB2]/10 overflow-hidden group-hover:scale-[0.98] transition-transform duration-700">
                  <img 
                    src={product.image || product.images?.[0]} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-10 transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#C6A664]/0 group-hover:bg-[#C6A664]/5 transition-colors duration-500" />
                  
                  {/* Floating Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={(e) => addToCollection(e, product, 'wishlist')}
                      className="p-4 bg-[#FDFBF7] border border-[#E6CCB2]/20 rounded-2xl text-[#4A4A4A] hover:bg-[#C6A664] hover:text-white transition-all shadow-xl shadow-[#C6A664]/10"
                    >
                      <Heart size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="p-4 bg-[#FDFBF7] border border-[#E6CCB2]/20 rounded-2xl text-[#4A4A4A] hover:bg-[#C6A664] hover:text-white transition-all shadow-xl shadow-[#C6A664]/10"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6A664]">
                      {product.category || 'Skin Care'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-[#C6A664]">★</span>
                      <span className="text-[10px] font-black text-[#4A4A4A]">{product.rating || '4.8'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#4A4A4A] leading-tight group-hover:text-[#C6A664] transition-colors h-14 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#E6CCB2]/20">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-[#4A4A4A]">₹{product.price}.00</span>
                    </div>
                    <button 
                      onClick={(e) => addToCollection(e, product, 'cart')}
                      className="w-14 h-14 bg-[#C6A664] text-white rounded-2xl flex items-center justify-center hover:bg-[#4A4A4A] hover:scale-110 transition-all shadow-xl shadow-[#C6A664]/20"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-[#FDFBF7] rounded-[64px] border border-dashed border-[#E6CCB2]/30">
            <div className="w-20 h-20 rounded-full bg-[#FDFBF7] border border-[#E6CCB2]/20 flex items-center justify-center text-[#4A4A4A]/20 mx-auto mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#4A4A4A] mb-2">No formulations found</h3>
            <p className="text-sm text-[#4A4A4A]/40 font-bold italic">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#C6A664] hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;