import { describe, it, expect } from "vitest";
import { scoreQuiz, computeQuizOutcome } from "@/lib/quizScoring";
import type { QuizQuestion } from "@/lib/lessons-data";

function makeQuiz(correctLetters: QuizQuestion["correct"][]): QuizQuestion[] {
  return correctLetters.map((correct, i) => ({
    q: `Question ${i}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct,
    explanation: `Explanation ${i}`,
  }));
}

describe("scoreQuiz", () => {
  it("scores all-correct answers as a perfect score", () => {
    const quiz = makeQuiz(["A", "B", "C", "D"]);
    const { score, review } = scoreQuiz(quiz, [0, 1, 2, 3]);
    expect(score).toBe(4);
    expect(review.every((r) => r.wasCorrect)).toBe(true);
  });

  it("scores all-wrong answers as zero", () => {
    const quiz = makeQuiz(["A", "A", "A", "A"]);
    const { score } = scoreQuiz(quiz, [1, 2, 3, 1]);
    expect(score).toBe(0);
  });

  it("treats a null answer as unanswered, not correct", () => {
    const quiz = makeQuiz(["A"]);
    const { score, review } = scoreQuiz(quiz, [null]);
    expect(score).toBe(0);
    expect(review[0]?.yourAnswer).toBe("No answer");
    expect(review[0]?.wasCorrect).toBe(false);
  });

  it("treats a missing answer index (shorter submission) the same as null", () => {
    const quiz = makeQuiz(["A", "B"]);
    const { score } = scoreQuiz(quiz, [0]); // second answer omitted entirely
    expect(score).toBe(1);
  });

  it("reports the correct answer text regardless of what the user picked", () => {
    const quiz = makeQuiz(["C"]);
    const { review } = scoreQuiz(quiz, [0]);
    expect(review[0]?.correctAnswer).toBe("Option C");
    expect(review[0]?.yourAnswer).toBe("Option A");
  });
});

describe("computeQuizOutcome", () => {
  it("passes at exactly the pass threshold (8/10)", () => {
    const outcome = computeQuizOutcome({ score: 8, existingAttempts: 0 });
    expect(outcome.pass).toBe(true);
  });

  it("fails just below the pass threshold", () => {
    const outcome = computeQuizOutcome({ score: 7, existingAttempts: 0 });
    expect(outcome.pass).toBe(false);
  });

  it("does not increment attempts on a pass", () => {
    const outcome = computeQuizOutcome({ score: 10, existingAttempts: 1 });
    expect(outcome.nextAttempts).toBe(1);
  });

  it("increments attempts on a fail", () => {
    const outcome = computeQuizOutcome({ score: 3, existingAttempts: 1 });
    expect(outcome.nextAttempts).toBe(2);
  });

  it("triggers cooldown once max attempts is reached on a fail", () => {
    const outcome = computeQuizOutcome({ score: 3, existingAttempts: 2 }); // 3rd failed attempt
    expect(outcome.nextAttempts).toBe(3);
    expect(outcome.shouldCooldown).toBe(true);
  });

  it("does not trigger cooldown before max attempts", () => {
    const outcome = computeQuizOutcome({ score: 3, existingAttempts: 1 }); // 2nd failed attempt
    expect(outcome.shouldCooldown).toBe(false);
  });

  it("never triggers cooldown on a pass, no matter the prior attempt count", () => {
    const outcome = computeQuizOutcome({ score: 9, existingAttempts: 5 });
    expect(outcome.shouldCooldown).toBe(false);
  });
});
