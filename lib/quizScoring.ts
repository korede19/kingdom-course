import { correctIndex, type QuizQuestion } from "@/lib/lessons-data";
import { PASS_THRESHOLD, MAX_ATTEMPTS } from "@/lib/progress";

export type QuizReviewItem = {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  wasCorrect: boolean;
  explanation: string;
};

/** Pure scoring: no DB, no session — safe to unit test directly. */
export function scoreQuiz(
  quiz: QuizQuestion[],
  submittedAnswers: (number | null)[],
): { score: number; review: QuizReviewItem[] } {
  let score = 0;
  const review: QuizReviewItem[] = quiz.map((question, i) => {
    const correctIdx = correctIndex(question);
    const yourIdx = submittedAnswers[i] ?? null;
    const wasCorrect = yourIdx === correctIdx;
    if (wasCorrect) score++;
    return {
      question: question.q,
      yourAnswer: yourIdx === null ? "No answer" : question.options[yourIdx],
      correctAnswer: question.options[correctIdx],
      wasCorrect,
      explanation: question.explanation,
    };
  });
  return { score, review };
}

export type QuizOutcomeInput = {
  score: number;
  existingAttempts: number;
};

export type QuizOutcome = {
  pass: boolean;
  nextAttempts: number;
  shouldCooldown: boolean;
};

/** Pure derivation of pass/attempts/cooldown state from a score and prior attempt count. */
export function computeQuizOutcome({ score, existingAttempts }: QuizOutcomeInput): QuizOutcome {
  const pass = score >= PASS_THRESHOLD;
  const nextAttempts = pass ? existingAttempts : existingAttempts + 1;
  const shouldCooldown = !pass && nextAttempts >= MAX_ATTEMPTS;
  return { pass, nextAttempts, shouldCooldown };
}
