import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTabTitle?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFramed, setIsFramed] = useState(true);
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fce7f3] text-purple-950 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 transition-colors">
      {/* Top Device Bar for Desktop Preview */}
      <aside aria-label="Device Preview Controls" className="w-full max-w-md hidden sm:flex items-center justify-between px-3 py-2 mb-2 text-xs text-purple-800 bg-white/80 backdrop-blur rounded-xl border border-pink-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-pink-500" />
          <span className="font-semibold text-purple-950">RecipeBook Mobile</span>
          <span className="text-pink-300">·</span>
          <span>iOS / Android Touch UI</span>
        </div>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-purple-700 hover:bg-pink-100/80 hover:text-purple-950 font-medium transition-colors"
          title={isFramed ? "Expand to Full Browser View" : "View inside Phone Frame"}
        >
          {isFramed ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full View</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </aside>

      {/* Main Container - Either Phone Frame or Full-Width Responsive */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isFramed
            ? 'sm:max-w-[430px] sm:h-[890px] sm:rounded-[46px] sm:border-[8px] sm:border-purple-950 sm:shadow-2xl sm:overflow-hidden bg-[#fdf2f8] sm:ring-1 sm:ring-pink-300/40'
            : 'max-w-4xl min-h-screen sm:min-h-[92vh] sm:rounded-3xl sm:border sm:border-pink-200 bg-[#fdf2f8] shadow-xl overflow-hidden'
        }`}
      >
        {/* Native-style Mobile Status Bar */}
        <header className="sticky top-0 z-40 bg-purple-950 text-pink-100 flex items-center justify-between px-7 pt-3 pb-2 text-[12px] font-semibold tracking-tight select-none">
          <span>{currentTime}</span>

          {/* Dynamic Island / Camera Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2.5 space-x-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-purple-950 border border-purple-900"></div>
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-pink-200" />
            <span className="text-[10px] tracking-widest uppercase text-pink-300">5G</span>
            <Battery className="w-4 h-4 text-pink-400 fill-pink-400" />
          </div>
        </header>

        {/* Inner App Content */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-[#fdf2f8]">
          {children}
        </div>

        {/* Native Home Indicator Bar with Creator Attribution */}
        <div className="w-full bg-[#fdf2f8] flex flex-col items-center justify-center py-1.5 select-none shrink-0 border-t border-pink-100 gap-1">
          <div className="w-28 h-1 bg-pink-300 rounded-full"></div>
          <span className="text-[10px] text-purple-700/70 font-semibold tracking-wide">
            App created by Tehzeeb
          </span>
        </div>
      </div>
    </div>
  );
};
