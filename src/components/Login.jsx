import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("The credentials provided do not match our records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 py-32 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C6A664]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4A4A4A]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl bg-[#FDFBF7] rounded-[48px] border border-[#E6CCB2]/20 shadow-[0_40px_100px_rgba(198,166,100,0.05)] p-8 md:p-16 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4A4A4A] rounded-2xl text-white mb-8 shadow-xl shadow-[#4A4A4A]/20">
            <Sparkles size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#4A4A4A] tracking-tighter mb-4">
            Welcome <span className="text-[#C6A664]">Back</span>
          </h2>
          <p className="text-[#4A4A4A]/60 font-medium">Continue your journey to radiant skin.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4A4A4A]/20" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[#FDFBF7] border border-[#E6CCB2]/20 focus:bg-white focus:border-[#C6A664]/30 outline-none transition-all font-bold text-[#4A4A4A] placeholder:text-[#4A4A4A]/20 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40">Password</label>
              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-[#C6A664] hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4A4A4A]/20" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[#FDFBF7] border border-[#E6CCB2]/20 focus:bg-white focus:border-[#C6A664]/30 outline-none transition-all font-bold text-[#4A4A4A] placeholder:text-[#4A4A4A]/20 shadow-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-5 rounded-2xl bg-[#C6A664] text-white font-black text-lg hover:bg-[#4A4A4A] transition-all transform active:scale-[0.98] shadow-xl shadow-[#C6A664]/20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Enter Boutique
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#4A4A4A]/60 font-medium">
            New to ElySkin?{" "}
            <Link to="/signup" className="text-[#C6A664] font-black hover:underline ml-1">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
