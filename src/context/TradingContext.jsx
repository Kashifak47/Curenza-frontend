// src/context/TradingContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from './AuthContext';
import { API_BASE_URL, WS_URL } from '../config';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  const { user, logout } = useAuth(); // Added logout

  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("10S");
  const [positions, setPositions] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [localBalance, setLocalBalance] = useState(user?.demoBalance || 10000.00);

  const PAYOUT_RATE = 0.82;

  useEffect(() => {
    if (user?.demoBalance) {
      setLocalBalance(user.demoBalance);
    }
  }, [user]);

  const addToast = (type, title, message) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTradeHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('curenza_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/trades`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTradeHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch trade history:", error);
    }
  }, [logout]);

  const syncBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('curenza_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (response.ok) {
        const userData = await response.json();

        setLocalBalance(userData.demoBalance);

        const storedUser = JSON.parse(localStorage.getItem('curenza_user'));
        if (storedUser) {
          storedUser.demoBalance = userData.demoBalance;
          localStorage.setItem('curenza_user', JSON.stringify(storedUser));
        }
      }
    } catch (error) {
      console.error("Failed to sync balance:", error);
    }
  }, [logout]);

  useEffect(() => {
    if (user) {
      fetchTradeHistory();
      syncBalance();
    }
  }, [user, fetchTradeHistory, syncBalance]);

  useEffect(() => {
  const stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    
    onConnect: () => {
      stompClient.subscribe('/topic/prices', (message) => {
        const tick = JSON.parse(message.body);
        
        setQuotes((prev) => {
          const previousQuote = prev[tick.symbol];
          const oldBid = previousQuote ? previousQuote.bid : tick.currentPrice;
          const tickDirection = tick.currentPrice > oldBid ? 'up' : 'down';
          const change = tick.currentPrice - oldBid;

          const isJpy = tick.symbol.includes("JPY");
          const spread = isJpy ? 0.020 : 0.00015;
          const askPrice = tick.currentPrice + spread;

          return {
            ...prev,
            [tick.symbol]: {
              bid: tick.currentPrice,
              ask: parseFloat(askPrice.toFixed(isJpy ? 3 : 5)),
              change: (previousQuote?.change || 0) + change,
              tick: tickDirection
            }
          };
        });
      });
    }
  });

  stompClient.activate();
  return () => stompClient.deactivate();
}, []);

  useEffect(() => {
    if (positions.length === 0) return;

    const now = Date.now();
    const activeTrades = [];
    let needsSync = false;

    positions.forEach(pos => {
      const currentQuote = quotes[pos.symbol];
      if (!currentQuote) {
        activeTrades.push(pos);
        return;
      }

      const timeLeft = Math.max(0, Math.ceil((pos.expiryTime - now) / 1000));
      const currentPrice = pos.direction === 'UP' ? currentQuote.bid : currentQuote.ask;

      if (now >= pos.expiryTime) {
        needsSync = true;

        let isWin = false;
        if (pos.direction === 'UP' && currentPrice > pos.entryPrice) isWin = true;
        if (pos.direction === 'DOWN' && currentPrice < pos.entryPrice) isWin = true;
        const isTie = currentPrice === pos.entryPrice;

        if (isWin) {
          addToast('success', 'Trade Won!', `Payout on ${pos.symbol}`);
          setLocalBalance(prev => parseFloat((prev + pos.amount + (pos.amount * PAYOUT_RATE)).toFixed(2)));
        } else if (isTie) {
          addToast('info', 'Trade Tied', `Refunded ${pos.symbol}`);
          setLocalBalance(prev => parseFloat((prev + pos.amount).toFixed(2)));
        } else {
          addToast('error', 'Trade Lost', `-$${pos.amount} on ${pos.symbol}`);
        }
      } else {
        activeTrades.push({ ...pos, currentPrice, timeLeft });
      }
    });

    setPositions(activeTrades);

    if (needsSync) {
      setTimeout(() => {
        fetchTradeHistory();
        syncBalance();
      }, 1500);
    }
  }, [quotes, fetchTradeHistory, syncBalance]);

  const placeOrder = async (direction, amountStr, durationSeconds) => {
    const amount = parseFloat(amountStr);

    if (amount > localBalance) {
      addToast("error", "Insufficient Funds", "You do not have enough balance.");
      return;
    }

    setLocalBalance(prev => parseFloat((prev - amount).toFixed(2)));

    try {
      const token = localStorage.getItem('curenza_token');

      const response = await fetch(`${API_BASE_URL}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: selectedPair,
          direction: direction,
          amount: amount,
          durationSeconds: durationSeconds
        })
      });

      if (response.status === 401 || response.status === 403) {
        setLocalBalance(prev => parseFloat((prev + amount).toFixed(2))); // Refund local UI instantly
        addToast("error", "You are not logged in", "Please log in to continue");
        logout(); // Auto logout
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server rejected trade");
      }

      const tradeData = await response.json();

      const newPosition = {
        id: tradeData.id,
        symbol: tradeData.symbol,
        direction: tradeData.direction,
        amount: tradeData.amount,
        entryPrice: tradeData.entryPrice,
        currentPrice: tradeData.entryPrice,
        startTime: tradeData.openTime,
        expiryTime: tradeData.expiryTime,
        timeLeft: durationSeconds,
        payoutRate: PAYOUT_RATE
      };

      setPositions((prev) => [newPosition, ...prev]);
      addToast("info", "Trade Executed", `${direction} on ${selectedPair} at ${tradeData.entryPrice}`);

    } catch (error) {
      console.error("Trade failed:", error);
      setLocalBalance(prev => parseFloat((prev + amount).toFixed(2)));
      addToast("error", "Trade Failed", "Could not execute trade on server.");
    }
  };

  return (
    <TradingContext.Provider value={{
      account: { balance: localBalance },
      quotes, selectedPair, setSelectedPair,
      positions, tradeHistory, placeOrder,
      toasts, removeToast, timeframe, setTimeframe
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);