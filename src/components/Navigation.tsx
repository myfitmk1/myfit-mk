
import React from 'react';
import { View } from '../types';
import { VIEWS } from '../constants';
import { Radio, PauseCircle } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  favoritesCount: number;
  isRadioPlaying?: boolean;
  onToggleRadio?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, favoritesCount, isRadioPlaying, onToggleRadio }) => {
  return (
    <nav className="fixed md:static bottom-0 left-0 right-0 z-50 bg-[#161616] md:bg-[#121212] border-t border-[#333] md:border-t-0 md:border-r md:w-80 md:h-screen md:flex md:flex-col shadow-[0_-5px_15px_rgba(0,0,0,0.5)] md:shadow-none">
      
      {/* Desktop Sidebar Header */}
      <div className="hidden md:flex flex-col p-6 bg-[#161616] border-b border-[#333]">
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
                {/* Logo Image */}
                <div className="w-16 h-16 bg-gradient-to-br from-brand-700 to-brand-800 rounded-xl flex items-center justify-center text-accent border border-brand-600 shadow-lg shadow-black/40 flex-shrink-0 overflow-hidden">
                    {/* Fixed path for GitHub Pages: /myfit-mk/myfitmklogo.jpg */}
                    <img src="/myfit-mk/myfitmklogo.jpg" alt="MyFit MK" className="w-full h-full object-cover" />
                </div>
                
                {/* Title Block */}
                <div className="flex flex-col justify-center overflow-hidden">
                  <span className="text-5xl font-heading leading-[0.8] text-accent text-glow tracking-wide whitespace-nowrap">
                    MYFIT MK
                  </span>
                  <span className="text-sm font-heading text-white uppercase tracking-[0.15em] leading-tight ml-0.5 mt-1 whitespace-nowrap">
                    ВЛАДО СМИЛЕВСКИ
                  </span>
                </div>
            </div>

            {/* Motto Section */}
            <div className="pt-5 border-t border-[#333] flex flex-col gap-1">
                 <p className="text-sm font-heading text-white font-bold leading-none tracking-wider uppercase whitespace-nowrap">
                    ТВОЈ ПРЕДИЗВИК - ТВОЈА ПОБЕДА
                 </p>
                 <p className="text-sm font-heading text-white font-bold leading-none tracking-wider uppercase whitespace-nowrap">
                    ЈАК ДЕНЕС - ПОЈАК УТРЕ
                 </p>
            </div>

            {/* Desktop Radio Button */}
            {onToggleRadio && (
                <button 
                    onClick={onToggleRadio}
                    className={`mt-4 w-full py-3 rounded-lg border flex items-center justify-center gap-3 font-heading tracking-wide transition-all ${isRadioPlaying ? 'bg-accent border-accent text-black animate-pulse shadow-[0_0_15px_rgba(255,109,0,0.4)]' : 'bg-[#1a1a1a] border-[#333] text-brand-400 hover:bg-[#262626] hover:text-white hover:border-brand-500'}`}
                >
                    {isRadioPlaying ? <PauseCircle size={20} /> : <Radio size={20} />}
                    <span className="text-sm">{isRadioPlaying ? 'LIVE RADIO ON' : 'START RADIO'}</span>
                </button>
            )}
        </div>
      </div>

      <div className="flex justify-around md:flex-col md:justify-start md:p-6 md:space-y-4 h-20 md:h-auto overflow-x-auto md:overflow-visible no-scrollbar items-center md:items-stretch">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`
                group flex items-center justify-center md:justify-start flex-col md:flex-row w-full md:px-5 md:py-4 rounded-xl transition-all duration-200 min-w-[64px] md:min-w-0
                ${isActive 
                  ? 'bg-accent text-black shadow-[0_0_15px_rgba(255,109,0,0.3)] md:translate-x-2' 
                  : 'text-brand-400 hover:text-white hover:bg-[#262626]'
                }
              `}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                {view.id === 'exercises' && favoritesCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#161616] ${isActive ? 'bg-white' : 'bg-accent'}`}></span>
                )}
              </div>
              <span className={`text-[10px] md:text-lg font-heading tracking-wide md:ml-4 mt-1 md:mt-0 uppercase ${isActive ? 'font-bold' : 'font-medium'}`}>
                {view.label}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="hidden md:block mt-auto p-8 text-xs text-brand-500">
        <div className="pt-6 border-t border-[#333]">
            <p className="font-mono uppercase opacity-50">&copy; {new Date().getFullYear()} MyFit MK v2.0</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
