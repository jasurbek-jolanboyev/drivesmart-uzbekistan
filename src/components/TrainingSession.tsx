import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { questions, topics } from '@/lib/data';
import { selectQuestionsForSession, calculateNextReview } from '@/lib/spacedRepetition';
import { BaseQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrainingSessionProps {
  topicId?: string;
  isExam?: boolean;
  onClose: () => void;
}

export function TrainingSession({ topicId, isExam = false, onClose }: TrainingSessionProps) {
  const { t, settings, progress, setProgress, stats, setStats, language } = useApp();
  
  const [sessionQuestions, setSessionQuestions] = useState<BaseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isExam ? 20 * 60 : 0); // 20 minutes for exam
  const [startTime] = useState(Date.now());

  // Initialize session
  useEffect(() => {
    const count = isExam ? 20 : settings.questionsPerSession;
    const selected = selectQuestionsForSession(questions, progress, count, topicId);
    setSessionQuestions(selected);
  }, [topicId, isExam, settings.questionsPerSession, progress]);

  // Timer for exam mode
  useEffect(() => {
    if (!isExam || isComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExam, isComplete]);

  const currentQuestion = sessionQuestions[currentIndex];
  const progressPercent = sessionQuestions.length > 0 
    ? ((currentIndex + (showResult ? 1 : 0)) / sessionQuestions.length) * 100 
    : 0;

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    
    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));

    // Update progress with spaced repetition
    const currentProgress = progress[currentQuestion.id];
    const updates = calculateNextReview(currentProgress, isCorrect);
    
    setProgress(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        ...currentProgress,
        ...updates,
      },
    }));

    // Confetti for correct answer
    if (isCorrect && settings.soundEnabled) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
    }
  }, [currentQuestion, showResult, progress, setProgress, settings.soundEnabled]);

  const handleNext = useCallback(() => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Session complete
      setIsComplete(true);
      
      // Update global stats
      const duration = Math.round((Date.now() - startTime) / 1000);
      const today = new Date().toDateString();
      const lastActive = stats.lastActiveDate;
      
      let newStreak = stats.streakDays;
      if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActive === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + sessionQuestions.length,
        correctAnswers: prev.correctAnswers + sessionStats.correct + (selectedAnswer === currentQuestion?.correctIndex ? 1 : 0),
        streakDays: newStreak,
        lastActiveDate: today,
        sessions: [
          {
            date: new Date().toISOString(),
            questionsAsked: sessionQuestions.length,
            correctAnswers: sessionStats.correct + (selectedAnswer === currentQuestion?.correctIndex ? 1 : 0),
            topics: [...new Set(sessionQuestions.map(q => q.topicId))],
            duration,
          },
          ...prev.sessions.slice(0, 49),
        ],
      }));

      // Celebration confetti for good performance
      if ((sessionStats.correct / sessionQuestions.length) >= 0.8) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
        });
      }
    }
  }, [currentIndex, sessionQuestions, sessionStats, startTime, stats, setStats, selectedAnswer, currentQuestion]);

  const handleRestart = () => {
    const count = isExam ? 20 : settings.questionsPerSession;
    const selected = selectQuestionsForSession(questions, progress, count, topicId);
    setSessionQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setIsComplete(false);
    if (isExam) setTimeLeft(20 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  const topic = topicId ? topics.find(t => t.id === topicId) : null;
  const finalScore = sessionStats.correct + (showResult && selectedAnswer === currentQuestion?.correctIndex ? 1 : 0);
  const passedExam = isExam && finalScore >= 18;

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {topic && <span className="text-2xl">{topic.icon}</span>}
          <div>
            <h2 className="font-semibold text-foreground">
              {isExam ? t('examMode') : t('training')}
              {topic && ` • ${language === 'uz' ? topic.nameUz : topic.name}`}
            </h2>
            {!isComplete && (
              <p className="text-sm text-muted-foreground">
                {t('question')} {currentIndex + 1} {t('of')} {sessionQuestions.length}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExam && !isComplete && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium',
              timeLeft < 60 ? 'bg-error/10 text-error' : 'bg-secondary text-foreground'
            )}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {!isComplete && (
        <Progress value={progressPercent} className="h-2 mb-6" />
      )}

      <AnimatePresence mode="wait">
        {isComplete ? (
          /* Results Screen */
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center mb-6',
              isExam 
                ? (passedExam ? 'bg-success/10' : 'bg-error/10')
                : (finalScore / sessionQuestions.length >= 0.7 ? 'bg-success/10' : 'bg-warning/10')
            )}>
              {isExam ? (
                passedExam 
                  ? <CheckCircle2 className="w-12 h-12 text-success" />
                  : <XCircle className="w-12 h-12 text-error" />
              ) : (
                <span className="text-4xl">{finalScore / sessionQuestions.length >= 0.7 ? '🎉' : '💪'}</span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isExam 
                ? (passedExam ? t('passed') : t('failed'))
                : t('sessionComplete')}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {t('yourResult')}: {finalScore} / {sessionQuestions.length}
            </p>

            {isExam && (
              <p className="text-sm text-muted-foreground mb-6">
                {t('passThreshold')}
              </p>
            )}

            {/* Score breakdown */}
            <div className="flex gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div className="font-bold text-2xl text-foreground">{finalScore}</div>
                <div className="text-sm text-muted-foreground">{t('correct')}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-2">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
                <div className="font-bold text-2xl text-foreground">{sessionQuestions.length - finalScore}</div>
                <div className="text-sm text-muted-foreground">{t('incorrect')}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleRestart} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t('tryAgain')}
              </Button>
              <Button onClick={onClose} className="gap-2 gradient-primary text-primary-foreground">
                <Home className="w-4 h-4" />
                {t('backToDashboard')}
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Question Card */
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8 shadow-card mb-6">
              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                {language === 'uz' ? currentQuestion.questionUz : currentQuestion.question}
              </p>
            </Card>

            {/* Answer Options */}
            <div className="space-y-3">
              {(language === 'uz' ? currentQuestion.optionsUz : currentQuestion.options).map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctIndex;
                const showCorrectness = showResult;
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      'w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200',
                      'hover:border-primary/50 hover:bg-secondary/50',
                      !showCorrectness && 'border-border bg-card',
                      showCorrectness && isCorrect && 'border-success bg-success/10',
                      showCorrectness && isSelected && !isCorrect && 'border-error bg-error/10 animate-shake',
                      !showCorrectness && isSelected && 'border-primary bg-primary/5'
                    )}
                    whileTap={!showResult ? { scale: 0.98 } : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                        !showCorrectness && 'bg-secondary text-foreground',
                        showCorrectness && isCorrect && 'bg-success text-success-foreground',
                        showCorrectness && isSelected && !isCorrect && 'bg-error text-error-foreground'
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-foreground font-medium flex-1">{option}</span>
                      {showCorrectness && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-error" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <Card className={cn(
                    'p-5 border-2',
                    selectedAnswer === currentQuestion.correctIndex 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-error/30 bg-error/5'
                  )}>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctIndex 
                        ? <CheckCircle2 className="w-5 h-5 text-success" />
                        : <XCircle className="w-5 h-5 text-error" />}
                      {selectedAnswer === currentQuestion.correctIndex ? t('correct') : t('incorrect')}
                    </h4>
                    <p className="text-muted-foreground">
                      {language === 'uz' ? currentQuestion.explanationUz : currentQuestion.explanation}
                    </p>
                  </Card>

                  <Button 
                    onClick={handleNext} 
                    className="w-full mt-4 gradient-primary text-primary-foreground h-12 text-lg"
                  >
                    {currentIndex < sessionQuestions.length - 1 ? (
                      <>
                        {t('next')} <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      t('finish')
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
