import { motion } from 'framer-motion';
import { Home, BookOpen, GraduationCap, BarChart3, Settings } from 'lucide-react';
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

  return (
    <>
      {/* Desktop Navigation - Apple Style */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[72px] flex-col items-center glass-nav border-r border-border/50 py-6 z-50">
        <motion.div 
          className="mb-8 w-10 h-10 rounded-xl bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center shadow-apple"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">🚗</span>
        </motion.div>
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-apple'
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] mt-1 font-medium tracking-tight">{t(item.labelKey)}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation - Apple Style Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-border/50 px-2 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all min-w-[56px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-foreground'
                )}
                whileTap={{ scale: 0.92 }}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.75} />
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
