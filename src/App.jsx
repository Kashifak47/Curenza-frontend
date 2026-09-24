// src/App.jsx
import React, { useState, useEffect } from 'react';
import { TradingProvider } from './context/TradingContext';
import { Navbar } from './components/Navbar';
import { Watchlist } from './components/Watchlist';
import { ChartWindow } from './components/ChartWindow';
import { OrderTerminal } from './components/OrderTerminal';
import { PositionsTable } from './components/PositionsTable';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './components/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  // THE MAGIC FIX: Controls the global browser body scroll dynamically
  useEffect(() => {
    if (currentView === 'terminal') {
      document.body.style.overflow = 'hidden'; // Lock scroll for terminal
    } else {
      document.body.style.overflow = 'auto';   // Unlock scroll for landing page
    }
    
    // Cleanup function
    return () => { document.body.style.overflow = 'auto'; };
  }, [currentView]);

  return (
    <TradingProvider>
      {currentView === 'landing' ? (
        <LandingPage onLaunch={() => setCurrentView('terminal')} />
      ) : (
        <div className="h-[100dvh] w-full bg-dark-900 text-white flex flex-col overflow-hidden relative">
          {/* Passed 'onBack' function to Navbar so we have a dedicated back button */}
          <Navbar onBack={() => setCurrentView('landing')} />
          <ToastContainer />
          
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
            <div className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-dark-700 bg-dark-800">
              <Watchlist />
            </div>

            <div className="flex-1 w-full min-h-[150px] lg:min-h-0 flex flex-col bg-dark-900 relative">
              <ChartWindow />
            </div>

            <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-dark-700 bg-dark-800">
              <OrderTerminal />
            </div>

            <div className="block lg:hidden w-full h-[110px] shrink-0 border-t border-dark-700 bg-dark-800">
              <PositionsTable />
            </div>
          </div>

          <div className="hidden lg:block h-56 w-full shrink-0 border-t border-dark-700 bg-dark-800">
            <PositionsTable />
          </div>
        </div>
      )}
    </TradingProvider>
  );
}

export default App;