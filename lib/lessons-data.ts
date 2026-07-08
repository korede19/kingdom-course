import "server-only";
import lessonsJson from "@/lib/data/lessons.json";
import { LESSON_COUNT } from "@/lib/constants";

export type ContentBlock =
  | { t: "p"; text: string }
  | { t: "quote"; text: string }
  | { t: "cite"; text: string };

export type LessonPart = {
  heading: string;
  content: ContentBlock[];
};

export type QuizQuestion = {
  q: string;
  options: string[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
};

export type Lesson = {
  num: number;
  title: string;
  badge: string;
  teaser: string;
  wordBefore: ContentBlock[];
  objectives: string[];
  parts: LessonPart[];
  reflectionQs: string[];
  quiz: QuizQuestion[];
  closingQuote: string;
  closingRef: string;
};

/** Everything except quiz answers/explanations — safe to send to a client component. */
export type PublicQuizQuestion = { q: string; options: string[] };
export type PublicLesson = Omit<Lesson, "quiz"> & { quiz: PublicQuizQuestion[] };

export const LESSONS = lessonsJson as Lesson[];

if (LESSONS.length !== LESSON_COUNT) {
  throw new Error(`Expected ${LESSON_COUNT} lessons, found ${LESSONS.length}`);
}

export function getLesson(num: number): Lesson | undefined {
  return LESSONS.find((l) => l.num === num);
}

/** Strips correct answers/explanations before the data reaches a client component. */
export function toPublicLesson(lesson: Lesson): PublicLesson {
  return {
    ...lesson,
    quiz: lesson.quiz.map(({ q, options }) => ({ q, options })),
  };
}

const LETTER_TO_INDEX: Record<QuizQuestion["correct"], number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

export function correctIndex(question: QuizQuestion): number {
  return LETTER_TO_INDEX[question.correct];
}
