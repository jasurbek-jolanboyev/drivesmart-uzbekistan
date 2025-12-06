import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface ExamStartProps {
  onStart: () => void;
}

export function ExamStart({ onStart }: ExamStartProps) {
  const { t, language } = useApp();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('examMode')}</h1>
        <p className="text-muted-foreground">{t('examDescription')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 max-w-lg">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === 'uz' ? 'Imtihonga tayyormisiz?' : 'Готовы к экзамену?'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'uz' 
                  ? 'Haqiqiy imtihon sharoitlarini sinab ko\'ring'
                  : 'Проверьте свои знания в условиях реального экзамена'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-foreground">
                  {language === 'uz' ? '20 daqiqa vaqt' : '20 минут на выполнение'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <span className="text-xl">❓</span>
                <span className="text-foreground">
                  {language === 'uz' ? '20 ta savol' : '20 вопросов'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <span className="text-xl">✅</span>
                <span className="text-foreground">
                  {language === 'uz' ? 'O\'tish uchun 18 ta to\'g\'ri javob' : 'Для сдачи нужно 18 правильных ответов'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg text-left">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <span className="text-sm text-foreground">
                {language === 'uz' 
                  ? 'Oldingi savolga qaytib bo\'lmaydi!'
                  : 'Нельзя вернуться к предыдущему вопросу!'}
              </span>
            </div>

            <Button 
              onClick={onStart}
              size="lg"
              className="w-full gradient-primary text-primary-foreground text-lg h-14"
            >
              {t('startExam')}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
