// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  TrendingUp, Wallet, ArrowLeft, X, ArrowUpFromLine, 
  History, User, Settings, LogOut, LayoutGrid, ChevronRight 
} from 'lucide-react';
import { BankingModal } from './BankingModal';

export const Navbar = ({ onBack }) => {
  const { account } = useTrading();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bankingModalType, setBankingModalType] = useState(null);

  const openBanking = (type) => {
    setBankingModalType(type);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-3 md:px-5 py-3 bg-[#030712] border-b border-white/5 shrink-0 relative z-40 shadow-sm">
        
        {/* --- LEFT: Logo & Back --- */}
        <div className="flex items-center gap-3 md:gap-4">
          {onBack && (
            <button 
              onClick={onBack} 
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
            <span className="hidden sm:block text-white font-bold text-lg tracking-wide">
              CURENZA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> FX</span>
            </span>
          </div>
        </div>
        
        {/* --- RIGHT: Integrated Wallet Pill & Menu --- */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Premium Wallet Pill */}
          <div className="flex items-center bg-[#111827] border border-white/10 rounded-full p-1 pl-4 md:pl-5 gap-3 md:gap-4 shadow-inner">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Demo Account</span>
              </div>
              <span className="text-white font-mono font-bold text-xs md:text-sm leading-none">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <button 
              onClick={() => setBankingModalType('deposit')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-1"
            >
              Deposit
            </button>
          </div>

          {/* Premium Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-95"
          >
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </nav>

      {/* --- SIDEBAR DRAWER MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Dark Glass Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sliding Menu Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#030712] border-l border-white/10 flex flex-col animate-fade-in-down shadow-2xl overflow-hidden">
            
            {/* Generic User Profile Header */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent relative">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0b0e14] flex items-center justify-center border-2 border-[#030712]">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-lg">Demo Trader</h3>
                  <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
                    ID: 8492011 <Wallet className="w-3 h-3 text-emerald-500 ml-1"/>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
              
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4 px-3">Finance</div>
              
              <button 
                onClick={() => openBanking('withdraw')}
                className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-bold border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><ArrowUpFromLine className="w-4 h-4" /></div>
                  Withdraw Funds
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
              
              <button className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-bold border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><History className="w-4 h-4" /></div>
                  Trade History
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>

              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-6 px-3">Account</div>
              
              <button className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-bold border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><User className="w-4 h-4" /></div>
                  My Profile
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
              
              <button className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-bold border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/10 text-gray-400 rounded-xl group-hover:scale-110 transition-transform"><Settings className="w-4 h-4" /></div>
                  Settings
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
            </div>

            <div className="p-5 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
              <button 
                onClick={onBack}
                className="group flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all font-bold border border-rose-500/20"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Exit Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BANKING MODAL POPUP --- */}
      {bankingModalType && (
        <BankingModal 
          initialType={bankingModalType} 
          onClose={() => setBankingModalType(null)} 
        />
      )}
    </>
  );
};