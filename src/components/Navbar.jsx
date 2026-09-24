// src/components/Navbar.jsx
import React from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, Wallet, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

export const Navbar = ({ onBack }) => {
  const { account } = useTrading();

  return (
    <nav className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 bg-dark-900 border-b border-dark-700 shrink-0">
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* NEW: Dedicated Back Button to return to Landing Page */}
        {onBack && (
          <button 
            onClick={onBack} 
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-dark-800"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        )}
        
        <div className="flex items-center gap-1.5 lg:gap-2">
          <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
          <span className="hidden sm:block text-white font-bold text-base lg:text-lg tracking-wide">
            CURENZA<span className="text-blue-500"> FX</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[8px] lg:text-[10px] text-gray-400 font-bold">DEMO</span>
          <div className="flex items-center gap-1 lg:gap-1.5 text-emerald-400 font-mono font-bold text-xs lg:text-base">
            <Wallet className="w-3 h-3 lg:w-4 lg:h-4" />
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] lg:text-xs font-bold px-3 py-1.5 lg:px-4 lg:py-2 rounded transition-all">
          DEPOSIT
        </button>
      </div>
    </nav>
  );
};