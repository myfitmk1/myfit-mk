import React, { useState } from 'react';
import { WorkoutSession, Routine } from '../types';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, X, CheckCircle2, ChevronDown, Dumbbell } from 'lucide-react';

interface CalendarViewProps {
  scheduledWorkouts: Record<string, WorkoutSession[]>;
  routines: Routine[];
  onScheduleWorkout: (date: string, routine: Routine) => void;
  onRemoveScheduled: (date: string, index: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
    scheduledWorkouts, 
    routines, 
    onScheduleWorkout,
    onRemoveScheduled 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["ЈАНУАРИ", "ФЕВРУАРИ", "МАРТ", "АПРИЛ", "МАЈ", "ЈУНИ", "ЈУЛИ", "АВГУСТ", "СЕПТЕМВРИ", "ОКТОМВРИ", "НОЕМВРИ", "ДЕКЕМВРИ"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
      let day = new Date(year, month, 1).getDay();
      return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const handleDateClick = (dateStr: string) => {
      setSelectedDate(dateStr);
      setExpandedWorkoutIndex(null); // Reset expansion when opening new date
      setIsModalOpen(true);
  };

  const handleQuickAdd = (routine: Routine) => {
      if (selectedDate) {
          onScheduleWorkout(selectedDate, routine);
      }
  };

  const renderCalendarDays = () => {
      const days = [];
      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-24 bg-[#1a1a1a] border border-[#262626] opacity-50 rounded-lg"></div>);
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
          const dateStr = new Date(year, month, i + 1).toISOString().split('T')[0];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          const workouts = scheduledWorkouts[dateStr] || [];
          const hasWorkouts = workouts.length > 0;
          
          days.push(
              <div 
                key={i} 
                onClick={() => handleDateClick(dateStr)}
                className={`h-24 border rounded-lg p-2 cursor-pointer transition-all relative group flex flex-col justify-between
                    ${isToday 
                        ? 'bg-[#1E1E1E] border-accent/60 shadow-[0_0_10px_rgba(255,109,0,0.2)]' 
                        : 'bg-[#121212] border-[#333] hover:border-brand-500 hover:bg-[#1a1a1a]'
                    }
                `}
              >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-mono font-bold w-6 h-6 flex items-center justify-center rounded-sm ${isToday ? 'bg-accent text-black' : 'text-brand-400 group-hover:text-white'}`}>
                        {i}
                    </span>
                    {hasWorkouts && (
                        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_rgba(255,109,0,0.8)] animate-pulse"></span>
                    )}
                  </div>
                  
                  <div className="space-y-1 overflow-hidden mt-1">
                      {workouts.slice(0, 2).map((w, idx) => (
                          <div key={idx} className="text-[9px] font-bold font-subtitle uppercase bg-[#262626] text-white px-1.5 py-0.5 rounded truncate border border-[#404040]">
                              {w.name}
                          </div>
                      ))}
                      {workouts.length > 2 && (
                          <div className="text-[9px] text-brand-500 pl-1 font-mono">+ {workouts.length - 2}</div>
                      )}
                  </div>

                  {/* Hover Plus Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[1px] rounded-lg z-10">
                        <div className="bg-accent text-black p-2 rounded shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                  </div>
              </div>
          );
      }
      return days;
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-5xl font-heading text-white tracking-wide text-glow">КАЛЕНДАР</h2>
                <p className="text-brand-400 font-subtitle uppercase tracking-widest text-sm">РАСПОРЕД НА ТВОИТЕ БИТКИ</p>
            </div>
            <div className="flex items-center gap-4 bg-[#1a1a1a] p-2 rounded border border-[#333]">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-[#262626] rounded text-white transition-colors"><ChevronLeft size={24} /></button>
                <span className="font-heading text-2xl w-48 text-center text-white tracking-wider">{monthNames[month]} <span className="text-accent">{year}</span></span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-[#262626] rounded text-white transition-colors"><ChevronRight size={24} /></button>
            </div>
        </header>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold font-mono text-brand-500 text-xs uppercase tracking-widest">
            <div>Пон</div><div>Вто</div><div>Сре</div><div>Чет</div><div>Пет</div><div>Саб</div><div>Нед</div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto pb-20 md:pb-4 pr-1">
            {renderCalendarDays()}
        </div>

        {isModalOpen && selectedDate && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="metal-card w-full max-w-lg rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#333] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                    
                    {/* Modal Header */}
                    <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#1E1E1E]">
                        <div>
                            <h3 className="text-3xl font-heading text-white flex items-center gap-2 tracking-wide">
                                <Calendar className="text-accent" size={28} />
                                {new Date(selectedDate).toLocaleDateString('mk-MK', { day: 'numeric', month: 'long' }).toUpperCase()}
                            </h3>
                            <p className="text-xs text-brand-400 mt-1 font-bold font-subtitle uppercase tracking-widest">ДНЕВЕН ПЛАН</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 bg-[#262626] hover:bg-accent hover:text-black rounded transition-colors text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto space-y-8 flex-1 bg-[#121212]">
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                    <Dumbbell size={14} /> ЗАКАЖАНИ СЕСИИ
                                </h4>
                                <span className="text-xs bg-accent text-black px-2 py-0.5 rounded font-bold font-mono">
                                    {(scheduledWorkouts[selectedDate] || []).length}
                                </span>
                            </div>

                            {(scheduledWorkouts[selectedDate] || []).length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#262626] rounded-xl bg-[#161616] text-brand-500 text-sm">
                                    <span className="mb-2 text-2xl grayscale opacity-50">💤</span>
                                    <span className="uppercase font-bold tracking-wide">ДЕН ЗА ОДМОР?</span>
                                    <span className="text-[10px] mt-1 font-mono opacity-60">ИЛИ ИЗБЕРИ ШАБЛОН ПОДОЛУ</span>
                                </div>
                            ) : (
                                (scheduledWorkouts[selectedDate] || []).map((w, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`
                                            transition-all duration-300 border rounded-lg overflow-hidden
                                            ${expandedWorkoutIndex === idx 
                                                ? 'bg-[#1E1E1E] border-accent shadow-lg' 
                                                : 'bg-[#1a1a1a] border-[#333] hover:border-brand-500'
                                            }
                                        `}
                                    >
                                        <div 
                                            onClick={() => setExpandedWorkoutIndex(expandedWorkoutIndex === idx ? null : idx)}
                                            className="flex justify-between items-center p-4 cursor-pointer select-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors border ${expandedWorkoutIndex === idx ? 'bg-accent text-black border-accent' : 'bg-[#121212] text-brand-500 border-[#333]'}`}>
                                                    <CheckCircle2 size={20} className={expandedWorkoutIndex === idx ? "fill-black text-white" : ""} />
                                                </div>
                                                <div>
                                                    <span className="block font-heading text-xl text-white tracking-wide">{w.name}</span>
                                                    <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="text-accent">{w.exercises.length} ВЕЖБИ</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveScheduled(selectedDate, idx);
                                                    }} 
                                                    className="p-2 text-brand-600 hover:text-red-500 rounded transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className={`p-1 transition-transform duration-300 ${expandedWorkoutIndex === idx ? 'rotate-180 text-white' : 'text-brand-500'}`}>
                                                    <ChevronDown size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        {expandedWorkoutIndex === idx && (
                                            <div className="bg-[#161616] border-t border-[#333] animate-in slide-in-from-top-2 duration-200">
                                                <div className="p-4 space-y-2">
                                                    {w.exercises.map((ex, i) => (
                                                        <div key={i} className="flex justify-between items-center p-3 bg-[#121212] rounded border border-[#262626] group">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-mono text-brand-600 w-4">{i + 1}.</span>
                                                                <span className="text-sm font-bold font-subtitle text-white uppercase">{ex.name}</span>
                                                            </div>
                                                            <div className="text-xs font-mono font-bold bg-[#1a1a1a] px-2 py-1 rounded border border-[#333] text-brand-300">
                                                                {ex.sets} x {ex.reps}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-[#333]">
                            <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">ДОДАЈ БРЗО ОД БИБЛИОТЕКА</h4>
                            {routines.length === 0 ? (
                                <p className="text-xs text-brand-600 font-mono italic bg-[#161616] p-4 rounded text-center border border-[#262626]">НЕМА ЗАЧУВАНО ШАБЛОНИ</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {routines.map(routine => (
                                        <button 
                                            key={routine.id}
                                            onClick={() => handleQuickAdd(routine)}
                                            className="flex items-center justify-between p-3 rounded bg-[#161616] border border-[#333] hover:border-accent hover:bg-[#1a1a1a] transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-[#121212] flex items-center justify-center text-brand-500 group-hover:bg-accent group-hover:text-black transition-colors border border-[#262626]">
                                                    <span className="text-xs font-mono font-bold">{routine.exercises.length}</span>
                                                </div>
                                                <span className="text-sm font-heading tracking-wide text-white group-hover:text-accent transition-colors">
                                                    {routine.name}
                                                </span>
                                            </div>
                                            <Plus size={18} className="text-brand-600 group-hover:text-accent transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-4 bg-[#1E1E1E] border-t border-[#333]">
                        <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-white text-black font-heading text-xl tracking-wide rounded hover:bg-brand-200 transition-all active:scale-[0.99] shadow-lg">
                            ЗАТВОРИ
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default CalendarView;