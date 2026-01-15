"use client";
import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = () => {
    login(email, true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[440px] rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 text-gray-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">
            {isLogin ? "Welcome Back" : "Join the Club"}
          </h2>
          <p className="text-gray-600 text-sm font-semibold mt-2">
            {isLogin ? "Sign in to your Breezecars account." : "Start your premium journey today."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl font-bold text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#632197] focus:bg-white transition-all shadow-sm" 
              />
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl font-bold text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#632197] focus:bg-white transition-all shadow-sm" 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl font-bold text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#632197] focus:bg-white transition-all shadow-sm" 
          />
          
          <button type="submit" className="w-full bg-[#632197] text-white py-4 mt-2 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4d1975] transition-all shadow-lg active:scale-[0.98]">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm font-bold">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#632197] hover:underline transition-all"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}