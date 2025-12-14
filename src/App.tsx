
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Planner from './components/Planner';
import Exercises from './components/Exercises';
import Stats from './components/Stats';
import CalendarView from './components/CalendarView';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import LicenseGate from './components/LicenseGate';
import AITrainer from './components/AITrainer';
import { View, AppData, Exercise, Routine, GalleryImage } from './types';
import { APP_PASSWORD } from './constants';
import { Lock, Radio, PauseCircle } from 'lucide-react';

const INITIAL_DATA: AppData = {
  userProfile: { name: '', level: 'Почетник', joinedDate: new Date().toISOString() },
  savedRoutines: [],
  favorites: [],
  scheduledWorkouts: {},
  workoutHistory: [],
  galleryImages: [],
  settings: { darkMode: true, soundNotifications: true, workoutReminders: false }
};

// Heart Dance UK - High Energy Workout Music (English)
const RADIO_STREAM_URL = "https://media-ssl.musicradio.com/HeartDance"; 

const App: React.FC = () => {
  const [hasValidLicense, setHasValidLicense] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState<View>('planner');
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  
  // Radio State
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Transient state
  const [currentRoutine, setCurrentRoutine] = useState<Exercise[]>([]);

  // Load Data & Security Protocols
  useEffect(() => {
    document.body.classList.add('dark');
    
    // 1. Prevent Right Click
    const handleContextMenu = (e: MouseEvent) => { 
        e.preventDefault(); 
    };

    // 2. Prevent Copying (Ctrl+C), but allow in inputs
    const handleCopy = (e: ClipboardEvent) => {
        const target = e.target as HTMLElement;
        // Allow copying if the user is typing in an Input, Textarea, or Code block (License ID)
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'CODE') {
            return;
        }
        e.preventDefault();
    };

    // 3. Prevent DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    const savedData = localStorage.getItem('myfit_data');
    const auth = sessionStorage.getItem('myfit_auth');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        parsed.settings = { ...parsed.settings, darkMode: true };
        setData({ ...INITIAL_DATA, ...parsed });
      } catch (e) {
        console.error("Error parsing data", e);
      }
    }
    
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    setTimeout(() => setLoading(false), 800);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  // Save Data
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('myfit_data', JSON.stringify(data));
    }
  }, [data, loading]);

  // Radio Logic
  useEffect(() => {
      if (!audioRef.current) {
          audioRef.current = new Audio(RADIO_STREAM_URL);
          audioRef.current.preload = "none";
          audioRef.current.onerror = (e) => {
              console.error("Radio Error:", e);
              setIsRadioPlaying(false);
              alert("Радиото моментално не е достапно. Проверете ја вашата интернет конекција.");
          };
      }

      if (isRadioPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => {
                  console.error("Radio playback failed:", error);
                  setIsRadioPlaying(false);
              });
          }
      } else {
          audioRef.current.pause();
      }
  }, [isRadioPlaying]);

  const toggleRadio = () => {
      vibrate();
      setIsRadioPlaying(!isRadioPlaying);
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(40);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has set a custom password, otherwise use default
    const currentPassword = localStorage.getItem('myfit_custom_password') || APP_PASSWORD;

    if (passwordInput === currentPassword) {
      vibrate();
      setIsAuthenticated(true);
      sessionStorage.setItem('myfit_auth', 'true');
      setPasswordError(false);
    } else {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
      vibrate();
      sessionStorage.removeItem('myfit_auth');
      localStorage.removeItem('myfit_license_key');
      setIsAuthenticated(false);
      setHasValidLicense(false);
      setPasswordInput('');
      setIsRadioPlaying(false);
      window.location.reload();
  };

  const toggleFavorite = (id: string) => {
    vibrate();
    setData(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id) 
        ? prev.favorites.filter(fid => fid !== id)
        : [...prev.favorites, id]
    }));
  };

  const addToRoutine = (exercise: Exercise) => {
    vibrate();
    if (!currentRoutine.some(e => e.id === exercise.id)) {
        setCurrentRoutine(prev => [...prev, exercise]);
    }
  };

  const saveRoutine = (name: string) => {
      vibrate();
      const newRoutine: Routine = {
          id: Date.now().toString(),
          name,
          exercises: currentRoutine,
          createdAt: new Date().toISOString()
      };
      setData(prev => ({
          ...prev,
          savedRoutines: [...prev.savedRoutines, newRoutine]
      }));
      setCurrentRoutine([]);
  };

  const scheduleWorkout = (date: string, routine: Routine) => {
      vibrate();
      const session = {
          id: Date.now().toString(),
          name: routine.name,
          date,
          exercises: routine.exercises,
          completed: false
      };
      setData(prev => {
          const existing = prev.scheduledWorkouts[date] || [];
          return {
              ...prev,
              scheduledWorkouts: {
                  ...prev.scheduledWorkouts,
                  [date]: [...existing, session]
              }
          };
      });
  };

  const removeScheduled = (date: string, index: number) => {
      vibrate();
      setData(prev => {
          const list = [...(prev.scheduledWorkouts[date] || [])];
          list.splice(index, 1);
          return {
              ...prev,
              scheduledWorkouts: { ...prev.scheduledWorkouts, [date]: list }
          };
      });
  };

  const handleAddImage = (img: GalleryImage) => {
      vibrate();
      setData(prev => ({
          ...prev,
          galleryImages: [img, ...prev.galleryImages]
      }));
  };

  const handleDeleteImage = (id: string) => {
      vibrate();
      setData(prev => ({
          ...prev,
          galleryImages: prev.galleryImages.filter(img => img.id !== id)
      }));
  };

  const handleViewChange = (view: View) => {
      vibrate();
      setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'planner':
        return <Planner 
            routines={data.savedRoutines}
            currentRoutine={currentRoutine}
            onSaveRoutine={saveRoutine}
            onRemoveFromRoutine={(idx) => {
                vibrate();
                setCurrentRoutine(prev => prev.filter((_, i) => i !== idx));
            }}
            onDeleteRoutine={(id) => {
                vibrate();
                setData(p => ({...p, savedRoutines: p.savedRoutines.filter(r => r.id !== id)}));
            }}
            onLoadRoutine={(r) => {
                vibrate();
                setCurrentRoutine(r.exercises);
            }}
            onScheduleWorkout={(date, routineName) => {
                const tempRoutine: Routine = {
                    id: 'temp',
                    name: routineName,
                    exercises: currentRoutine,
                    createdAt: new Date().toISOString()
                };
                scheduleWorkout(date, tempRoutine);
                setCurrentRoutine([]);
            }}
        />;
      case 'exercises':
        return <Exercises 
            userLevel={data.userProfile.level}
            favorites={data.favorites}
            onToggleFavorite={toggleFavorite}
            onAddToRoutine={addToRoutine}
        />;
      case 'ai-trainer':
        return <AITrainer userProfile={data.userProfile} />;
      case 'calendar':
        return <CalendarView 
            scheduledWorkouts={data.scheduledWorkouts}
            routines={data.savedRoutines}
            onScheduleWorkout={scheduleWorkout}
            onRemoveScheduled={removeScheduled}
        />;
      case 'stats':
        return <Stats history={data.workoutHistory} />;
      case 'gallery':
        return <Gallery 
            images={data.galleryImages || []} 
            onAddImage={handleAddImage} 
            onDeleteImage={handleDeleteImage} 
        />;
      case 'settings':
        return <Settings 
            settings={data.settings}
            profile={data.userProfile}
            onUpdateSettings={(s) => { vibrate(); setData(p => ({...p, settings: s})); }}
            onUpdateProfile={(prof) => setData(p => ({...p, userProfile: prof}))}
            onResetData={() => {
                if(confirm("Дали сте сигурни? Ова ќе ги избрише сите ваши податоци.")) {
                    localStorage.removeItem('myfit_data');
                    window.location.reload();
                }
            }}
            onLogout={handleLogout}
        />;
      default:
        return <Planner 
            routines={data.savedRoutines} 
            currentRoutine={currentRoutine}
            onSaveRoutine={saveRoutine}
            onRemoveFromRoutine={() => {}} 
            onDeleteRoutine={() => {}}
            onLoadRoutine={() => {}}
            onScheduleWorkout={() => {}}
        />;
    }
  };

  if (loading) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-brand-900 text-white">
              <div className="w-16 h-16 border-4 border-brand-700 border-t-accent rounded-full animate-spin mb-4"></div>
              <h1 className="text-3xl font-heading tracking-widest text-white">MYFIT MK</h1>
          </div>
      );
  }

  if (!hasValidLicense) {
      return <LicenseGate onUnlock={() => setHasValidLicense(true)} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-brand-900 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div className="metal-card p-10 rounded-2xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_15px_rgba(255,109,0,0.8)]"></div>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-brand-800 rounded-full flex items-center justify-center shadow-inner border border-brand-600">
               <Lock className="w-10 h-10 text-accent" />
            </div>
          </div>
          
          <h2 className="text-5xl font-heading text-center text-white mb-1 tracking-wider text-glow">MYFIT MK</h2>
          <p className="text-center text-brand-400 mb-10 font-subtitle uppercase tracking-widest text-xs">Владо Смилевски</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-4 text-center text-2xl font-heading tracking-[0.3em] rounded-lg border-b-2 border-brand-600 bg-brand-800/50 text-white focus:border-accent focus:bg-brand-800 outline-none transition-all placeholder-brand-600"
                  placeholder="••••••••"
                  autoFocus
                />
            </div>
            {passwordError && <p className="text-red-500 text-center text-sm font-bold font-subtitle animate-pulse uppercase">Погрешна лозинка</p>}
            <button type="submit" className="w-full py-4 bg-accent hover:bg-accent-hover text-black font-heading text-2xl tracking-wide rounded-lg transition-all shadow-lg shadow-accent/20 active:scale-95 btn-click-effect">
              ОТКЛУЧИ
            </button>
          </form>
          <p className="text-center mt-8 text-[10px] text-brand-500 font-mono uppercase">Систем заштитет</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-900 text-zinc-100 font-sans transition-colors duration-300">
      
      <header className="md:hidden bg-brand-800 border-b border-brand-700 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center text-accent border border-brand-600 shadow-md flex-shrink-0 overflow-hidden">
                {/* Fixed Logo Path: includes subfolder /myfit-mk/ */}
                <img src="/myfit-mk/myfitmklogo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start justify-center flex-1 overflow-hidden">
                <h1 className="text-xl font-heading text-white leading-none tracking-wide truncate w-full text-glow">MYFIT MK</h1>
                <p className="text-[10px] font-bold font-subtitle text-accent/80 leading-tight mt-0.5 truncate w-full uppercase">Владо Смилевски</p>
            </div>
            <button 
                onClick={toggleRadio}
                className={`p-2 rounded-full border transition-all ${isRadioPlaying ? 'bg-accent border-accent text-black animate-pulse shadow-[0_0_10px_rgba(255,109,0,0.5)]' : 'bg-brand-700 border-brand-600 text-brand-400'}`}
            >
                {isRadioPlaying ? <PauseCircle size={22} /> : <Radio size={22} />}
            </button>
         </div>
      </header>

      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        favoritesCount={data.favorites.length}
        isRadioPlaying={isRadioPlaying}
        onToggleRadio={toggleRadio}
      />
      
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto pb-24 md:pb-8 h-[calc(100vh-60px)] md:h-screen bg-brand-900 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div className="max-w-7xl mx-auto h-full">
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
