// src/components/ChartWindow.jsx
import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { useTrading } from '../context/TradingContext';

const TIMEFRAMES = [
  { label: '10S', seconds: 10 },
  { label: '1M', seconds: 60 },
  { label: '5M', seconds: 300 },
  { label: '15M', seconds: 900 }
];

export const ChartWindow = () => {
  // NEW: Added positions to the destructuring
  const { selectedPair, quotes, timeframe, setTimeframe, positions } = useTrading();
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const priceLinesRef = useRef(new Map()); // NEW: Track active entry lines

  // 1. INITIALIZE CHART ONCE
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#0b0e14' }, textColor: '#6b7280' },
      grid: { vertLines: { color: '#1a202c' }, horzLines: { color: '#1a202c' } },
      crosshair: { mode: 0 },
      priceScale: { autoScale: true, borderColor: '#232936' },
      timeScale: { borderColor: '#232936', timeVisible: true, secondsVisible: true },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', downColor: '#f43f5e', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#f43f5e',
    });
    
    chartRef.current = chart;
    seriesRef.current = candleSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth, 
          height: chartContainerRef.current.clientHeight 
        });
      }
    };
    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // 2. LOAD DATA ON PAIR OR TIMEFRAME CHANGE
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !quotes[selectedPair]) return;

    const currentTf = TIMEFRAMES.find(t => t.label === timeframe) || TIMEFRAMES[0];
    const CANDLE_INTERVAL = currentTf.seconds;
    const HISTORY_LENGTH = 5000;
    const now = Math.floor(Date.now() / 1000);
    
    const livePrice = quotes[selectedPair].bid;
    const isJpy = selectedPair.includes("JPY");
    const volatility = Math.sqrt(CANDLE_INTERVAL / 10); 
    
    let currentPrice = livePrice;
    const mockData = new Array(HISTORY_LENGTH);

    for (let i = 0; i < HISTORY_LENGTH; i++) {
      const close = currentPrice;
      const open = close + (Math.random() - 0.5) * (isJpy ? 0.05 : 0.0005) * volatility;
      const high = Math.max(open, close) + Math.random() * (isJpy ? 0.02 : 0.0002) * volatility;
      const low = Math.min(open, close) - Math.random() * (isJpy ? 0.02 : 0.0002) * volatility;
      
      mockData[HISTORY_LENGTH - 1 - i] = { 
        time: now - (i * CANDLE_INTERVAL), 
        open, high, low, close 
      };
      currentPrice = open; 
    }

    seriesRef.current.setData(mockData);
    lastCandleRef.current = mockData[mockData.length - 1]; 

    chartRef.current.timeScale().applyOptions({ barSpacing: 12, rightOffset: 8 });
    const dataLength = mockData.length;
    chartRef.current.timeScale().setVisibleLogicalRange({ from: dataLength - 60, to: dataLength + 5 });

  }, [selectedPair, timeframe]); 

  // 3. LIVE TICK UPDATES
  useEffect(() => {
    if (!seriesRef.current || !lastCandleRef.current || !quotes[selectedPair]) return;
    
    const livePrice = quotes[selectedPair].bid;
    const now = Math.floor(Date.now() / 1000);
    const currentTf = TIMEFRAMES.find(t => t.label === timeframe) || TIMEFRAMES[0];
    const CANDLE_INTERVAL = currentTf.seconds;
    
    let lastCandle = { ...lastCandleRef.current };

    if (now >= lastCandle.time + CANDLE_INTERVAL) {
      lastCandle = { 
        time: lastCandle.time + CANDLE_INTERVAL, open: lastCandle.close, 
        high: Math.max(lastCandle.close, livePrice), low: Math.min(lastCandle.close, livePrice), close: livePrice 
      };
    } else {
      lastCandle.close = livePrice;
      if (livePrice > lastCandle.high) lastCandle.high = livePrice;
      if (livePrice < lastCandle.low) lastCandle.low = livePrice;
    }
    
    lastCandleRef.current = lastCandle;
    seriesRef.current.update(lastCandle);
  }, [quotes, selectedPair, timeframe]);

  // 4. NEW: DRAW ENTRY LINES FOR ACTIVE TRADES
  useEffect(() => {
    if (!seriesRef.current) return;

    // Clear old lines first
    priceLinesRef.current.forEach(line => seriesRef.current.removePriceLine(line));
    priceLinesRef.current.clear();

    // Draw active positions that match the current chart pair
    positions.forEach(pos => {
      if (pos.symbol === selectedPair) {
        const line = seriesRef.current.createPriceLine({
          price: pos.entryPrice,
          color: pos.direction === 'UP' ? '#10b981' : '#f43f5e', // Green for UP, Red for DOWN
          lineWidth: 2,
          lineStyle: 2, // Dashed line style
          axisLabelVisible: true,
          title: `${pos.direction} $${pos.amount}`,
        });
        priceLinesRef.current.set(pos.id, line);
      }
    });
  }, [positions, selectedPair]);

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <div className="flex items-center bg-dark-800/80 px-2 py-1 rounded border border-dark-700">
          <span className="font-bold text-xs text-white font-mono">{selectedPair}</span>
        </div>
        <div className="flex items-center bg-dark-800/80 rounded border border-dark-700 overflow-hidden backdrop-blur-sm shadow-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setTimeframe(tf.label)}
              className={`px-3 py-1 text-[10px] font-bold font-sans transition-colors ${
                timeframe === tf.label ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="absolute inset-0" />
    </div>
  );
};