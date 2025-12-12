import React, { useState } from 'react';
import { Routine, Exercise } from '../types';
import { Save, Trash2, Dumbbell, Plus, CalendarPlus, ChevronRight, Clock, Activity } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

interface PlannerProps {
  routines: Routine[];
  currentRoutine: Exercise[];
  onSaveRoutine: (name: string) => void;
  onRemoveFromRoutine: (index: number) => void;
  onDeleteRoutine: (id: string) => void;
  onLoadRoutine: (routine: Routine) => void;
  onScheduleWorkout: (date: string, routineName: string) => void;
}

const Planner: React.FC<PlannerProps> = ({ 
  routines, 
  currentRoutine, 
  onSaveRoutine, 
  onRemoveFromRoutine, 
  onDeleteRoutine,
  onLoadRoutine,
  onScheduleWorkout
}) => {
  const [routineName, setRoutineName] = useState('');
  const [scheduleDate, setScheduleDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSaveTemplate = () => {
    if (!routineName.trim()) {
        alert("Внесете име за шаблонот.");
        return;
    }
    onSaveRoutine(routineName);
    setRoutineName('');
  };

  const handleQuickSchedule = () => {
      if (currentRoutine.length === 0) return;
      const nameToUse = routineName.trim() || "Прилагоден Тренинг";
      onScheduleWorkout(scheduleDate, nameToUse);
      setRoutineName('');
      alert(`Тренингот е успешно закажан за ${new Date(scheduleDate).toLocaleDateString('mk-MK')}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h2 className="text-5xl font-heading text-white tracking-wide text-glow">ПЛАНЕР</h2>
        <p className="text-brand-400 font-subtitle uppercase tracking-widest text-sm">ДИЗАЈНИРАЈ ГО СВОЈОТ УСПЕХ</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="metal-card rounded-xl p-6 relative overflow-hidden group">
                {/* Decorative Accent Line */}
                <div className="absolute top-0 left-0 w-2 h-full bg-accent opacity-80"></div>
                
                <div className="flex justify-between items-center mb-6 pl-4">
                    <h3 className="text-2xl font-heading text-white flex items-center gap-3 tracking-wide">
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/50 border border-brand-600 text-accent shadow-inner">
                            <Dumbbell size={20} />
                        </span>
                        АКТИВЕН ТРЕНИНГ
                    </h3>
                    <div className="text-lg font-heading text-accent bg-black/40 px-4 py-1 rounded border border-brand-700">
                        {currentRoutine.length} <span className="text-brand-500 text-sm ml-1">ВЕЖБИ</span>
                    </div>
                </div>

                <div className="min-h-[200px] bg-[#121212] rounded-xl border border-[#333] mb-6 p-2 space-y-2 shadow-inner">
                    {currentRoutine.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-brand-500 py-10">
                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333] shadow-md">
                                <PlusIconPlaceholder />
                            </div>
                            <p className="font-subtitle font-bold text-sm uppercase">ПРАЗНА ЛИСТА</p>
                            <p className="text-xs font-mono opacity-60">ДОДАЈ ВЕЖБИ ОД БИБЛИОТЕКАТА</p>
                        </div>
                    ) : (
                        currentRoutine.map((ex, idx) => (
                            <div key={`${ex.id}-${idx}`} className="flex justify-between items-center bg-[#1E1E1E] p-4 rounded-lg border-l-4 border-l-brand-600 hover:border-l-accent border-y border-r border-[#333] shadow-md animate-in slide-in-from-left-2 group transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-black/40 rounded-md border border-[#333] text-brand-300">
                                        {CATEGORY_ICONS[ex.category]}
                                    </div>
                                    <div>
                                        <div className="font-heading text-xl text-white tracking-wide">{ex.name}</div>
                                        <div className="text-xs font-mono text-accent flex items-center gap-3 mt-1">
                                            <span className="bg-accent/10 px-2 py-0.5 rounded">{ex.sets} СЕТОВИ</span>
                                            <span className="bg-accent/10 px-2 py-0.5 rounded">{ex.reps} ПОВТ.</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemoveFromRoutine(idx)}
                                    className="text-brand-500 hover:text-red-500 p-3 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex flex-col gap-4 pl-4">
                    <input 
                        type="text" 
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        placeholder="ИМЕ НА ТРЕНИНГОТ..."
                        className="w-full px-5 py-4 rounded-lg border border-[#333] bg-black text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-subtitle font-bold text-sm placeholder-brand-600 uppercase tracking-wider"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Direct Schedule - Primary Action */}
                        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                            <label className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">1. ИЗБЕРИ ДАТУМ</label>
                            <input 
                                type="date" 
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full p-2 mb-4 rounded bg-[#121212] border border-[#404040] text-white text-sm outline-none focus:border-accent font-mono"
                            />
                            <button 
                                onClick={handleQuickSchedule}
                                disabled={currentRoutine.length === 0}
                                className="w-full py-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-black font-heading text-xl tracking-wide rounded shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CalendarPlus size={20} /> ЗАКАЖИ
                            </button>
                        </div>

                        {/* Save Template - Secondary Action */}
                        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                            <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 block">2. ЗАЧУВАЈ ШАБЛОН</label>
                            <p className="text-[10px] text-brand-500 mb-6 h-[28px] leading-tight">ЗАЧУВАЈ ГО ОВОЈ ПЛАН ВО БИБЛИОТЕКАТА ЗА ИДНИНА.</p>
                            <button 
                                onClick={handleSaveTemplate}
                                disabled={currentRoutine.length === 0}
                                className="w-full py-4 bg-[#262626] border border-[#404040] hover:bg-[#333] hover:text-white text-brand-300 font-heading text-xl tracking-wide rounded transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> ЗАЧУВАЈ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="metal-card rounded-xl p-6 h-full flex flex-col border-l-4 border-l-brand-600">
                 <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2 tracking-wide border-b border-[#333] pb-4">
                    <Activity size={24} className="text-accent" /> БИБЛИОТЕКА
                 </h3>

                 {routines.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center p-4 opacity-50">
                         <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333]">
                             <Save size={24} className="text-brand-500" />
                         </div>
                         <p className="font-subtitle text-xs text-brand-400 uppercase tracking-wide">НЕМА ЗАЧУВАНИ ПЛАНОВИ</p>
                     </div>
                 ) : (
                     <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                         {routines.map(routine => (
                             <div key={routine.id} className="group bg-[#161616] p-4 rounded border border-[#333] hover:border-accent transition-all cursor-pointer relative overflow-hidden shadow-md">
                                 <div className="flex justify-between items-start mb-3 relative z-10">
                                     <div onClick={() => onLoadRoutine(routine)} className="flex-1">
                                         <h4 className="font-heading text-xl text-white group-hover:text-accent transition-colors tracking-wide">{routine.name}</h4>
                                         <p className="text-[10px] text-brand-500 flex items-center gap-1 mt-1 font-mono">
                                            <Clock size={10} /> {new Date(routine.createdAt).toLocaleDateString('mk-MK')}
                                         </p>
                                     </div>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteRoutine(routine.id); }}
                                        className="text-brand-600 hover:text-red-500 transition-colors p-2"
                                     >
                                        <Trash2 size={18} />
                                     </button>
                                 </div>
                                 
                                 <div onClick={() => onLoadRoutine(routine)} className="flex justify-between items-end">
                                     <div className="flex items-center gap-2">
                                         <span className="text-xs font-bold bg-[#262626] px-2 py-1 rounded text-brand-300 border border-[#404040]">
                                             {routine.exercises.length} ВЕЖБИ
                                         </span>
                                     </div>
                                     <div className="flex items-center text-xs text-accent font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                         ВЧИТАЈ <ChevronRight size={14} />
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
          </div>
      </div>
    </div>
  );
};

const PlusIconPlaceholder = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="#404040" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default Planner;