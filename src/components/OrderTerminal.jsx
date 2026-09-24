// src/components/OrderTerminal.jsx
import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const OrderTerminal = () => {
  const { selectedPair, quotes, placeOrder, account } = useTrading();
  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(60);

  const quote = quotes[selectedPair] || { bid: 0, ask: 0, tick: '' };
  const isJpy = selectedPair.includes("JPY");
  const flashClass = quote.tick === 'up' ? 'animate-tick-up' : 'animate-tick-down';
  const potentialProfit = (amount * 0.82).toFixed(2);

  return (
    // Reduced padding from p-2 to p-1.5 for mobile
    <div className="p-1.5 lg:p-4 flex flex-col gap-1.5 lg:gap-4 font-sans h-full justify-center">
      <div className="hidden lg:flex items-center justify-between pb-3 border-b border-dark-700">
        <span className="text-xs font-bold text-white">FIXED TIME TERMINAL</span>
        <span className="text-[10px] text-gray-500 font-mono">Bal: ${account.balance.toFixed(2)}</span>
      </div>

      <div className="flex flex-row lg:flex-col gap-1.5 lg:gap-4 items-center lg:items-stretch">
        <div className="w-1/2 lg:w-full">
          <label className="hidden lg:block text-[10px] text-gray-400 mb-1">AMOUNT ($)</label>
          <input 
            type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount"
            className="w-full bg-dark-900 border border-dark-700 rounded p-1.5 lg:p-2 text-white font-mono text-xs lg:text-sm focus:outline-none focus:border-blue-500" 
          />
        </div>
        <div className="w-1/2 lg:w-full">
          <label className="hidden lg:block text-[10px] text-gray-400 mb-1">TIME (SECONDS)</label>
          <select 
            value={duration} onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-dark-900 border border-dark-700 rounded p-1.5 lg:p-2 text-white font-mono text-xs lg:text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={15}>15 Sec</option>
            <option value={30}>30 Sec</option>
            <option value={60}>1 Min</option>
            <option value={300}>5 Min</option>
          </select>
        </div>
      </div>

      {/* Hidden on mobile to save space! */}
      <div className="hidden lg:block bg-dark-900 border border-dark-700 rounded p-2 text-center mt-auto lg:mt-2">
        <div className="text-[10px] text-gray-400 mb-1">POTENTIAL PAYOUT (82%)</div>
        <div className="text-emerald-400 font-bold text-sm lg:text-base">+${potentialProfit}</div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 lg:gap-2 mt-auto">
        <button onClick={() => placeOrder('UP', amount, duration)} className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-1.5 lg:p-3 rounded flex flex-col items-center transition-transform">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="text-[10px] lg:text-xs tracking-wider font-bold">UP</span>
          </div>
          <span key={quote.ask} className={`font-mono text-[10px] lg:text-sm mt-0.5 px-2 rounded ${flashClass}`}>
            {quote.ask.toFixed(isJpy ? 3 : 5)}
          </span>
        </button>
        <button onClick={() => placeOrder('DOWN', amount, duration)} className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white p-1.5 lg:p-3 rounded flex flex-col items-center transition-transform">
          <div className="flex items-center gap-1">
            <ArrowDown className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="text-[10px] lg:text-xs tracking-wider font-bold">DOWN</span>
          </div>
          <span key={quote.bid} className={`font-mono text-[10px] lg:text-sm mt-0.5 px-2 rounded ${flashClass}`}>
            {quote.bid.toFixed(isJpy ? 3 : 5)}
          </span>
        </button>
      </div>
    </div>
  );
};