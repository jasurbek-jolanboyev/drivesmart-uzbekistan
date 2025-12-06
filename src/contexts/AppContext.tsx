import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Settings, UserProgress, UserStats, Language } from '@/lib/types';
import { defaultSettings } from '@/lib/data';
import { useTranslation } from '@/lib/i18n';

interface AppContextType {
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  progress: Record<string, UserProgress>;
  setProgress: (progress: Record<string, UserProgress> | ((prev: Record<string, UserProgress>) => Record<string, UserProgress>)) => void;
  stats: UserStats;
  setStats: (stats: UserStats | ((prev: UserStats) => UserStats)) => void;
  t: (key: string) => string;
  language: Language;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultStats: UserStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  streakDays: 0,
  lastActiveDate: '',
  sessions: [],
  achievements: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('pdd-settings', defaultSettings);
  const [progress, setProgress] = useLocalStorage<Record<string, UserProgress>>('pdd-progress', {});
  const [stats, setStats] = useLocalStorage<UserStats>('pdd-stats', defaultStats);
  
  const t = useTranslation(settings.language);

  return (
    <AppContext.Provider
      value={{
        settings,
        setSettings,
        progress,
        setProgress,
        stats,
        setStats,
        t: t as (key: string) => string,
        language: settings.language,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
