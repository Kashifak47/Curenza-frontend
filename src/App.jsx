// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { TradingProvider } from './context/TradingContext';
import { Navbar } from './components/Navbar';
import { Watchlist } from './components/Watchlist';
import { ChartWindow } from './components/ChartWindow';
import { OrderTerminal } from './components/OrderTerminal';
import { PositionsTable } from './components/PositionsTable';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

function App() {
  const { user, isLoading } = useAuth();

  const [currentView, setCurrentView] = useState('landing');
  const [authModalType, setAuthModalType] = useState(null); 

  useEffect(() => {
    if (user) {
      setCurrentView('terminal');
    } else if (!isLoading) {
      setCurrentView('landing');
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (currentView === 'terminal') {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto';   
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [currentView]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white font-bold tracking-widest text-sm uppercase">Loading Engine...</div>;
  }

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onLaunch={() => setCurrentView('terminal')}
          onOpenAuth={(type) => setAuthModalType(type)}
        />
      ) : (
        <TradingProvider>
          <div className="h-[100dvh] w-full bg-dark-900 text-white flex flex-col overflow-hidden relative">
            <Navbar onBack={() => setCurrentView('landing')} />
            <ToastContainer />

            {/* Added overflow-y-auto so mobile can scroll through the stacked views */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">
              
              <div className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-dark-700 bg-dark-800">
                <Watchlist />
              </div>

              {/* Exact 400px height for mobile, flexible for desktop */}
              <div className="w-full h-[400px] shrink-0 lg:flex-1 lg:h-auto flex flex-col bg-dark-900 relative">
                <ChartWindow />
              </div>

              <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-dark-700 bg-dark-800">
                <OrderTerminal />
              </div>

              <div className="block lg:hidden w-full h-[350px] shrink-0 border-t border-dark-700 bg-dark-800">
                <PositionsTable />
              </div>

            </div>

            <div className="hidden lg:block h-56 w-full shrink-0 border-t border-dark-700 bg-dark-800">
              <PositionsTable />
            </div>
          </div>
        </TradingProvider>
      )}

      {authModalType && (
        <AuthModal
          initialType={authModalType}
          onClose={() => setAuthModalType(null)}
          onLoginSuccess={() => {
            setAuthModalType(null);
            setCurrentView('terminal');
          }}
        />
      )}
    </>
  );
}

export default App;