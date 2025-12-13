
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck, Copy, Check, Key, UserCheck, Smartphone, LogIn, Instagram, Phone } from 'lucide-react';
import { getDeviceId, validateLicenseKey, generateLicenseKey } from '../utils/licenseManager';
import { ADMIN_GENERATOR_CODE, SOCIAL_LINKS } from '../constants';

interface LicenseGateProps {
    onUnlock: () => void;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ onUnlock }) => {
    const [deviceId, setDeviceId] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Install App State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);

    // Admin State
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [targetId, setTargetId] = useState('');
    const [duration, setDuration] = useState(3); 
    const [generatedKey, setGeneratedKey] = useState('');

    useEffect(() => {
        const id = getDeviceId();
        setDeviceId(id);
        
        // Check local license
        const savedKey = localStorage.getItem('myfit_license_key');
        
        // Check for Admin Bypass or Valid License
        if (savedKey === 'MYFIT-ADMIN-MASTER-ACCESS') {
            onUnlock();
            return;
        }

        if (savedKey) {
            const result = validateLicenseKey(savedKey, id);
            if (result.valid) {
                onUnlock();
            } else if (result.message === 'Лиценцата е истечена.') {
                setError('ВАШАТА ЛИЦЕНЦА Е ИСТЕЧЕНА. ВНЕСЕТЕ НОВ КОД.');
            }
        }

        // PWA Install Logic
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

    const handleUnlockAttempt = () => {
        if (inputCode === ADMIN_GENERATOR_CODE) {
            setIsAdminMode(true);
            setError('');
            return;
        }

        const result = validateLicenseKey(inputCode, deviceId);
        if (result.valid) {
            localStorage.setItem('myfit_license_key', inputCode);
            onUnlock();
        } else {
            setError(result.message || 'Невалиден код за овој уред.');
        }
    };

    const handleAdminEnterApp = () => {
        // Save a master key so the admin doesn't need to type the code again
        localStorage.setItem('myfit_license_key', 'MYFIT-ADMIN-MASTER-ACCESS');
        onUnlock();
    };

    const handleGenerateKey = () => {
        if (!targetId.trim()) {
            alert("Внесете го ID-то на корисникот!");
            return;
        }
        const key = generateLicenseKey(targetId.trim(), duration);
        setGeneratedKey(key);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- ADMIN VIEW ---
    if (isAdminMode) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="metal-card w-full max-w-lg p-8 rounded-2xl border-2 border-red-900/50 relative overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                    
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <ShieldCheck size={32} className="text-red-500" />
                        <h2 className="text-3xl font-heading text-white tracking-wide">АДМИН ПАНЕЛ</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Enter App Button for Admin - NOW PERSISTENT */}
                        <button 
                            onClick={handleAdminEnterApp}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-heading text-xl rounded transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 mb-4 border border-green-400"
                        >
                            <LogIn size={24} /> ВЛЕЗИ ВО АПЛИКАЦИЈА
                        </button>

                        <div className="h-px bg-[#333] my-4"></div>

                        <div className="bg-[#121212] p-4 rounded border border-[#333]">
                            <label className="text-[10px] text-brand-500 uppercase font-bold block mb-2">1. ID НА КОРИСНИК</label>
                            <div className="flex items-center gap-2">
                                <UserCheck className="text-brand-600" size={20} />
                                <input 
                                    type="text" 
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    className="w-full bg-transparent border-none text-white font-mono text-sm focus:ring-0 placeholder-brand-700"
                                    placeholder="Paste ID here..."
                                />
                            </div>
                        </div>
                        
                        <div className="bg-[#121212] p-4 rounded border border-[#333]">
                            <label className="text-[10px] text-brand-500 uppercase font-bold block mb-3">2. ВРЕМЕТРАЕЊЕ</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[3, 6, 12].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setDuration(m)}
                                        className={`py-3 rounded text-xs font-bold border transition-all ${duration === m ? 'bg-red-600 text-white border-red-500' : 'bg-[#1a1a1a] text-brand-400 border-[#333]'}`}
                                    >
                                        {m} МЕСЕЦИ
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateKey}
                            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-heading text-xl rounded transition-all active:scale-95 shadow-lg"
                        >
                            ГЕНЕРИРАЈ КОД ЗА КЛИЕНТ
                        </button>

                        {generatedKey && (
                            <div className="bg-green-900/20 border border-green-500/50 p-4 rounded text-center animate-in zoom-in duration-300">
                                <p className="text-[10px] text-green-400 mb-2 font-bold uppercase">КОД ЗА АКТИВАЦИЈА:</p>
                                <div className="bg-black/50 p-3 rounded border border-green-900/50 flex items-center justify-between gap-2">
                                    <code className="font-mono text-sm text-white break-all">{generatedKey}</code>
                                    <button onClick={() => copyToClipboard(generatedKey)} className="text-green-500 hover:text-white">
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button onClick={() => setIsAdminMode(false)} className="w-full text-brand-500 text-xs hover:text-white underline mt-4">
                            &larr; Назад кон најава
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- USER VIEW ---
    return (
        <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>
            
            <div className="metal-card w-full max-w-md p-8 rounded-3xl relative z-10 shadow-2xl border border-[#333] flex flex-col">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-brand-800 rounded-full flex items-center justify-center border-2 border-brand-600 shadow-[0_0_20px_rgba(255,109,0,0.3)]">
                        <Lock size={32} className="text-accent" />
                    </div>
                </div>

                <h1 className="text-4xl font-heading text-white text-center mb-2 tracking-wide text-glow">MYFIT MK</h1>
                <p className="text-center text-brand-400 text-xs font-subtitle uppercase tracking-widest mb-8">ПРОФЕСИОНАЛНА ВЕРЗИЈА</p>

                {/* Install Button Logic */}
                {(deferredPrompt || isIOS) && (
                    <div className="mb-6 bg-accent/10 border border-accent/50 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent text-black p-2 rounded-full">
                                <Smartphone size={16} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-white font-bold uppercase">ИНСТАЛИРАЈ</p>
                                <p className="text-[9px] text-brand-400">ЗА ПОЛЕСЕН ПРИСТАП</p>
                            </div>
                        </div>
                        {isIOS ? (
                            <div className="text-[9px] text-white bg-black/50 px-2 py-1 rounded">Share &rarr; Add to Home</div>
                        ) : (
                            <button onClick={handleInstallClick} className="px-3 py-1 bg-accent text-black text-xs font-bold rounded hover:bg-white transition-colors">
                                КЛИКНИ
                            </button>
                        )}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="bg-[#121212] p-4 rounded-xl border border-[#333]">
                        <p className="text-[10px] text-brand-500 font-bold uppercase mb-2 text-center flex items-center justify-center gap-1">
                            <Key size={12} /> ТВОЈ УРЕД (ID)
                        </p>
                        <div className="flex items-center gap-2 bg-black/50 p-3 rounded-lg border border-[#262626]">
                            <code className="flex-1 font-mono text-accent text-center text-sm tracking-wider select-all">{deviceId}</code>
                            <button onClick={() => copyToClipboard(deviceId)} className="text-brand-400 hover:text-white transition-colors">
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-brand-600 text-center mt-3 leading-tight">
                            Копирај го овој ID и испрати го на Владо за да добиеш код за отклучување.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white uppercase mb-2 ml-1">КОД ЗА ОТКЛУЧУВАЊЕ</label>
                        <input 
                            type="text" 
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="ВНЕСИ ГО КОДОТ ТУКА..."
                            className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-brand-700 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none text-center font-mono text-lg placeholder-brand-700 uppercase"
                        />
                        {error && (
                            <div className="mt-3 bg-red-900/20 border border-red-900/50 p-2 rounded text-center">
                                <p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleUnlockAttempt}
                        className="w-full py-4 bg-accent hover:bg-accent-hover text-black font-heading text-2xl tracking-wide rounded-xl shadow-[0_4px_15px_rgba(255,109,0,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Unlock size={20} /> ОТКЛУЧИ
                    </button>
                </div>

                {/* Social Links Footer - Changed to Insta & Viber */}
                <div className="mt-8 pt-6 border-t border-[#333] flex justify-center gap-6">
                    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-brand-500 hover:text-pink-500 transition-colors group">
                        <Instagram size={28} />
                        <span className="text-[9px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Insta</span>
                    </a>
                    
                    <a href={SOCIAL_LINKS.viber} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-brand-500 hover:text-purple-500 transition-colors group">
                        <Phone size={28} />
                        <span className="text-[9px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Viber</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LicenseGate;
