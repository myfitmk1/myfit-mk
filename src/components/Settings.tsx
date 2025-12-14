
import React, { useState, useEffect } from 'react';
import { AppSettings, UserProfile, ExerciseLevel } from '../types';
import { Moon, Bell, Download, Trash2, User, ChevronRight, Shield, Share2, Phone, Mail, MessageSquare, Instagram, Smartphone, LogOut, Sparkles, Key } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  profile: UserProfile;
  onUpdateSettings: (s: AppSettings) => void;
  onUpdateProfile: (p: UserProfile) => void;
  onResetData: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, profile, onUpdateSettings, onUpdateProfile, onResetData, onLogout }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isDeviceIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isDeviceIOS);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };
  
  const toggleSetting = (key: keyof AppSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
    if (key === 'darkMode') {
        document.body.classList.toggle('dark');
    }
  };

  const handleExport = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "myfit_mk_backup.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleChangePassword = () => {
      if (newPassword.length < 4) {
          alert("Лозинката мора да има барем 4 карактери.");
          return;
      }
      localStorage.setItem('myfit_custom_password', newPassword);
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
      setNewPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-20">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-5xl font-heading text-white tracking-wide text-glow">ПОДЕСУВАЊА</h2>
                <p className="text-brand-400 font-subtitle uppercase tracking-widest text-sm">ПРИЛАГОДИ ГО ТВОЕТО ИСКУСТВО</p>
            </div>
            <button 
                onClick={onLogout}
                className="bg-brand-800 hover:bg-brand-700 text-white p-3 rounded-xl border border-brand-600 shadow-lg flex flex-col items-center gap-1 transition-all active:scale-95 group"
                title="Одјави се / Заклучи"
            >
                <LogOut size={20} className="text-accent group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-wider">ЗАКЛУЧИ</span>
            </button>
        </header>

        {/* Profile Section */}
        <div className="metal-card rounded-xl border border-[#333] overflow-hidden">
            <div className="bg-[#121212] px-6 py-4 flex items-center justify-between border-b border-[#333]">
                <h3 className="text-white font-heading text-2xl flex items-center gap-2 tracking-wide">
                    <User size={24} className="text-accent" /> ПРОФИЛ
                </h3>
                <span className="text-brand-500 text-[10px] uppercase font-bold tracking-widest">ЛИЧНИ ПОДАТОЦИ</span>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-brand-400 uppercase mb-2">ВАШЕТО ИМЕ</label>
                        <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => onUpdateProfile({...profile, name: e.target.value})}
                            placeholder="ВНЕСЕТЕ ИМЕ..."
                            className="w-full p-4 rounded-lg border border-[#333] bg-[#121212] text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-heading tracking-wide text-lg placeholder-brand-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-400 uppercase mb-2">НИВО НА СПРЕМНОСТ</label>
                        <div className="relative">
                            <select 
                                value={profile.level}
                                onChange={(e) => onUpdateProfile({...profile, level: e.target.value as ExerciseLevel})}
                                className="w-full p-4 rounded-lg border border-[#333] bg-[#121212] text-white outline-none appearance-none cursor-pointer font-heading tracking-wide text-lg focus:border-accent"
                            >
                                <option value="Почетник">ПОЧЕТНИК</option>
                                <option value="Среден">СРЕДЕН</option>
                                <option value="Напреден">НАПРЕДЕН</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-accent rotate-90" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Security & Password Section */}
        <div className="metal-card rounded-xl border border-[#333] p-6 relative group overflow-hidden">
             <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2 tracking-wide">
                <span className="w-1 h-6 bg-accent"></span> БЕЗБЕДНОСТ
            </h3>
            
            <div className="bg-[#121212] p-4 rounded-lg border border-[#333] mb-4">
                <label className="block text-xs font-bold text-brand-400 uppercase mb-2 flex items-center gap-2">
                    <Key size={14} /> ПРОМЕНИ ЛОЗИНКА
                </label>
                <div className="flex gap-2">
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="ВНЕСИ НОВА ЛОЗИНКА..."
                        className="flex-1 p-3 rounded-lg border border-[#333] bg-black text-white focus:border-accent outline-none"
                    />
                    <button 
                        onClick={handleChangePassword}
                        className={`px-6 py-2 rounded-lg font-bold text-xs uppercase transition-all ${passwordSaved ? 'bg-green-600 text-white' : 'bg-brand-700 hover:bg-brand-600 text-white'}`}
                    >
                        {passwordSaved ? 'ЗАЧУВАНО!' : 'СМЕНИ'}
                    </button>
                </div>
                <p className="text-[10px] text-brand-600 mt-2 font-mono">Ова ќе ја замени стандардната лозинка со ваша.</p>
            </div>
        </div>

        {/* Install App Section */}
        {(deferredPrompt || isIOS) && (
            <div className="metal-card rounded-xl border border-accent/50 p-6 relative group overflow-hidden bg-gradient-to-r from-accent/10 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-lg shadow-accent/30">
                        <Smartphone size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-heading text-white tracking-wide">ИНСТАЛИРАЈ АПЛИКАЦИЈА</h3>
                        <p className="text-xs text-brand-400 font-mono">ЗА БРЗ ПРИСТАП ОД ПОЧЕТЕН ЕКРАН</p>
                    </div>
                    {deferredPrompt && (
                        <button 
                            onClick={handleInstallClick}
                            className="px-6 py-3 bg-accent hover:bg-accent-hover text-black font-heading tracking-wide rounded-lg shadow-lg active:scale-95 transition-all"
                        >
                            ИНСТАЛИРАЈ
                        </button>
                    )}
                </div>
                {isIOS && (
                    <div className="mt-4 p-3 bg-black/40 rounded border border-[#333] text-xs text-brand-300">
                        <p className="mb-1 font-bold text-white">ЗА IPHONE (iOS):</p>
                        <p>1. Кликнете на <strong>Share</strong> иконата (квадрат со стрелка нагоре).</p>
                        <p>2. Изберете <strong>"Add to Home Screen"</strong>.</p>
                    </div>
                )}
            </div>
        )}

        {/* Contact & Support Section */}
        <div className="metal-card rounded-xl border border-[#333] p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Share2 size={100} />
            </div>
            
            <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2 tracking-wide relative z-10">
                <span className="w-1 h-6 bg-accent"></span> КОНТАКТ И ПОДДРШКА
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {/* Phone */}
                <a href={SOCIAL_LINKS.phone} className="flex items-center gap-4 p-4 bg-[#121212] border border-[#333] rounded-lg hover:border-accent hover:bg-[#1a1a1a] transition-all group/btn">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-brand-400 group-hover/btn:text-accent group-hover/btn:border-accent transition-colors">
                        <Phone size={24} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-brand-500 uppercase tracking-widest">ТЕЛЕФОН</span>
                        <span className="text-lg font-heading text-white tracking-wide">ЈАВИ СЕ</span>
                    </div>
                </a>

                {/* Email */}
                <a href={SOCIAL_LINKS.email} className="flex items-center gap-4 p-4 bg-[#121212] border border-[#333] rounded-lg hover:border-accent hover:bg-[#1a1a1a] transition-all group/btn">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-brand-400 group-hover/btn:text-accent group-hover/btn:border-accent transition-colors">
                        <Mail size={24} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-brand-500 uppercase tracking-widest">E-MAIL</span>
                        <span className="text-lg font-heading text-white tracking-wide">ИСПРАТИ ПОРАКА</span>
                    </div>
                </a>

                {/* Feedback - Full Width */}
                <a 
                    href={SOCIAL_LINKS.feedback} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="col-span-1 md:col-span-2 flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-accent/20 to-transparent border border-accent/30 rounded-lg hover:bg-accent/30 hover:border-accent transition-all group/feed"
                >
                    <MessageSquare size={24} className="text-accent group-hover/feed:scale-110 transition-transform" />
                    <span className="font-heading text-xl text-white tracking-wide">ИСПРАТИ FEEDBACK / МИСЛЕЊЕ</span>
                </a>
            </div>

            {/* Socials Row */}
            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#121212] border border-[#333] rounded-lg hover:border-pink-500 hover:text-pink-500 text-brand-400 transition-all">
                    <Instagram size={28} className="mb-2" />
                    <span className="font-heading tracking-wide">INSTAGRAM</span>
                </a>
                <a href={SOCIAL_LINKS.viber} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#121212] border border-[#333] rounded-lg hover:border-purple-500 hover:text-purple-500 text-brand-400 transition-all">
                    <Phone size={28} className="mb-2" />
                    <span className="font-heading tracking-wide">VIBER</span>
                </a>
            </div>
        </div>

        {/* App Settings */}
        <div className="metal-card rounded-xl border border-[#333] p-6">
            <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2 tracking-wide">
                <span className="w-1 h-6 bg-accent"></span> АПЛИКАЦИЈА
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#333] cursor-pointer hover:border-brand-500 transition-all" onClick={() => toggleSetting('darkMode')}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#1a1a1a] text-accent rounded-lg border border-[#333]">
                            <Moon size={20} />
                        </div>
                        <div>
                            <div className="font-heading text-lg text-white tracking-wide">ТЕМЕН РЕЖИМ</div>
                            <div className="text-[10px] text-brand-500 font-mono uppercase">СЕКОГАШ ВКЛУЧЕНО</div>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-accent' : 'bg-[#333]'}`}>
                        <div className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : ''}`}></div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#333] cursor-pointer hover:border-brand-500 transition-all" onClick={() => toggleSetting('soundNotifications')}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#1a1a1a] text-accent rounded-lg border border-[#333]">
                            <Bell size={20} />
                        </div>
                        <div>
                            <div className="font-heading text-lg text-white tracking-wide">ЗВУЧНИ ЕФЕКТИ</div>
                            <div className="text-[10px] text-brand-500 font-mono uppercase">ЗВУЦИ ПРИ ИНТЕРАКЦИЈА</div>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.soundNotifications ? 'bg-accent' : 'bg-[#333]'}`}>
                        <div className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-300 ${settings.soundNotifications ? 'translate-x-6' : ''}`}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="metal-card p-6 rounded-xl border border-[#333] hover:border-brand-500 transition-colors">
                <h4 className="font-heading text-xl text-white mb-2 flex items-center gap-2"><Shield size={20} className="text-brand-400" /> БЕЗБЕДНОСТ</h4>
                <p className="text-[10px] text-brand-500 font-mono mb-4 uppercase">ЛОКАЛНА РЕЗЕРВНА КОПИЈА</p>
                <button onClick={handleExport} className="w-full py-3 bg-[#121212] hover:bg-[#1a1a1a] border border-[#333] hover:border-white rounded text-white font-heading tracking-wide flex items-center justify-center gap-2 transition-all">
                    <Download size={18} /> ПРЕЗЕМИ BACKUP
                </button>
            </div>
            <div className="metal-card p-6 rounded-xl border border-[#333] hover:border-red-500 transition-colors group">
                <h4 className="font-heading text-xl text-white mb-2 flex items-center gap-2 group-hover:text-red-500 transition-colors"><Trash2 size={20} /> РЕСЕТ ЗОНА</h4>
                <p className="text-[10px] text-brand-500 font-mono mb-4 uppercase">ВНИМАТЕЛНО! НЕПОВРАТНО.</p>
                <button onClick={onResetData} className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 hover:border-red-500 rounded text-red-500 font-heading tracking-wide flex items-center justify-center gap-2 transition-all">
                    ИЗБРИШИ СÈ
                </button>
            </div>
        </div>
        
        {/* Info Card */}
        <div className="relative overflow-hidden bg-[#121212] rounded-xl border border-[#333] p-8 text-center">
            <div className="relative z-10">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-700 to-brand-800 rounded-xl flex items-center justify-center text-accent border border-brand-600 shadow-lg overflow-hidden">
                        {/* Corrected Path for GitHub Pages: /myfit-mk/myfitmklogo.jpg */}
                        <img src="/myfit-mk/myfitmklogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading text-white mb-1 tracking-wider text-glow">MYFIT MK</h3>
                <p className="text-xs font-mono text-brand-500 uppercase tracking-widest mb-6">ВЕРЗИЈА 2.4.0</p>
                
                {/* Changelog Description */}
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] mb-6 text-left max-w-lg mx-auto shadow-inner">
                    <h4 className="text-accent font-heading text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
                        <Sparkles size={14} /> ШТО Е НОВО
                    </h4>
                    <ul className="text-xs text-brand-300 space-y-2 font-medium">
                        <li className="flex items-start gap-2">
                            <span className="text-accent">•</span>
                            <span>Подобрен AI Тренер со строги правила</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent">•</span>
                            <span>Додадени нови вежби (260+)</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-6 text-sm leading-relaxed text-brand-300 border border-[#333] max-w-lg mx-auto font-medium space-y-4">
                    <p className="italic text-white">
                        "Го создадов MyFit MK со една цел да направам квалитетно фитнес знаење достапно за секој, верувам дека секој заслужува пристап до безбедни и ефективни вежби, без оглед на нивото или искуството."
                    </p>
                    <p className="text-right text-accent font-heading tracking-wide text-lg">
                        - Владо Смилевски
                    </p>
                </div>

                <div className="pt-6">
                    <p className="text-[10px] text-brand-600 uppercase tracking-widest mb-1">КРЕАТОР</p>
                    <p className="text-lg font-heading text-white flex items-center justify-center gap-2 tracking-wide">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        ВЛАДО СМИЛЕВСКИ
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;
