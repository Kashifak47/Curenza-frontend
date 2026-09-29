// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ initialType = 'login', onClose, onLoginSuccess }) => {
  const { login, register } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(initialType === 'login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onLoginSuccess(); 
      }, 1500);

    } catch (err) {
      setIsSubmitting(false);
      
      if (err.response?.status === 403) {
        setError('Invalid email or password.');
      } else if (err.response?.status === 409 || err.response?.data?.message?.includes('already in use')) {
        setError('This email is already registered.');
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in-down">
      <div className="bg-[#0b0e14] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden">
        
        {!showSuccess && (
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full disabled:opacity-50 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {showSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-fade-in-down">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              {isLoginMode ? 'Login Successful!' : 'Account Created!'}
            </h2>
            <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              Redirecting to Terminal...
            </p>
          </div>
        ) : (
          <div className="animate-fade-in-down">
            <div className="mb-8 text-center relative">
              {/* Smooth text crossfade for titles */}
              <h2 className="text-2xl font-extrabold text-white mb-2">
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 text-sm h-5">
                {isLoginMode ? 'Enter your credentials to access the terminal.' : 'Join Curenza FX and start trading today.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-500 text-sm animate-fade-in-down">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col">
              
              {/* MAGIC TRICK: Smooth Grid Expansion for Full Name */}
              <div className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${isLoginMode ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-4'}`}>
                <div className="overflow-hidden">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></span>
                    <input 
                      type="text" 
                      required={!isLoginMode} // Crucial: Don't require it if it's hidden!
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></span>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                    placeholder="trader@curenza.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></span>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>{isLoginMode ? 'Access Terminal' : 'Open Account'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError(''); // Clear any errors when switching modes
                }}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer group flex items-center justify-center gap-1 w-full"
              >
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-1 transition-all">
                  {isLoginMode ? 'Register' : 'Log In'}
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};