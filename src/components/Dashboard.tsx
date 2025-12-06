import { motion } from 'framer-motion';
import { Play, BookOpen, GraduationCap, Flame, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { topics, questions } from '@/lib/data';
import { calculateTopicProgress } from '@/lib/spacedRepetition';

interface DashboardProps {
  onStartTraining: () => void;
  onSelectTopics: () => void;
  onStartExam: () => void;
}

export function Dashboard({ onStartTraining, onSelectTopics, onStartExam }: DashboardProps) {
  const { t, progress, stats, language } = useApp();

  // Calculate overall progress
  const totalProgress = topics.reduce((acc, topic) => {
    const { percentage } = calculateTopicProgress(topic.id, questions, progress);
    return acc + percentage;
  }, 0) / topics.length;

  // Get weak and strong topics
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t('welcome')} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('readyToLearn')}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button
          onClick={onStartTraining}
          className="h-auto py-6 px-6 gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Play className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">{t('quickTraining')}</div>
              <div className="text-primary-foreground/80 text-sm">20 {t('question').toLowerCase()}</div>
            </div>
          </div>
        </Button>

        <Button
          onClick={onSelectTopics}
          variant="outline"
          className="h-auto py-6 px-6 bg-card border-2 border-border hover:border-primary hover:bg-secondary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground">{t('selectTopic')}</div>
              <div className="text-muted-foreground text-sm">{topics.length} {t('topics').toLowerCase()}</div>
            </div>
          </div>
        </Button>

        <Button
          onClick={onStartExam}
          variant="outline"
          className="h-auto py-6 px-6 bg-card border-2 border-border hover:border-success hover:bg-secondary transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-success" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground">{t('startExam')}</div>
              <div className="text-muted-foreground text-sm">20 мин</div>
            </div>
          </div>
        </Button>
      </motion.div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-card">
            <h3 className="font-semibold text-lg mb-4 text-foreground">{t('overallProgress')}</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${totalProgress * 2.51} 251`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{Math.round(totalProgress)}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-warning" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t('streakDays')}</div>
                    <div className="font-semibold text-foreground">{stats.streakDays}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t('totalQuestions')}</div>
                    <div className="font-semibold text-foreground">{stats.totalQuestions}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t('correctRate')}</div>
                    <div className="font-semibold text-foreground">{correctRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Topics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <Card className="p-4 border-error/20 bg-error/5">
              <h4 className="font-medium text-error mb-3 flex items-center gap-2">
                <span>⚠️</span> {t('weakTopics')}
              </h4>
              <div className="space-y-2">
                {weakTopics.map(topic => (
                  <div key={topic.id} className="flex items-center gap-3">
                    <span className="text-xl">{topic.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {language === 'uz' ? topic.nameUz : topic.name}
                      </div>
                      <Progress value={topic.progress.percentage} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-sm text-error font-medium">{topic.progress.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Strong Topics */}
          {strongTopics.length > 0 && (
            <Card className="p-4 border-success/20 bg-success/5">
              <h4 className="font-medium text-success mb-3 flex items-center gap-2">
                <span>✨</span> {t('strongTopics')}
              </h4>
              <div className="space-y-2">
                {strongTopics.map(topic => (
                  <div key={topic.id} className="flex items-center gap-3">
                    <span className="text-xl">{topic.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {language === 'uz' ? topic.nameUz : topic.name}
                      </div>
                      <Progress value={topic.progress.percentage} className="h-1.5 mt-1 [&>div]:bg-success" />
                    </div>
                    <span className="text-sm text-success font-medium">{topic.progress.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {weakTopics.length === 0 && strongTopics.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">{t('noDataYet')}</p>
              <p className="text-sm text-muted-foreground mt-1">
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
