
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, Zap, Dumbbell, Utensils, HeartPulse, AlertTriangle } from 'lucide-react';

interface AITrainerProps {
    userProfile: { name: string; level: string };
}

const SUGGESTIONS = [
    { label: "Тренинг за Гради", icon: Dumbbell, prompt: "Направи ми експлозивен тренинг за гради за ниво " },
    { label: "План за Исхрана", icon: Utensils, prompt: "Дај ми пример мени за еден ден за зголемување на мускулна маса." },
    { label: "Кардио HIIT", icon: HeartPulse, prompt: "Предложи ми краток 20-минутен HIIT кардио тренинг." },
    { label: "Совет за Опоравување", icon: Zap, prompt: "Како најбрзо да се опоравам после тежок тренинг на нозе?" }
];

const AITrainer: React.FC<AITrainerProps> = ({ userProfile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'model',
            text: `Здраво ${userProfile.name || 'Шампионе'}! 💪\nЈас сум твојот AI тренер. Тука сум да ти креирам персонализирани планови за вежбање и исхрана.\n\nИзбери тема подолу или прашај ме било што!`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (textToSend: string = input) => {
        if (!textToSend.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // @ts-ignore
            const apiKey = process.env.API_KEY;
            
            // Validate Key
            if (!apiKey || apiKey.includes("API_KEY")) {
                throw new Error("Невалиден API Клуч. Проверете ја конфигурацијата.");
            }

            const ai = new GoogleGenAI({ apiKey });
            
            let finalPrompt = textToSend;
            if (textToSend.includes("ниво")) {
                finalPrompt = textToSend + " " + userProfile.level;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalPrompt,
                config: {
                    systemInstruction: `You are an elite fitness trainer for "MyFit MK". 
                    User Name: ${userProfile.name}. User Level: ${userProfile.level}.
                    Language: Macedonian (MK).
                    
                    RESTRICTIONS:
                    1. Only answer questions related to fitness, workouts, nutrition, health, and supplements.
                    2. If the topic is unrelated, politely refuse.
                    
                    FORMATTING:
                    1. Use emojis.
                    2. Use bullet points for lists.
                    3. Keep it motivating and energetic.`,
                }
            });

            const replyText = response.text;

            if (!replyText) {
                throw new Error("Празна повратна информација од серверот.");
            }

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: replyText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error: any) {
            console.error("AI Error Details:", error);
            
            let errorMessage = "Се појави неочекувана грешка.";
            
            // Parse error message for better feedback
            if (error.message) {
                if (error.message.includes("403") || error.message.includes("PERMISSION_DENIED")) {
                    errorMessage = "⛔ ПРИСТАПОТ Е ОДБИЕН (403)\n\nGoogle го блокираше ова барање. Проверете ги 'Website Restrictions' во Google Cloud Console. Бидејќи апликацијата работи на порта 5175, додадете го точно овој линк:\n\nhttp://localhost:5175/*";
                } else if (error.message.includes("401") || error.message.includes("API key")) {
                    errorMessage = "⚠️ ГРЕШКА СО КЛУЧОТ (401)\n\nAPI клучот е невалиден или истечен. Проверете го .env фајлот.";
                } else if (error.message.includes("429")) {
                    errorMessage = "⏳ ПРЕМНОГУ БАРАЊА (429)\n\nСистемот е преоптоварен. Ве молиме почекајте малку.";
                } else if (error.message.includes("Failed to fetch")) {
                    errorMessage = "🌐 МРЕЖНА ГРЕШКА\n\nПроверете ја интернет конекцијата.";
                } else {
                    errorMessage = `Системска грешка: ${error.message}`;
                }
            }

            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: errorMessage,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 pb-20">
            <header className="flex items-center gap-4 border-b border-[#333] pb-4 bg-[#121212]/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-700 to-brand-800 border border-brand-600 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(255,109,0,0.15)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent/10 animate-pulse"></div>
                    <Bot size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-heading text-white tracking-wide flex items-center gap-2">
                        AI ТРЕНЕР <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                    </h2>
                    <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider">POWERED BY GEMINI 2.5</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar p-2">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${msg.role === 'user' ? 'bg-[#262626] border border-[#404040]' : 'bg-gradient-to-br from-accent to-orange-600 text-black border border-orange-400'}`}>
                            {msg.role === 'user' ? <User size={20} className="text-brand-300" /> : (msg.text.includes("Грешка") || msg.text.includes("ОДБИЕН") ? <AlertTriangle size={20} /> : <Sparkles size={20} fill="black" />)}
                        </div>
                        <div 
                            className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-md whitespace-pre-wrap ${
                                msg.role === 'user' 
                                ? 'bg-[#262626] text-white rounded-tr-none border border-[#333]' 
                                : (msg.text.includes("Грешка") || msg.text.includes("ОДБИЕН") ? 'bg-red-900/30 border border-red-500/50 text-red-200' : 'bg-brand-800 text-brand-100 rounded-tl-none border border-brand-700 font-medium')
                            }`}
                        >
                            {msg.text}
                            <div className="text-[9px] opacity-40 mt-3 text-right font-mono uppercase">
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-brand-800 border border-brand-700 flex items-center justify-center">
                            <Bot size={20} className="text-brand-500" />
                        </div>
                        <div className="bg-brand-900/50 p-4 rounded-2xl rounded-tl-none border border-brand-800 flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin text-accent" />
                            <span className="text-xs text-brand-400 font-mono uppercase tracking-widest">Генерирање план...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {!isLoading && messages.length < 4 && (
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar px-1">
                    {SUGGESTIONS.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s.prompt)}
                            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:border-accent hover:bg-[#262626] px-4 py-2 rounded-full whitespace-nowrap transition-all group"
                        >
                            <s.icon size={14} className="text-brand-500 group-hover:text-accent" />
                            <span className="text-xs text-brand-300 font-bold group-hover:text-white uppercase">{s.label}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-[#1a1a1a] p-2 rounded-xl border border-[#333] flex items-center gap-2 shadow-lg relative focus-within:border-accent/50 transition-colors">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Прашај ме за вежби, исхрана, повреди..."
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 p-3 text-sm placeholder-brand-600 outline-none font-medium"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="p-3 bg-accent hover:bg-accent-hover text-black rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_10px_rgba(255,109,0,0.2)]"
                >
                    <Send size={18} fill="black" />
                </button>
            </div>
        </div>
    );
};

export default AITrainer;
