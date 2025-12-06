import { motion } from 'framer-motion';
import { Globe, Clock, Volume2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function SettingsPanel() {
  const { t, settings, setSettings, setProgress, setStats, language } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLanguageChange = (value: 'ru' | 'uz') => {
    setSettings(prev => ({ ...prev, language: value }));
  };

  const handleTimerToggle = () => {
    setSettings(prev => ({ ...prev, timerEnabled: !prev.timerEnabled }));
  };

  const handleSoundToggle = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleQuestionsChange = (value: string) => {
    setSettings(prev => ({ ...prev, questionsPerSession: parseInt(value) }));
  };

  const handleResetProgress = () => {
    setProgress({});
    setStats({
      totalQuestions: 0,
      correctAnswers: 0,
      streakDays: 0,
      lastActiveDate: '',
      sessions: [],
      achievements: [],
    });
    setShowResetConfirm(false);
    toast({
      title: language === 'uz' ? 'Progress tozalandi' : 'Прогресс сброшен',
      description: language === 'uz' 
        ? 'Barcha ma\'lumotlar o\'chirildi' 
        : 'Все данные были удалены',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings')}</h1>
      </motion.div>

      <div className="space-y-4 max-w-lg">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">{t('language')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uz' ? 'Interfeys tilini tanlang' : 'Выберите язык интерфейса'}
                  </p>
                </div>
              </div>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                  <SelectItem value="uz">🇺🇿 O'zbekcha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">{t('timer')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uz' 
                      ? 'Mashg\'ulot uchun taymer' 
                      : 'Таймер для тренировок'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.timerEnabled} 
                onCheckedChange={handleTimerToggle}
              />
            </div>
          </Card>
        </motion.div>

        {/* Sound */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">{t('sound')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uz' 
                      ? 'Ovoz effektlari va animatsiyalar' 
                      : 'Звуковые эффекты и анимации'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.soundEnabled} 
                onCheckedChange={handleSoundToggle}
              />
            </div>
          </Card>
        </motion.div>

        {/* Questions per session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-foreground">
                  {t('questionsPerSessionLabel')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' 
                    ? 'Bitta mashg\'ulotda savollar soni' 
                    : 'Количество вопросов в одной сессии'}
                </p>
              </div>
              <Select 
                value={settings.questionsPerSession.toString()} 
                onValueChange={handleQuestionsChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Reset Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 border-error/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-error" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">{t('resetProgress')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uz' 
                      ? 'Barcha progressni o\'chirish' 
                      : 'Удалить весь прогресс'}
                  </p>
                </div>
              </div>
              {!showResetConfirm ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                >
                  {t('resetProgress')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleResetProgress}
                  >
                    {t('confirm')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
