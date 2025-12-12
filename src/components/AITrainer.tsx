
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface AITrainerProps {
    userProfile: { name: string; level: string };
}

const AITrainer: React.FC<AITrainerProps> = ({ userProfile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'model',
            text: `Здраво ${userProfile.name || 'Шампионе'}! Јас сум твојот MyFit AI тренер. Како можам да ти помогнам денес со твојот тренинг или исхрана?`,
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

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // @ts-ignore
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key missing");

            const ai = new GoogleGenAI({ apiKey });
            
            const systemPrompt = `You are an elite fitness trainer for the "MyFit MK" app created by Vlado Smilevski. 
            User info: Name: ${userProfile.name}, Level: ${userProfile.level}.
            Language: Macedonian (always reply in Macedonian).
            Tone: Motivational, professional, direct, encouraging (like a strict but fair coach).
            Topics: Workout advice, nutrition, recovery, explaining exercises.
            Constraint: Keep answers concise and actionable. Use emojis occasionally.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt + "\n\nUser question: " + userMsg.text }] }
                ]
            });

            const replyText = response.text || "Се извинувам, имам проблем со мрежата. Обиди се повторно.";

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: replyText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error("AI Error", error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Моментално не можам да се поврзам со серверот. Провери интернет конекција.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 pb-20">
            <header className="flex items-center gap-3 border-b border-[#333] pb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-red-500 flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Bot size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-heading text-white tracking-wide">AI ТРЕНЕР</h2>
                    <p className="text-xs text-brand-400 font-mono uppercase">24/7 ПОДДРШКА</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-[#333]' : 'bg-accent/20 text-accent'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div 
                            className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-[#262626] text-white rounded-tr-none border border-[#333]' 
                                : 'bg-brand-800 text-brand-100 rounded-tl-none border border-brand-700'
                            }`}
                        >
                            {msg.text}
                            <div className="text-[9px] opacity-50 mt-2 text-right">
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="bg-brand-800 p-4 rounded-2xl rounded-tl-none border border-brand-700 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-accent" />
                            <span className="text-xs text-brand-400">Тренерот пишува...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-[#1a1a1a] p-2 rounded-xl border border-[#333] flex items-center gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Прашај ме за вежби, исхрана..."
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 p-3 text-sm placeholder-brand-600 outline-none"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-3 bg-accent hover:bg-accent-hover text-black rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default AITrainer;
