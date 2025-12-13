
import React, { useState, useMemo } from 'react';
import { EXERCISE_DATABASE, CATEGORY_ICONS } from '../constants';
import { Exercise, ExerciseLevel } from '../types';
import { Search, Star, Plus, Info, Check, Filter } from 'lucide-react';

interface ExercisesProps {
  userLevel: ExerciseLevel;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToRoutine: (exercise: Exercise) => void;
}

const Exercises: React.FC<ExercisesProps> = ({ userLevel, favorites, onToggleFavorite, onAddToRoutine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const allExercises = useMemo(() => {
    const exercises: Exercise[] = [];
    Object.keys(EXERCISE_DATABASE).forEach(category => {
      EXERCISE_DATABASE[category].forEach(ex => {
        exercises.push({ ...ex, category });
      });
    });
    return exercises;
  }, []);

  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ex.englishName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || ex.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [allExercises, searchTerm, selectedCategory, selectedLevel]);

  const recommendedExercises = useMemo(() => {
    if (searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all') return [];
    return allExercises.filter(ex => ex.level === userLevel).slice(0, 3);
  }, [allExercises, userLevel, searchTerm, selectedCategory, selectedLevel]);

  const categories = Object.keys(EXERCISE_DATABASE);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <h2 className="text-5xl font-heading text-white tracking-wide flex items-center gap-3 text-glow">
                ВЕЖБИ <span className="text-accent text-3xl align-top bg-accent/10 px-3 py-1 rounded border border-accent/20 font-mono">{filteredExercises.length}</span>
             </h2>
             <p className="text-brand-400 font-subtitle font-bold uppercase tracking-widest text-xs mt-1">КАТАЛОГ ЗА СИТЕ МУСКУЛНИ ГРУПИ</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="ПРЕБАРАЈ..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 rounded-lg border border-[#333] bg-[#1a1a1a] w-full text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none font-subtitle font-bold text-sm tracking-wide uppercase placeholder-brand-600 shadow-inner"
                />
             </div>
             <div className="flex gap-2">
                <div className="relative">
                    <select 
                        value={selectedLevel} 
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-4 rounded-lg border border-[#333] bg-[#1a1a1a] text-brand-300 font-bold text-xs uppercase outline-none cursor-pointer hover:border-brand-500 focus:border-accent w-full sm:w-auto"
                    >
                        <option value="all">НИВО</option>
                        <option value="Почетник">ПОЧЕТНИК</option>
                        <option value="Среден">СРЕДЕН</option>
                        <option value="Напреден">НАПРЕДЕН</option>
                    </select>
                     <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none" />
                </div>
             </div>
          </div>
        </header>

        {/* Categories Grid - Wrapped to show all */}
        <div className="flex flex-wrap gap-2">
           <button 
               onClick={() => setSelectedCategory('all')}
               className={`px-4 py-2 rounded text-xs font-heading tracking-wider transition-all border ${
                 selectedCategory === 'all'
                 ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                 : 'bg-[#1a1a1a] text-brand-400 border-[#333] hover:border-brand-500 hover:text-white'
               }`}
             >
               СИТЕ
           </button>
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setSelectedCategory(cat === selectedCategory ? 'all' : cat)}
               className={`px-4 py-2 rounded text-xs font-heading tracking-wider transition-all border flex items-center gap-2 ${
                 selectedCategory === cat 
                 ? 'bg-accent text-black border-accent shadow-[0_0_10px_rgba(255,109,0,0.4)]' 
                 : 'bg-[#1a1a1a] text-brand-400 border-[#333] hover:border-brand-500 hover:text-white'
               }`}
             >
               <span>{CATEGORY_ICONS[cat]}</span>
               <span>{cat.toUpperCase()}</span>
             </button>
           ))}
        </div>
      </div>

      {recommendedExercises.length > 0 && (
        <div className="metal-card p-6 rounded-xl border-t-4 border-t-accent">
           <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent text-black px-3 py-1 text-sm font-heading tracking-wide shadow-sm transform -skew-x-12">ПРЕПОРАЧАНО</span>
              <span className="text-brand-300 text-xs font-subtitle font-bold uppercase tracking-widest">ЗА НИВО: {userLevel.toUpperCase()}</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedExercises.map(ex => (
                <ExerciseCard 
                  key={`rec-${ex.id}`} 
                  exercise={ex} 
                  isFavorite={favorites.includes(ex.id)}
                  onToggleFavorite={() => onToggleFavorite(ex.id)}
                  onAddToRoutine={() => onAddToRoutine(ex)}
                />
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExercises.map(ex => (
          <ExerciseCard 
            key={ex.id} 
            exercise={ex} 
            isFavorite={favorites.includes(ex.id)}
            onToggleFavorite={() => onToggleFavorite(ex.id)}
            onAddToRoutine={() => onAddToRoutine(ex)}
          />
        ))}
        {filteredExercises.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-brand-600">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-[#333]">
                <Search size={40} className="opacity-50" />
            </div>
            <p className="font-heading text-2xl tracking-wide">НЕМА ПРОНАЈДЕНО ВЕЖБИ</p>
            <p className="font-mono text-xs mt-2 uppercase">ОБИДЕТЕ СЕ СО ДРУГИ ФИЛТРИ</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExerciseCard: React.FC<{
  exercise: Exercise;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToRoutine: () => void;
}> = ({ exercise, isFavorite, onToggleFavorite, onAddToRoutine }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
      onAddToRoutine();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
  };

  // Color logic for levels
  const levelBadge = {
    'Почетник': 'border-green-500/50 text-green-400',
    'Среден': 'border-yellow-500/50 text-yellow-400',
    'Напреден': 'border-red-500/50 text-red-400'
  }[exercise.level];

  return (
    <div className="group metal-card rounded-lg overflow-hidden hover:shadow-[0_5px_20px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-[#333] hover:border-brand-500">
      <div className="p-5 flex-1 relative">
        <div className="absolute top-0 right-0 p-4 z-10">
            <button onClick={onToggleFavorite} className="text-brand-600 hover:text-accent transition-colors transform hover:scale-110">
                <Star size={22} fill={isFavorite ? "#FF6D00" : "none"} className={isFavorite ? "text-accent drop-shadow-[0_0_8px_rgba(255,109,0,0.5)]" : ""} />
            </button>
        </div>

        <div className="flex flex-col gap-4 mb-4">
           <div className="w-14 h-14 rounded bg-[#121212] border border-[#333] flex items-center justify-center text-3xl shadow-inner text-brand-400">
              {CATEGORY_ICONS[exercise.category] || '💪'}
           </div>
           <div>
              <h3 className="font-heading text-2xl text-white leading-none tracking-wide mb-1 group-hover:text-accent transition-colors">{exercise.name}</h3>
              <p className="text-[10px] text-brand-500 font-bold font-subtitle uppercase tracking-wider">{exercise.englishName}</p>
           </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
           <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded bg-black/40 border ${levelBadge} uppercase`}>{exercise.level}</span>
           <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-black/40 text-brand-300 border border-brand-800 uppercase">
             {exercise.sets} x {exercise.reps}
           </span>
        </div>

        <p className="text-sm text-brand-300 line-clamp-2 mb-4 leading-relaxed font-medium">
           {exercise.description}
        </p>
      </div>

      <div className="px-5 pb-5 mt-auto space-y-3">
        <div className="flex gap-2">
           <button 
             onClick={handleAdd}
             disabled={added}
             className={`flex-1 py-3 rounded font-heading text-xl tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 ${
                 added 
                 ? 'bg-green-600 text-white' 
                 : 'bg-accent hover:bg-accent-hover text-black shadow-[0_0_10px_rgba(255,109,0,0.2)] hover:shadow-[0_0_15px_rgba(255,109,0,0.4)]'
             }`}
           >
             {added ? <Check size={20} /> : <Plus size={20} />}
             {added ? 'ДОДАДЕНО' : 'ДОДАЈ'}
           </button>
           <button 
             onClick={() => setShowDetails(!showDetails)}
             className={`p-3 rounded border font-bold transition-colors ${
                 showDetails 
                 ? 'bg-brand-700 border-brand-500 text-white' 
                 : 'bg-[#1a1a1a] border-[#333] text-brand-400 hover:text-white hover:bg-[#262626]'
             }`}
           >
             <Info size={22} />
           </button>
        </div>

        {showDetails && (
            <div className="animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-[#121212] rounded border border-[#333] space-y-4 shadow-inner">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#1a1a1a] p-2 rounded border border-[#333]">
                            <span className="block text-brand-500 text-[10px] uppercase font-bold mb-1">Мускули</span>
                            <span className="font-bold text-brand-200">{exercise.muscles}</span>
                        </div>
                        <div className="bg-[#1a1a1a] p-2 rounded border border-[#333]">
                            <span className="block text-brand-500 text-[10px] uppercase font-bold mb-1">Време</span>
                            <span className="font-bold text-brand-200">{exercise.time}</span>
                        </div>
                    </div>
                    
                    <div className="relative pt-2">
                        <div className="absolute top-2 left-0 bottom-0 w-0.5 bg-accent"></div>
                        <div className="pl-3">
                            <p className="text-[10px] uppercase font-bold text-accent mb-1 tracking-wider">ТЕХНИКА:</p>
                            <p className="text-xs text-brand-300 leading-relaxed">{exercise.explanation}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Exercises;
