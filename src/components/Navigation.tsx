import { motion } from 'framer-motion';
import { Home, BookOpen, GraduationCap, BarChart3, Settings, Car } from 'lucide-react';
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
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[68px] flex-col items-center bg-card/80 backdrop-blur-xl border-r border-border/40 py-5 z-50">
        <div className="mb-6 w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        
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
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.75} />
                <span className="text-[9px] mt-0.5 font-medium">{t(item.labelKey)}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/40 px-1 pb-safe z-50">
        <div className="flex justify-around items-center h-[60px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors min-w-[52px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-foreground'
                )}
                whileTap={{ scale: 0.94 }}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2 : 1.5} />
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
