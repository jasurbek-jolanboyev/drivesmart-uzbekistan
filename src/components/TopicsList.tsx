import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { topics, questions } from '@/lib/data';
import { calculateTopicProgress } from '@/lib/spacedRepetition';
import { TopicIcon } from './TopicIcon';
import { cn } from '@/lib/utils';

interface TopicsListProps {
  onSelectTopic: (topicId: string) => void;
}

export function TopicsList({ onSelectTopic }: TopicsListProps) {
  const { t, progress, language } = useApp();

  const topicsWithProgress = topics.map(topic => ({
    ...topic,
    progressData: calculateTopicProgress(topic.id, questions, progress),
  }));

  const getStatusVariant = (percentage: number): 'success' | 'warning' | 'error' | 'muted' => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    if (percentage > 0) return 'error';
    return 'muted';
  };

  const getStatusText = (percentage: number, answered: number) => {
    if (answered === 0) return t('notStarted');
    if (percentage >= 80) return t('mastered');
    return t('needsPractice');
  };

  return (
    <div className="space-y-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{t('allTopics')}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {language === 'uz' 
            ? 'O\'rganmoqchi bo\'lgan mavzuni tanlang' 
            : 'Выберите тему для изучения'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topicsWithProgress.map((topic, index) => {
          const statusVariant = getStatusVariant(topic.progressData.percentage);
          const statusText = getStatusText(topic.progressData.percentage, topic.progressData.answered);
          
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card
                onClick={() => onSelectTopic(topic.id)}
                className="group p-4 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <TopicIcon 
                    icon={topic.icon} 
                    size="md" 
                    variant={statusVariant === 'muted' ? 'default' : statusVariant} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-medium text-[15px] text-foreground truncate">
                        {language === 'uz' ? topic.nameUz : topic.name}
                      </h3>
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                        statusVariant === 'success' && 'bg-success/10 text-success',
                        statusVariant === 'warning' && 'bg-warning/10 text-warning',
                        statusVariant === 'error' && 'bg-error/10 text-error',
                        statusVariant === 'muted' && 'bg-muted text-muted-foreground'
                      )}>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={topic.progressData.percentage} 
                        className={cn(
                          'h-1.5 flex-1',
                          statusVariant === 'success' && '[&>div]:bg-success',
                          statusVariant === 'warning' && '[&>div]:bg-warning',
                          statusVariant === 'error' && '[&>div]:bg-error'
                        )}
                      />
                      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {topic.progressData.answered}/{topic.progressData.total}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
