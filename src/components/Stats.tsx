import React from 'react';
import { WorkoutSession } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, Calendar, Trophy, Zap } from 'lucide-react';

interface StatsProps {
  history: WorkoutSession[];
}

const Stats: React.FC<StatsProps> = ({ history }) => {
  const totalWorkouts = history.length;
  const totalExercises = history.reduce((acc, curr) => acc + curr.exercises.length, 0);
  
  const getWeeklyData = () => {
    const days = ['НЕД', 'ПОН', 'ВТО', 'СРЕ', 'ЧЕТ', 'ПЕТ', 'САБ'];
    const counts = Array(7).fill(0);
    const now = new Date();
    history.forEach(session => {
        const date = new Date(session.date);
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= 7) {
            counts[date.getDay()]++;
        }
    });
    
    return days.map((day, idx) => ({ name: day, workouts: counts[idx] }));
  };

  const weeklyData = getWeeklyData();

  const getCategoryData = () => {
      const catCounts: Record<string, number> = {};
      history.forEach(session => {
          session.exercises.forEach(ex => {
              catCounts[ex.category] = (catCounts[ex.category] || 0) + 1;
          });
      });
      return Object.keys(catCounts).map(key => ({ name: key, value: catCounts[key] }));
  };

  const categoryData = getCategoryData();

  // Electric Orange Theme Colors for Charts
  const CHART_COLORS = ['#FF6D00', '#FF9100', '#FFAB40', '#404040', '#737373', '#A3A3A3'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        <header>
            <h2 className="text-5xl font-heading text-white tracking-wide text-glow">НАПРЕДОК</h2>
            <p className="text-brand-400 font-subtitle uppercase tracking-widest text-sm">ТВОИТЕ БРОЈКИ, ТВОЈАТА ПОБЕДА</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label="ТРЕНИНЗИ" value={totalWorkouts} />
            <StatCard icon={Zap} label="ВЕЖБИ" value={totalExercises} highlight />
            <StatCard icon={Activity} label="АКТИВНИ ДЕНОВИ" value={weeklyData.filter(d => d.workouts > 0).length} />
            <StatCard icon={Calendar} label="ОВАА НЕДЕЛА" value={weeklyData.reduce((a,b) => a + b.workouts, 0)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="metal-card p-6 rounded-xl flex flex-col border border-[#333]">
                <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent"></span> НЕДЕЛНА АКТИВНОСТ
                </h3>
                <div className="h-72 w-full min-h-[300px]" style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#737373', fontSize: 12, fontWeight: 'bold'}} 
                                dy={10}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255, 109, 0, 0.1)'}}
                                contentStyle={{ 
                                    borderRadius: '4px', 
                                    border: '1px solid #333', 
                                    backgroundColor: '#1a1a1a',
                                    color: '#fff',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Bar dataKey="workouts" radius={[2, 2, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.workouts > 0 ? '#FF6D00' : '#262626'} 
                                        stroke={entry.workouts > 0 ? '#FF9100' : 'none'}
                                        strokeWidth={1}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="metal-card p-6 rounded-xl flex flex-col border border-[#333]">
                <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent"></span> МУСКУЛЕН ФОКУС
                </h3>
                <div className="h-72 w-full min-h-[300px] relative" style={{ width: '100%', height: '300px' }}>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '4px', 
                                        border: '1px solid #333', 
                                        backgroundColor: '#1a1a1a',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brand-600 text-sm font-mono uppercase tracking-widest border border-dashed border-[#333] rounded-full w-48 h-48 m-auto">
                            Нема податоци
                        </div>
                    )}
                    {/* Center Text for Donut Chart */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="block text-3xl font-heading text-white">{totalExercises}</span>
                            <span className="block text-[10px] text-brand-500 uppercase tracking-widest">ВКУПНО</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {categoryData.slice(0, 5).map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-400">
                            <div className="w-3 h-3 rounded-sm" style={{backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]}}></div>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="metal-card rounded-xl overflow-hidden border border-[#333]">
            <div className="p-5 border-b border-[#333] bg-[#1a1a1a] flex justify-between items-center">
                <span className="font-heading text-2xl text-white tracking-wide">ИСТОРИЈА</span>
                <span className="text-xs font-mono text-brand-500">{history.length} ЗАПИСИ</span>
            </div>
            {history.length === 0 ? (
                 <div className="p-10 text-center text-brand-600 font-mono uppercase text-sm">НЕМА ЗАВРШЕНИ ТРЕНИНЗИ</div>
            ) : (
                <div className="divide-y divide-[#333]">
                    {history.slice().reverse().slice(0, 5).map(session => (
                        <div key={session.id} className="p-5 flex justify-between items-center hover:bg-[#262626] transition-colors group">
                            <div>
                                <div className="font-heading text-xl text-white group-hover:text-accent transition-colors tracking-wide">{session.name}</div>
                                <div className="text-xs text-brand-500 font-mono mt-1">{new Date(session.date).toLocaleDateString('mk-MK')} • {session.exercises.length} ВЕЖБИ</div>
                            </div>
                            <span className="text-accent text-sm font-bold font-subtitle tracking-widest border border-accent/30 px-3 py-1 rounded bg-accent/10">ЗАВРШЕНО</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, highlight = false }: any) => (
    <div className={`metal-card p-4 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden group border border-[#333] hover:border-brand-500 transition-all ${highlight ? 'border-accent/50' : ''}`}>
        {highlight && <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-[#121212] border border-[#333] shadow-inner ${highlight ? 'text-accent' : 'text-brand-400 group-hover:text-white'}`}>
            <Icon size={24} />
        </div>
        <div className={`text-4xl font-heading tracking-wide ${highlight ? 'text-accent text-glow' : 'text-white'}`}>{value}</div>
        <div className="text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-1">{label}</div>
    </div>
);

export default Stats;