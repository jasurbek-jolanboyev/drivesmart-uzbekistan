import { 
  Gauge, AlertTriangle, Ban, ArrowRight, Info, Route, 
  CircleDot, GitMerge, ArrowLeftRight, ParkingCircle, 
  Footprints, Milestone, Users, Heart, Scale, LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Gauge,
  AlertTriangle,
  Ban,
  ArrowRight,
  Info,
  Route,
  CircleDot,
  GitMerge,
  ArrowLeftRight,
  ParkingCircle,
  Footprints,
  Milestone,
  Users,
  Heart,
  Scale,
};

interface TopicIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
}

export function TopicIcon({ icon, size = 'md', className, variant = 'default' }: TopicIconProps) {
  const IconComponent = iconMap[icon] || Gauge;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };
  
  const variantClasses = {
    default: 'bg-secondary/80 text-foreground',
    muted: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };
  
  return (
    <div className={cn(
      'flex items-center justify-center rounded-xl',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <IconComponent className={iconSizes[size]} strokeWidth={1.75} />
    </div>
  );
}
