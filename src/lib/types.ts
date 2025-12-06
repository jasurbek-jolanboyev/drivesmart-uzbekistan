export interface Topic {
  id: string;
  name: string;
  nameUz: string;
  icon: string;
  description: string;
  descriptionUz: string;
}

export interface BaseQuestion {
  id: string;
  topicId: string;
  question: string;
  questionUz: string;
  options: string[];
  optionsUz: string[];
  correctIndex: number;
  explanation: string;
  explanationUz: string;
}

export interface UserProgress {
  questionId: string;
  correctCount: number;
  wrongCount: number;
  lastAsked: string;
  nextReviewDate: string;
  confidenceLevel: number;
}

export interface TopicProgress {
  topicId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  confidenceLevel: number;
}

export interface Session {
  date: string;
  questionsAsked: number;
  correctAnswers: number;
  topics: string[];
  duration: number;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  streakDays: number;
  lastActiveDate: string;
  sessions: Session[];
  achievements: string[];
}

export interface Settings {
  language: 'ru' | 'uz';
  timerEnabled: boolean;
  questionsPerSession: number;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export type Language = 'ru' | 'uz';
