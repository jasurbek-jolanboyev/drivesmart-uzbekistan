import { UserProgress, BaseQuestion } from './types';

export function calculateNextReview(
  currentProgress: UserProgress | undefined,
  isCorrect: boolean
): Partial<UserProgress> {
  const now = new Date();
  
  if (!currentProgress) {
    return {
      correctCount: isCorrect ? 1 : 0,
      wrongCount: isCorrect ? 0 : 1,
      lastAsked: now.toISOString(),
      nextReviewDate: isCorrect 
        ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // 1 day
        : new Date(now.getTime() + 10 * 60 * 1000).toISOString(), // 10 minutes
      confidenceLevel: isCorrect ? 10 : 0,
    };
  }

  if (isCorrect) {
    const newConfidence = Math.min(100, currentProgress.confidenceLevel + 10);
    const daysUntilReview = newConfidence / 10;
    return {
      correctCount: currentProgress.correctCount + 1,
      wrongCount: currentProgress.wrongCount,
      lastAsked: now.toISOString(),
      nextReviewDate: new Date(now.getTime() + daysUntilReview * 24 * 60 * 60 * 1000).toISOString(),
      confidenceLevel: newConfidence,
    };
  } else {
    const newConfidence = Math.max(0, Math.floor(currentProgress.confidenceLevel / 2));
    return {
      correctCount: currentProgress.correctCount,
      wrongCount: currentProgress.wrongCount + 1,
      lastAsked: now.toISOString(),
      nextReviewDate: new Date(now.getTime() + 10 * 60 * 1000).toISOString(), // 10 minutes
      confidenceLevel: newConfidence,
    };
  }
}

export function getQuestionPriority(
  question: BaseQuestion,
  progress: Record<string, UserProgress>
): number {
  const questionProgress = progress[question.id];
  
  if (!questionProgress) {
    return 100; // New questions have high priority
  }
  
  const now = new Date();
  const nextReview = new Date(questionProgress.nextReviewDate);
  
  if (now >= nextReview) {
    // Question is due for review
    const overdue = (now.getTime() - nextReview.getTime()) / (1000 * 60 * 60); // hours overdue
    return 50 + Math.min(50, overdue);
  }
  
  // Lower confidence = higher priority
  return 100 - questionProgress.confidenceLevel;
}

export function selectQuestionsForSession(
  questions: BaseQuestion[],
  progress: Record<string, UserProgress>,
  count: number,
  topicId?: string
): BaseQuestion[] {
  let filteredQuestions = topicId 
    ? questions.filter(q => q.topicId === topicId)
    : questions;
  
  // Calculate priorities
  const questionsWithPriority = filteredQuestions.map(q => ({
    question: q,
    priority: getQuestionPriority(q, progress),
  }));
  
  // Sort by priority (highest first)
  questionsWithPriority.sort((a, b) => b.priority - a.priority);
  
  // Take top N questions with some randomization
  const topQuestions = questionsWithPriority.slice(0, Math.min(count * 2, questionsWithPriority.length));
  
  // Shuffle and take required count
  const shuffled = topQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(q => q.question);
}

export function calculateTopicProgress(
  topicId: string,
  questions: BaseQuestion[],
  progress: Record<string, UserProgress>
): { percentage: number; answered: number; total: number } {
  const topicQuestions = questions.filter(q => q.topicId === topicId);
  const total = topicQuestions.length;
  
  if (total === 0) return { percentage: 0, answered: 0, total: 0 };
  
  let answeredCorrectly = 0;
  let answeredCount = 0;
  
  topicQuestions.forEach(q => {
    const p = progress[q.id];
    if (p) {
      answeredCount++;
      if (p.confidenceLevel >= 50) {
        answeredCorrectly++;
      }
    }
  });
  
  const percentage = Math.round((answeredCorrectly / total) * 100);
  return { percentage, answered: answeredCount, total };
}
