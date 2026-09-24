// src/components/PositionsTable.jsx
import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Clock, ArrowUp, ArrowDown } from 'lucide-react';

export const PositionsTable = () => {
  const { positions, tradeHistory } = useTrading();
  const [activeTab, setActiveTab] = useState('open'); 

  return (
    <div className="w-full h-full flex flex-col bg-dark-800">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-dark-700 px-4 shrink-0">
        <button
          onClick={() => setActiveTab('open')}
          className={`py-2 lg:py-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'open' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Active Trades ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 lg:py-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'history' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Closed Trades
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            {activeTab === 'open' ? (
              <tr className="bg-dark-900 text-gray-500 border-b border-dark-700 uppercase text-[10px] lg:text-xs">
                <th className="p-2 lg:p-3">Ticket</th>
                <th className="p-2 lg:p-3">Asset</th>
                <th className="p-2 lg:p-3 text-center">Direction</th>
                <th className="p-2 lg:p-3">Amount</th>
                <th className="p-2 lg:p-3">Entry Price</th>
                <th className="p-2 lg:p-3">Current Price</th>
                <th className="p-2 lg:p-3 text-right">Time Left</th>
              </tr>
            ) : (
              <tr className="bg-dark-900 text-gray-500 border-b border-dark-700 uppercase text-[10px] lg:text-xs">
                <th className="p-2 lg:p-3">Time</th>
                <th className="p-2 lg:p-3">Asset</th>
                <th className="p-2 lg:p-3 text-center">Direction</th>
                <th className="p-2 lg:p-3">Amount</th>
                <th className="p-2 lg:p-3">Entry / Close</th>
                <th className="p-2 lg:p-3 text-center">Result</th>
                <th className="p-2 lg:p-3 text-right">Profit/Loss</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-dark-700">
            {activeTab === 'open' ? (
              positions.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 lg:py-8 text-gray-600 text-xs lg:text-sm font-sans">No active trades running</td></tr>
              ) : (
                positions.map((pos) => {
                  // Determine if currently winning or losing for color coding
                  let isWinning = false;
                  if (pos.direction === 'UP' && pos.currentPrice > pos.entryPrice) isWinning = true;
                  if (pos.direction === 'DOWN' && pos.currentPrice < pos.entryPrice) isWinning = true;
                  
                  return (
                    <tr key={pos.id} className="hover:bg-dark-900/50 transition-colors">
                      <td className="p-2 lg:p-3 text-gray-400 font-mono text-xs">{pos.id}</td>
                      <td className="p-2 lg:p-3 font-bold text-white text-xs lg:text-sm">{pos.symbol}</td>
                      <td className="p-2 lg:p-3">
                        <div className={`mx-auto w-16 text-center rounded text-[10px] lg:text-xs font-bold py-0.5 flex items-center justify-center gap-1 ${pos.direction === 'UP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {pos.direction === 'UP' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                          {pos.direction}
                        </div>
                      </td>
                      <td className="p-2 lg:p-3 text-white font-mono text-xs lg:text-sm">${pos.amount.toFixed(2)}</td>
                      <td className="p-2 lg:p-3 text-gray-400 font-mono text-xs lg:text-sm">{pos.entryPrice}</td>
                      <td className={`p-2 lg:p-3 font-mono font-bold text-xs lg:text-sm ${isWinning ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {pos.currentPrice}
                      </td>
                      <td className="p-2 lg:p-3 text-right font-mono font-bold text-blue-400 text-xs lg:text-sm animate-pulse">
                        {pos.timeLeft}s
                      </td>
                    </tr>
                  )
                })
              )
            ) : (
              tradeHistory.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 lg:py-8 text-gray-600 text-xs lg:text-sm font-sans">No closed trades yet</td></tr>
              ) : (
                tradeHistory.map((trade, index) => (
                  <tr key={`${trade.id}-${index}`} className="hover:bg-dark-900/50 transition-colors">
                    <td className="p-2 lg:p-3 text-gray-400 font-mono text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {trade.closeTime}</td>
                    <td className="p-2 lg:p-3 font-bold text-white text-xs lg:text-sm">{trade.symbol}</td>
                    <td className="p-2 lg:p-3">
                      <div className={`mx-auto w-16 text-center rounded text-[10px] lg:text-xs font-bold py-0.5 ${trade.direction === 'UP' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trade.direction}
                      </div>
                    </td>
                    <td className="p-2 lg:p-3 text-white font-mono text-xs lg:text-sm">${trade.amount.toFixed(2)}</td>
                    <td className="p-2 lg:p-3 text-gray-300 font-mono text-xs">
                      {trade.entryPrice} <br/> <span className="text-gray-500">{trade.closePrice}</span>
                    </td>
                    <td className="p-2 lg:p-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        trade.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-500' : 
                        trade.result === 'LOSS' ? 'bg-rose-500/20 text-rose-500' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {trade.result}
                      </span>
                    </td>
                    <td className={`p-2 lg:p-3 text-right font-bold font-mono text-xs lg:text-sm ${trade.profit > 0 ? 'text-emerald-500' : trade.profit < 0 ? 'text-rose-500' : 'text-gray-400'}`}>
                      {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};