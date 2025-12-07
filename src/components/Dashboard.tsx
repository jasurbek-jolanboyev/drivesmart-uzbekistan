import { motion } from 'framer-motion';
import { Play, BookOpen, GraduationCap, Flame, Target, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { topics, questions } from '@/lib/data';
import { calculateTopicProgress } from '@/lib/spacedRepetition';
import { TopicIcon } from './TopicIcon';
import { cn } from '@/lib/utils';

interface DashboardProps {
  onStartTraining: () => void;
  onSelectTopics: () => void;
  onStartExam: () => void;
}

export function Dashboard({ onStartTraining, onSelectTopics, onStartExam }: DashboardProps) {
  const { t, progress, stats, language } = useApp();

  const totalProgress = topics.reduce((acc, topic) => {
    const { percentage } = calculateTopicProgress(topic.id, questions, progress);
    return acc + percentage;
  }, 0) / topics.length;

  const topicsWithProgress = topics.map(topic => ({
    ...topic,
    progress: calculateTopicProgress(topic.id, questions, progress),
  }));

  const weakTopics = topicsWithProgress
    .filter(t => t.progress.percentage < 50 && t.progress.answered > 0)
    .slice(0, 3);

  const strongTopics = topicsWithProgress
    .filter(t => t.progress.percentage >= 80)
    .slice(0, 3);

  const correctRate = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pt-1"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          {t('welcome')}
        </h1>
        <p className="text-muted-foreground text-base mt-1">
          {t('readyToLearn')}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <motion.button
          onClick={onStartTraining}
          className="group relative flex items-center gap-4 p-4 rounded-2xl bg-primary text-primary-foreground transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-11 h-11 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
            <Play className="w-5 h-5" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-[15px]">{t('quickTraining')}</div>
            <div className="text-primary-foreground/70 text-sm">20 {t('question').toLowerCase()}</div>
          </div>
          <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
        </motion.button>

        <motion.button
          onClick={onSelectTopics}
          className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-[15px] text-foreground">{t('selectTopic')}</div>
            <div className="text-muted-foreground text-sm">{topics.length} {t('topics').toLowerCase()}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
        </motion.button>

        <motion.button
          onClick={onStartExam}
          className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 transition-all duration-300 hover:border-success/40 hover:bg-success/5"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-11 h-11 rounded-xl bg-success/8 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-success" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-[15px] text-foreground">{t('startExam')}</div>
            <div className="text-muted-foreground text-sm">20 мин</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
        </motion.button>
      </motion.div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="p-5">
            <h3 className="font-medium text-base mb-4 text-foreground">{t('overallProgress')}</h3>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${totalProgress * 2.51} 251`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold text-foreground">{Math.round(totalProgress)}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{t('streakDays')}</div>
                    <div className="font-semibold text-foreground">{stats.streakDays}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{t('totalQuestions')}</div>
                    <div className="font-semibold text-foreground">{stats.totalQuestions}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{t('correctRate')}</div>
                    <div className="font-semibold text-foreground">{correctRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Topics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-3"
        >
          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <Card className="p-4 border-error/20 bg-error/[0.03]">
              <h4 className="font-medium text-sm text-error mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t('weakTopics')}
              </h4>
              <div className="space-y-2.5">
                {weakTopics.map(topic => (
                  <div key={topic.id} className="flex items-center gap-3">
                    <TopicIcon icon={topic.icon} size="sm" variant="error" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {language === 'uz' ? topic.nameUz : topic.name}
                      </div>
                      <Progress value={topic.progress.percentage} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-sm text-error font-medium tabular-nums">{topic.progress.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Strong Topics */}
          {strongTopics.length > 0 && (
            <Card className="p-4 border-success/20 bg-success/[0.03]">
              <h4 className="font-medium text-sm text-success mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('strongTopics')}
              </h4>
              <div className="space-y-2.5">
                {strongTopics.map(topic => (
                  <div key={topic.id} className="flex items-center gap-3">
                    <TopicIcon icon={topic.icon} size="sm" variant="success" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {language === 'uz' ? topic.nameUz : topic.name}
                      </div>
                      <Progress value={topic.progress.percentage} className="h-1.5 mt-1 [&>div]:bg-success" />
                    </div>
                    <span className="text-sm text-success font-medium tabular-nums">{topic.progress.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {weakTopics.length === 0 && strongTopics.length === 0 && (
            <Card className="p-5 text-center">
              <p className="text-muted-foreground text-sm">{t('noDataYet')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'uz' 
                  ? 'Mashg\'ulotni boshlang!' 
                  : 'Начните тренировку!'}
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
