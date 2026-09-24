// src/components/Watchlist.jsx
import React from 'react';
import { useTrading } from '../context/TradingContext';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Watchlist = () => {
  const { quotes, selectedPair, setSelectedPair } = useTrading();

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:flex p-3 border-b border-dark-700 items-center justify-between text-xs font-bold text-gray-400 shrink-0">
        <span>MARKETS</span>
        <Activity className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto divide-x lg:divide-x-0 lg:divide-y divide-dark-700 scrollbar-hide">
        {Object.entries(quotes).map(([symbol, data]) => {
          const isSelected = selectedPair === symbol;
          
          // Determine flash color class
          const flashClass = data.tick === 'up' ? 'animate-tick-up' : 'animate-tick-down';

          return (
            <div key={symbol} onClick={() => setSelectedPair(symbol)} className={`p-3 flex items-center justify-between gap-4 lg:gap-0 cursor-pointer shrink-0 transition-colors ${isSelected ? 'bg-blue-600/10 lg:border-l-2 lg:border-b-0 border-b-2 border-blue-500' : 'hover:bg-dark-900 border-transparent lg:border-l-2 lg:border-b-0 border-b-2'}`}>
              <div>
                <div className="text-white font-bold text-xs font-mono">{symbol}</div>
                <div className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 lg:mt-1 ${data.change >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {data.change >= 0 ? <ArrowUpRight className="w-3 h-3 hidden lg:block" /> : <ArrowDownRight className="w-3 h-3 hidden lg:block" />}
                  {data.change > 0 ? `+${data.change.toFixed(2)}` : data.change.toFixed(2)}%
                </div>
              </div>
              <div className="text-right font-mono text-xs flex flex-col items-end">
                {/* Applied the key trick and animation class */}
                <div key={data.ask} className={`text-emerald-400 px-1 rounded ${flashClass}`}>
                  {data.ask.toFixed(5)}
                </div>
                <div key={data.bid} className={`text-rose-500 mt-0.5 px-1 rounded ${flashClass}`}>
                  {data.bid.toFixed(5)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};