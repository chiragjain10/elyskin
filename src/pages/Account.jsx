import React, { useState, useEffect } from "react";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Settings, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Bell,
  Award
} from "lucide-react";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ cart: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch User Profile
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // Fetch Cart Count
        const cartSnap = await getDocs(collection(db, "users", user.uid, "cart"));
        const wishlistSnap = await getDocs(collection(db, "users", user.uid, "wishlist"));
        
        // Fetch Recent Orders
        const ordersRef = collection(db, "users", user.uid, "orders");
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(3));
        const ordersSnap = await getDocs(ordersQuery);
        
        setRecentOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setStats({
          cart: cartSnap.size,
          wishlist: wishlistSnap.size
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6A664]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-[#4A4A4A] rounded-[48px] p-8 md:p-16 mb-12 relative overflow-hidden shadow-2xl shadow-[#4A4A4A]/20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C6A664]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white overflow-hidden">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="text-white/40" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#C6A664] rounded-2xl flex items-center justify-center text-white border-4 border-[#4A4A4A] shadow-lg">
                  <Award size={18} />
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {userData?.displayName || "ElySkin Member"}
                </h1>
                <p className="text-white/60 font-medium text-lg">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                    Platinum Status
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-[#C6A664]/20 text-[#C6A664] text-[10px] font-black uppercase tracking-widest border border-[#C6A664]/20">
                    2,450 Points
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-8 py-4 rounded-2xl bg-[#FDFBF7] text-[#4A4A4A] font-black hover:bg-red-50 hover:text-red-600 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
            >
              <LogOut size={20} />
              Logout Account
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Stats & Menu */}
          <div className="lg:col-span-4 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Link to="/cart" className="group bg-[#FDFBF7] p-8 rounded-[40px] border border-[#E6CCB2]/30 shadow-sm hover:shadow-[0_20px_50px_rgba(198,166,100,0.05)] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#C6A664]/10 flex items-center justify-center text-[#C6A664] mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-4xl font-black text-[#4A4A4A] tracking-tighter">{stats.cart}</p>
                <p className="text-xs font-black text-[#4A4A4A]/40 uppercase tracking-[0.2em] mt-2">In Cart</p>
              </Link>
              
              <Link to="/wishlist" className="group bg-[#FDFBF7] p-8 rounded-[40px] border border-[#E6CCB2]/30 shadow-sm hover:shadow-[0_20px_50px_rgba(198,166,100,0.05)] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#C6A664]/10 flex items-center justify-center text-[#C6A664] mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={28} fill="currentColor" />
                </div>
                <p className="text-4xl font-black text-[#4A4A4A] tracking-tighter">{stats.wishlist}</p>
                <p className="text-xs font-black text-[#4A4A4A]/40 uppercase tracking-[0.2em] mt-2">Saved</p>
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="bg-[#FDFBF7] rounded-[48px] border border-[#E6CCB2]/30 shadow-sm overflow-hidden p-4">
              <h3 className="px-6 py-4 text-xs font-black text-[#4A4A4A]/30 uppercase tracking-[0.3em]">Account Management</h3>
              <div className="space-y-1">
                {[
                  { icon: Settings, label: "Profile Settings", color: "text-[#C6A664]", bg: "bg-[#C6A664]/5" },
                  { icon: Package, label: "Order History", color: "text-[#C6A664]", bg: "bg-[#C6A664]/5" },
                  { icon: CreditCard, label: "Payment Methods", color: "text-[#C6A664]", bg: "bg-[#C6A664]/5" },
                  { icon: MapPin, label: "Saved Addresses", color: "text-[#C6A664]", bg: "bg-[#C6A664]/5" },
                  { icon: Bell, label: "Notifications", color: "text-[#C6A664]", bg: "bg-[#C6A664]/5" },
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-white/50 transition-all group text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-black text-[#4A4A4A]">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-[#4A4A4A]/20 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-[#FDFBF7] rounded-[56px] border border-[#E6CCB2]/30 shadow-sm p-10 md:p-14">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-black text-[#4A4A4A] tracking-tighter">Recent Orders</h3>
                  <p className="text-[#4A4A4A]/40 font-medium mt-1">Tracking your latest skincare arrivals.</p>
                </div>
                <Link to="/orders" className="px-6 py-3 rounded-2xl border border-[#E6CCB2]/30 text-xs font-black text-[#4A4A4A] uppercase tracking-widest hover:bg-[#4A4A4A] hover:text-white transition-all">
                  View All
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-6">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="group flex flex-col sm:flex-row items-center justify-between p-8 rounded-[40px] bg-white/30 border border-transparent hover:border-[#C6A664]/20 hover:bg-white transition-all duration-500">
                      <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <div className="w-16 h-16 rounded-[24px] bg-[#FDFBF7] flex items-center justify-center text-[#4A4A4A] border border-[#E6CCB2]/30 shadow-sm group-hover:scale-110 transition-transform">
                          <Package size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-[#4A4A4A]">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-[#4A4A4A]/40 font-bold uppercase tracking-widest">{order.createdAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right space-y-2">
                        <p className="text-3xl font-black text-[#4A4A4A] tracking-tighter">${order.total}</p>
                        <span className="inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/30 rounded-[48px] border border-dashed border-[#E6CCB2]/30">
                  <div className="w-24 h-24 rounded-[32px] bg-[#FDFBF7] flex items-center justify-center text-[#4A4A4A]/10 mx-auto mb-8 shadow-sm">
                    <ShoppingBag size={48} />
                  </div>
                  <h4 className="text-2xl font-black text-[#4A4A4A] mb-2">No orders yet</h4>
                  <p className="text-[#4A4A4A]/40 font-medium mb-10 max-w-xs mx-auto">Your skincare journey begins with your first selection.</p>
                  <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-5 bg-[#C6A664] text-white rounded-[24px] font-black hover:bg-[#4A4A4A] transition-all shadow-xl shadow-[#C6A664]/20">
                    Explore Collection
                    <ChevronRight size={20} />
                  </Link>
                </div>
              )}
            </div>

            {/* Loyalty Banner */}
            <div className="bg-[#C6A664] rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-[#C6A664]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black tracking-tighter mb-2">ElySkin Rewards</h3>
                  <p className="text-white/80 font-medium">You're only 550 points away from your next luxury gift.</p>
                </div>
                <button className="px-10 py-5 bg-[#4A4A4A] text-white rounded-[24px] font-black hover:bg-white hover:text-[#4A4A4A] transition-all shadow-xl shadow-black/10">
                  Redeem Points
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
