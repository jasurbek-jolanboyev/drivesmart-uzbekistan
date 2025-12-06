import { motion } from 'framer-motion';
import { Home, BookOpen, GraduationCap, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, labelKey: 'dashboard' },
  { id: 'topics', icon: BookOpen, labelKey: 'topics' },
  { id: 'exam', icon: GraduationCap, labelKey: 'exam' },
  { id: 'stats', icon: BarChart3, labelKey: 'stats' },
  { id: 'settings', icon: Settings, labelKey: 'settings' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center bg-card border-r border-border py-8 shadow-card z-50">
        <div className="mb-8">
          <span className="text-3xl">🚗</span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{t(item.labelKey)}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50 shadow-lg">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                <span className={cn(
                  'text-[10px] mt-0.5 font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {t(item.labelKey)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
