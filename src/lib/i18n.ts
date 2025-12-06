import { Language } from './types';

export const translations = {
  ru: {
    // Navigation
    dashboard: 'Главная',
    training: 'Тренировка',
    topics: 'Темы',
    exam: 'Экзамен',
    stats: 'Статистика',
    settings: 'Настройки',
    
    // Dashboard
    welcome: 'Добро пожаловать!',
    readyToLearn: 'Готовы к изучению ПДД?',
    quickTraining: 'Быстрая тренировка',
    selectTopic: 'Выбрать тему',
    startExam: 'Начать экзамен',
    overallProgress: 'Общий прогресс',
    weakTopics: 'Слабые темы',
    strongTopics: 'Сильные темы',
    streakDays: 'Дней подряд',
    totalQuestions: 'Всего вопросов',
    correctRate: 'Правильных',
    
    // Training
    question: 'Вопрос',
    of: 'из',
    correct: 'Правильно!',
    incorrect: 'Неправильно',
    explanation: 'Объяснение',
    next: 'Далее',
    finish: 'Завершить',
    sessionComplete: 'Сессия завершена',
    yourResult: 'Ваш результат',
    tryAgain: 'Попробовать снова',
    backToDashboard: 'На главную',
    
    // Topics
    allTopics: 'Все темы',
    questionsCount: 'вопросов',
    mastered: 'Изучено',
    needsPractice: 'Требует практики',
    notStarted: 'Не начато',
    
    // Exam
    examMode: 'Режим экзамена',
    examDescription: '20 вопросов за 20 минут',
    timeLeft: 'Осталось времени',
    examComplete: 'Экзамен завершён',
    passed: 'Сдано!',
    failed: 'Не сдано',
    passThreshold: 'Проходной балл: 18 из 20',
    reviewErrors: 'Разбор ошибок',
    
    // Stats
    yourStatistics: 'Ваша статистика',
    progressOverTime: 'Прогресс по дням',
    topicBreakdown: 'По темам',
    recentSessions: 'Последние сессии',
    noDataYet: 'Пока нет данных',
    
    // Settings
    language: 'Язык',
    timer: 'Таймер',
    questionsPerSessionLabel: 'Вопросов за сессию',
    sound: 'Звук',
    theme: 'Тема',
    resetProgress: 'Сбросить прогресс',
    resetConfirm: 'Вы уверены? Это действие нельзя отменить.',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
  },
  uz: {
    // Navigation
    dashboard: 'Bosh sahifa',
    training: 'Mashg\'ulot',
    topics: 'Mavzular',
    exam: 'Imtihon',
    stats: 'Statistika',
    settings: 'Sozlamalar',
    
    // Dashboard
    welcome: 'Xush kelibsiz!',
    readyToLearn: 'YHQni o\'rganishga tayyormisiz?',
    quickTraining: 'Tez mashg\'ulot',
    selectTopic: 'Mavzuni tanlash',
    startExam: 'Imtihonni boshlash',
    overallProgress: 'Umumiy progress',
    weakTopics: 'Zaif mavzular',
    strongTopics: 'Kuchli mavzular',
    streakDays: 'Kunlar ketma-ket',
    totalQuestions: 'Jami savollar',
    correctRate: 'To\'g\'ri javoblar',
    
    // Training
    question: 'Savol',
    of: 'dan',
    correct: 'To\'g\'ri!',
    incorrect: 'Noto\'g\'ri',
    explanation: 'Tushuntirish',
    next: 'Keyingi',
    finish: 'Tugatish',
    sessionComplete: 'Mashg\'ulot tugadi',
    yourResult: 'Sizning natijangiz',
    tryAgain: 'Qayta urinish',
    backToDashboard: 'Bosh sahifaga',
    
    // Topics
    allTopics: 'Barcha mavzular',
    questionsCount: 'ta savol',
    mastered: 'O\'zlashtirildi',
    needsPractice: 'Mashq kerak',
    notStarted: 'Boshlanmagan',
    
    // Exam
    examMode: 'Imtihon rejimi',
    examDescription: '20 daqiqada 20 ta savol',
    timeLeft: 'Qolgan vaqt',
    examComplete: 'Imtihon tugadi',
    passed: 'O\'tdingiz!',
    failed: 'O\'tmadingiz',
    passThreshold: 'O\'tish bali: 20 dan 18',
    reviewErrors: 'Xatolarni tahlil qilish',
    
    // Stats
    yourStatistics: 'Sizning statistikangiz',
    progressOverTime: 'Kunlar bo\'yicha progress',
    topicBreakdown: 'Mavzular bo\'yicha',
    recentSessions: 'So\'nggi mashg\'ulotlar',
    noDataYet: 'Hozircha ma\'lumot yo\'q',
    
    // Settings
    language: 'Til',
    timer: 'Taymer',
    questionsPerSessionLabel: 'Mashg\'ulotdagi savollar soni',
    sound: 'Ovoz',
    theme: 'Mavzu',
    resetProgress: 'Progressni tiklash',
    resetConfirm: 'Ishonchingiz komilmi? Bu amalni bekor qilib bo\'lmaydi.',
    
    // Common
    loading: 'Yuklanmoqda...',
    error: 'Xato',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    confirm: 'Tasdiqlash',
    yes: 'Ha',
    no: 'Yo\'q',
  },
};

export const useTranslation = (language: Language) => {
  return (key: keyof typeof translations.ru): string => {
    return translations[language][key] || translations.ru[key] || key;
  };
};
