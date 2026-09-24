// src/context/TradingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("10S");
  const [positions, setPositions] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]); 
  const [toasts, setToasts] = useState([]);

  // Base payout rate (82% profit for a win)
  const PAYOUT_RATE = 0.82;

  const [quotes, setQuotes] = useState({
    "EUR/USD": { bid: 1.08420, ask: 1.08435, change: 0.15, tick: '' },
    "GBP/USD": { bid: 1.26110, ask: 1.26130, change: -0.32, tick: '' },
    "USD/JPY": { bid: 154.200, ask: 154.220, change: 0.45, tick: '' },
    "AUD/USD": { bid: 0.65420, ask: 0.65435, change: -0.12, tick: '' },
    "USD/CAD": { bid: 1.35200, ask: 1.35218, change: 0.05, tick: '' },
  });

  const [account, setAccount] = useState({
    balance: 10000.00 // Fixed-time trading only uses raw balance
  });

  const addToast = (type, title, message) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Live Price Stream Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((pair) => {
          const isJpy = pair.includes("JPY");
          const step = isJpy ? 0.01 : 0.0001;
          const delta = (Math.random() - 0.495) * step;
          const tick = delta > 0 ? 'up' : 'down';
          const newBid = parseFloat((updated[pair].bid + delta).toFixed(isJpy ? 3 : 5));
          const spread = isJpy ? 0.020 : 0.00015;
          
          updated[pair] = {
            ...updated[pair],
            bid: newBid,
            ask: parseFloat((newBid + spread).toFixed(isJpy ? 3 : 5)),
            change: updated[pair].change + (delta * 10),
            tick 
          };
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-Resolve Fixed Time Trades
  useEffect(() => {
    if (positions.length === 0) return;

    const now = Date.now();
    let updatedBalance = account.balance;
    const completedTrades = [];
    const activeTrades = [];

    positions.forEach(pos => {
      const currentQuote = quotes[pos.symbol];
      if (!currentQuote) {
        activeTrades.push(pos);
        return;
      }

      // Calculate time left in seconds
      const timeLeft = Math.max(0, Math.ceil((pos.expiryTime - now) / 1000));
      const currentPrice = pos.direction === 'UP' ? currentQuote.bid : currentQuote.ask;

      if (now >= pos.expiryTime) {
        // Trade Finished! Calculate Win/Loss
        let isWin = false;
        if (pos.direction === 'UP' && currentPrice > pos.entryPrice) isWin = true;
        if (pos.direction === 'DOWN' && currentPrice < pos.entryPrice) isWin = true;
        const isTie = currentPrice === pos.entryPrice;

        let profitAmount = 0;
        let result = 'LOSS';

        if (isWin) {
          profitAmount = pos.amount * PAYOUT_RATE;
          updatedBalance += (pos.amount + profitAmount); // Return stake + profit
          result = 'WIN';
        } else if (isTie) {
          updatedBalance += pos.amount; // Refund stake
          result = 'TIE';
        } 
        // If loss, balance was already deducted on entry, profit is -amount
        if (result === 'LOSS') {
          profitAmount = -pos.amount;
        }

        completedTrades.push({
          ...pos,
          closePrice: currentPrice,
          closeTime: new Date().toLocaleTimeString(),
          result,
          profit: profitAmount
        });

      } else {
        // Trade still running, just update current price and time left
        activeTrades.push({ ...pos, currentPrice, timeLeft });
      }
    });

    if (completedTrades.length > 0) {
      setPositions(activeTrades);
      setTradeHistory(prev => [...completedTrades, ...prev]);
      setAccount(prev => ({ ...prev, balance: parseFloat(updatedBalance.toFixed(2)) }));
      
      // Fire notifications for finished trades
      completedTrades.forEach(t => {
        if (t.result === 'WIN') addToast('success', 'Trade Won!', `+$${t.profit.toFixed(2)} on ${t.symbol}`);
        else if (t.result === 'LOSS') addToast('error', 'Trade Lost', `-$${Math.abs(t.profit).toFixed(2)} on ${t.symbol}`);
        else addToast('info', 'Trade Tied', `Refunded $${t.amount.toFixed(2)} on ${t.symbol}`);
      });
    } else {
      setPositions(activeTrades);
    }
    // eslint-disable-next-line
  }, [quotes]); 

  // 3. Place Fixed-Time Order
  const placeOrder = (direction, amountStr, durationSeconds) => {
    const amount = parseFloat(amountStr);
    
    if (amount > account.balance) {
      addToast("error", "Insufficient Funds", "You do not have enough balance for this trade.");
      return;
    }

    // Deduct stake instantly from balance
    setAccount(prev => ({ ...prev, balance: prev.balance - amount }));

    const currentQuote = quotes[selectedPair];
    const entryPrice = direction === 'UP' ? currentQuote.ask : currentQuote.bid;
    const now = Date.now();

    const newPosition = {
      id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol: selectedPair,
      direction,
      amount,
      entryPrice,
      currentPrice: entryPrice,
      startTime: now,
      openTime: new Date().toLocaleTimeString(),
      expiryTime: now + (durationSeconds * 1000),
      timeLeft: durationSeconds,
      payoutRate: PAYOUT_RATE
    };

    setPositions((prev) => [newPosition, ...prev]);
    addToast("info", "Trade Started", `${direction} on ${selectedPair} for ${durationSeconds}s`);
  };

  return (
    <TradingContext.Provider value={{ 
      account, quotes, selectedPair, setSelectedPair, 
      positions, tradeHistory, placeOrder,
      toasts, removeToast, timeframe, setTimeframe 
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);