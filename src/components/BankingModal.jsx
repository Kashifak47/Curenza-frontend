// src/components/BankingModal.jsx
import React, { useState } from 'react';
import { X, CreditCard, ArrowDownToLine, ArrowUpFromLine, Wallet, Landmark } from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const BankingModal = ({ initialType = 'deposit', onClose }) => {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('crypto');
  const { account } = useTrading();

  const handleAction = () => {
    alert(`${type.toUpperCase()} request for $${amount} via ${method} recorded! \n\nThis will be processed by the Spring Boot backend in Phase 2.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in-down">
      <div className="bg-[#0b0e14] border border-dark-700 p-6 md:p-8 rounded-3xl w-full max-w-md relative shadow-2xl shadow-black">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors bg-dark-800 p-1.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex bg-dark-900 rounded-xl p-1 mb-8">
          <button 
            onClick={() => setType('deposit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${type === 'deposit' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            <ArrowDownToLine className="w-4 h-4" /> Deposit
          </button>
          <button 
            onClick={() => setType('withdraw')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${type === 'withdraw' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            <ArrowUpFromLine className="w-4 h-4" /> Withdraw
          </button>
        </div>

        {/* Current Balance Display */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Available Demo Balance</p>
          <p className="text-3xl font-mono font-bold text-white">
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'crypto', icon: Wallet, label: 'Crypto' },
              { id: 'card', icon: CreditCard, label: 'Bank Card' },
              { id: 'bank', icon: Landmark, label: 'Transfer' }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${method === m.id ? 'bg-dark-800 border-blue-500 text-white' : 'bg-dark-900 border-dark-700 text-gray-500 hover:border-dark-500'}`}
              >
                <m.icon className={`w-5 h-5 ${method === m.id ? 'text-blue-500' : ''}`} />
                <span className="text-[10px] font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Amount (USD)</label>
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 pl-8 pr-4 text-white font-mono font-bold outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {[50, 100, 500, 1000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className="flex-1 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-gray-300 rounded-lg py-1.5 text-xs font-bold transition-colors"
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAction}
          disabled={!amount || amount <= 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            !amount || amount <= 0 
              ? 'bg-dark-700 cursor-not-allowed opacity-50' 
              : type === 'deposit' 
                ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
          }`}
        >
          {type === 'deposit' ? 'Confirm Deposit' : 'Request Withdrawal'}
        </button>
      </div>
    </div>
  );
};