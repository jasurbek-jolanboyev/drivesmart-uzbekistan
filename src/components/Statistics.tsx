import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { topics, questions } from '@/lib/data';
import { calculateTopicProgress } from '@/lib/spacedRepetition';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Statistics() {
  const { t, stats, progress, language } = useApp();

  // Prepare chart data from sessions
  const chartData = stats.sessions
    .slice(0, 14)
    .reverse()
    .map(session => ({
      date: new Date(session.date).toLocaleDateString(language === 'uz' ? 'uz' : 'ru', { 
        month: 'short', 
        day: 'numeric' 
      }),
      correct: session.correctAnswers,
      total: session.questionsAsked,
      rate: Math.round((session.correctAnswers / session.questionsAsked) * 100),
    }));

  // Calculate topic breakdown
  const topicBreakdown = topics.map(topic => ({
    ...topic,
    progressData: calculateTopicProgress(topic.id, questions, progress),
  })).sort((a, b) => b.progressData.percentage - a.progressData.percentage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('yourStatistics')}</h1>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary">{stats.totalQuestions}</div>
          <div className="text-sm text-muted-foreground">{t('totalQuestions')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-success">{stats.correctAnswers}</div>
          <div className="text-sm text-muted-foreground">{t('correct')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-warning">{stats.streakDays}</div>
          <div className="text-sm text-muted-foreground">{t('streakDays')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-foreground">
            {stats.totalQuestions > 0 
              ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
              : 0}%
          </div>
          <div className="text-sm text-muted-foreground">{t('correctRate')}</div>
        </Card>
      </motion.div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-foreground">{t('progressOverTime')}</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {t('noDataYet')}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Topic Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-foreground">{t('topicBreakdown')}</h3>
          <div className="space-y-4">
            {topicBreakdown.map(topic => (
              <div key={topic.id} className="flex items-center gap-4">
                <span className="text-2xl w-10">{topic.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {language === 'uz' ? topic.nameUz : topic.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {topic.progressData.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${topic.progressData.percentage}%`,
                        backgroundColor: topic.progressData.percentage >= 80 
                          ? 'hsl(var(--success))' 
                          : topic.progressData.percentage >= 50 
                            ? 'hsl(var(--warning))' 
                            : 'hsl(var(--error))'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-foreground">{t('recentSessions')}</h3>
          {stats.sessions.length > 0 ? (
            <div className="space-y-3">
              {stats.sessions.slice(0, 5).map((session, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {new Date(session.date).toLocaleDateString(language === 'uz' ? 'uz' : 'ru', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(session.duration / 60)} мин
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {session.correctAnswers}/{session.questionsAsked}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((session.correctAnswers / session.questionsAsked) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('noDataYet')}</p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
