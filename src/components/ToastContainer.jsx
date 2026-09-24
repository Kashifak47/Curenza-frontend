// src/components/ToastContainer.jsx
import React from 'react';
import { useTrading } from '../context/TradingContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTrading();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-0 lg:top-6 lg:right-6 z-50 flex flex-col gap-3 w-full px-4 lg:px-0 lg:w-96 pointer-events-none">
      {toasts.map((toast) => {
        
        let iconBg = "bg-blue-500/10";
        let iconColor = "text-blue-500";
        let progressColor = "bg-blue-500";
        let Icon = Info;

        if (toast.type === "success") {
          iconBg = "bg-emerald-500/10";
          iconColor = "text-emerald-500";
          progressColor = "bg-emerald-500";
          Icon = CheckCircle;
        } else if (toast.type === "error") {
          iconBg = "bg-rose-500/10";
          iconColor = "text-rose-500";
          progressColor = "bg-rose-500";
          Icon = XCircle;
        }

        return (
          <div 
            key={toast.id} 
            className="relative overflow-hidden pointer-events-auto flex items-start gap-4 p-4 rounded-xl border border-dark-700 bg-dark-900/90 shadow-2xl shadow-black/80 backdrop-blur-md animate-toast-mobile lg:animate-toast-desktop group"
          >
            {/* Glowing Icon Container */}
            <div className={`p-2 rounded-full shrink-0 ${iconBg}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-white text-sm font-bold tracking-wide">{toast.title}</h4>
              <p className="text-gray-400 text-xs mt-1 font-sans leading-relaxed">
                {toast.message}
              </p>
            </div>
            
            {/* Close Button (Fades in slightly on hover for desktop) */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-600 hover:text-white transition-colors p-1 shrink-0 lg:opacity-50 lg:group-hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated Progress Bar at the bottom */}
            <div 
              className={`absolute bottom-0 left-0 h-1 ${progressColor} animate-progress`} 
            />
          </div>
        );
      })}
    </div>
  );
};