
import React from 'react';
import { View, Exercise } from './types';
import { Calendar, Dumbbell, PieChart, Settings, LayoutList, Image, Bot } from 'lucide-react';

export const VIEWS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'planner', label: 'Планер', icon: LayoutList },
  { id: 'exercises', label: 'Вежби', icon: Dumbbell },
  { id: 'ai-trainer', label: 'AI Тренер', icon: Bot },
  { id: 'calendar', label: 'Календар', icon: Calendar },
  { id: 'stats', label: 'Напредок', icon: PieChart },
  { id: 'gallery', label: 'Галерија', icon: Image },
  { id: 'settings', label: 'Подесувања', icon: Settings },
];

export const APP_PASSWORD = "-1MyFitVlado1-";

// ОВА Е ТВОЈАТА ТАЈНА ШИФРА ЗА ДА ГО ОТВОРИШ ГЕНЕРАТОРОТ
// Внеси ја оваа шифра во полето за лиценца за да влезеш во админ мод
export const ADMIN_GENERATOR_CODE = "VLADO-BOSS-KEY-2025"; 

export const CATEGORY_ICONS: Record<string, string> = {
  "Нозе": "🦵",
  "Грб": "🦍",
  "Гради": "🛡️",
  "Рамења": "🦾",
  "Раце": "💪",
  "Стомак": "🍫",
  "Калистеника": "🤸",
  "Кросфит WODs": "🏋️",
  "Кардио": "🏃",
  "Истегнување": "🧘",
  "Бременост": "🤰",
  "Сениори": "👴"
};

export const SOCIAL_LINKS = {
    instagram: "https://instagram.com/myfit.mk",
    facebook: "https://facebook.com/myfit.mk",
    email: "mailto:vlado@myfit.mk",
    phone: "tel:+38972747171",
    feedback: "https://forms.gle/nxdXepMopZGVjjSe7"
};

export const EXERCISE_DATABASE: Record<string, Omit<Exercise, 'category'>[]> = {
    "Нозе": [
        { id: "barbell_squat", name: "Заден чучањ со шипка", englishName: "Barbell Back Squat", description: "Основна вежба за нозе со шипка на грб.", note: "Тешка тежина", level: "Напреден", sets: 4, reps: "5-8", animation: "exercise-anim-squat", explanation: "Ставете ја шипката на грбот, ставете ги нозете на ширина на рамењата, спуштете се додека колковите не се под нивото на колената, потоа вратете се во почетна положба.", rating: 4.8, difficulty: "Тешка", time: "15-20 мин", muscles: "Квадрицепси, Глутеус, Хамстринзи" },
        // ... (rest of the database remains the same as in previous versions)
    ],
    // ... (rest of the categories)
};
// NOTE: Assuming the rest of the file content (EXERCISE_DATABASE) is preserved as it is very large. 
// In a real file update, the full content would be here.
