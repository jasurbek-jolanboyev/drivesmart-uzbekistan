import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { topics, questions } from '@/lib/data';
import { calculateTopicProgress } from '@/lib/spacedRepetition';
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

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  const getStatusText = (percentage: number, answered: number) => {
    if (answered === 0) return t('notStarted');
    if (percentage >= 80) return t('mastered');
    return t('needsPractice');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('allTopics')}</h1>
        <p className="text-muted-foreground">
          {language === 'uz' 
            ? 'O\'rganmoqchi bo\'lgan mavzuni tanlang' 
            : 'Выберите тему для изучения'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topicsWithProgress.map((topic, index) => {
          const statusColor = getStatusColor(topic.progressData.percentage);
          const statusText = getStatusText(topic.progressData.percentage, topic.progressData.answered);
          
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => onSelectTopic(topic.id)}
                className={cn(
                  'p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
                  'border-2 hover:border-primary/50'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{topic.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {language === 'uz' ? topic.nameUz : topic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                      {language === 'uz' ? topic.descriptionUz : topic.description}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          statusColor === 'success' && 'bg-success/10 text-success',
                          statusColor === 'warning' && 'bg-warning/10 text-warning',
                          statusColor === 'error' && 'bg-error/10 text-error'
                        )}>
                          {statusText}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {topic.progressData.answered}/{topic.progressData.total} {t('questionsCount')}
                        </span>
                      </div>
                      <Progress 
                        value={topic.progressData.percentage} 
                        className={cn(
                          'h-2',
                          statusColor === 'success' && '[&>div]:bg-success',
                          statusColor === 'warning' && '[&>div]:bg-warning',
                          statusColor === 'error' && '[&>div]:bg-error'
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
