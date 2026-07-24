"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { submitQuizAction } from "@/actions/progress";
import type { QuizReviewItem } from "@/lib/quizScoring";
import type { PublicQuizQuestion } from "@/lib/lessons-data";
import { Icon } from "@/components/Icon";
import styles from "./QuizClient.module.css";

type Mode = "cooldown" | "quiz" | "results";

type ResultData = {
  score: number;
  total: number;
  pass: boolean;
  badgeAwarded: boolean;
  courseComplete: boolean;
  review: QuizReviewItem[];
  attemptsLeft: number;
};

export function QuizClient({
  lessonNum,
  questions,
  initialCooldownSeconds,
  initialAttemptsLeft,
  isFinalLesson,
}: {
  lessonNum: number;
  questions: PublicQuizQuestion[];
  initialCooldownSeconds: number;
  initialAttemptsLeft: number;
  isFinalLesson: boolean;
}) {
  const [mode, setMode] = useState<Mode>(initialCooldownSeconds > 0 ? "cooldown" : "quiz");
  const [cooldownSeconds, setCooldownSeconds] = useState(initialCooldownSeconds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttemptsLeft);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((s) => {
        if (s <= 1) {
          setMode((m) => (m === "cooldown" ? "quiz" : m));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const total = questions.length;
  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  function selectOption(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const res = await submitQuizAction(lessonNum, answers);
      if (!res.ok) {
        setError(res.error);
        if (res.cooldownSeconds > 0) {
          setCooldownSeconds(res.cooldownSeconds);
          setMode("cooldown");
        }
        return;
      }
      setResult(res);
      setAttemptsLeft(res.attemptsLeft);
      if (!res.pass && res.cooldownSeconds > 0) setCooldownSeconds(res.cooldownSeconds);
      setMode("results");
    });
  }

  function handleRetry() {
    setAnswers(Array(total).fill(null));
    setCurrentIndex(0);
    setResult(null);
    setError(null);
    setMode("quiz");
  }

  const dots = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        if (i === currentIndex) return "current";
        if (answers[i] !== null) return "answered";
        return "upcoming";
      }),
    [answers, currentIndex, total],
  );

  if (mode === "cooldown") {
    return (
      <div className={styles.wrap}>
        <div className={styles.cooldownPanel}>
          <div className={styles.cooldownIcon}>
            <Icon name="clock" size={40} color="#D2823C" />
          </div>
          <h2 className={styles.cooldownTitle}>Take a short breather</h2>
          <p className={styles.cooldownText}>
            You&rsquo;ve used your attempts for now. Reread the lesson, then come back — the quiz will reopen in:
          </p>
          <div className={styles.cooldownTimer}>{cooldownSeconds}s</div>
          <Link href={`/course/${lessonNum}`} className={styles.reviewLessonButton}>
            Review the Lesson
          </Link>
        </div>
      </div>
    );
  }

  if (mode === "results" && result) {
    return (
      <div className={styles.wrap}>
        <div className={result.pass ? styles.resultPanelPass : styles.resultPanelFail}>
          <div className={styles.resultIcon}>
            <Icon name={result.pass ? "star" : "book"} size={40} color={result.pass ? "#A85F1E" : "#C43E2E"} />
          </div>
          <div className={styles.resultScore}>
            {result.score} / {result.total}
          </div>
          <div className={result.pass ? styles.resultHeadlinePass : styles.resultHeadlineFail}>
            {result.pass ? "Well done — you passed!" : "Not quite there yet"}
          </div>
          <div className={styles.resultSubtext}>
            {result.pass
              ? "You've earned your badge for this lesson."
              : "You need at least 8 of 10 correct to pass. Review the lesson and try again."}
          </div>

          {result.pass && result.badgeAwarded ? (
            <div className={styles.badgeEarned}>
              <div className={styles.badgeEarnedIcon}>
                <Icon name="certificate" size={20} color="#F2C99B" />
              </div>
              <div>
                <div className={styles.badgeEarnedLabel}>Badge Earned</div>
              </div>
            </div>
          ) : null}
        </div>

        {result.pass ? (
          <div className={styles.actionsRow}>
            <Link href="/course" className={styles.secondaryAction}>
              Progress Map
            </Link>
            {result.courseComplete ? (
              <Link href="/certificate" className={styles.primaryActionGold}>
                View Your Certificate →
              </Link>
            ) : isFinalLesson ? (
              <Link href="/course" className={styles.primaryAction}>
                Back to Progress Map
              </Link>
            ) : (
              <Link href={`/course/${lessonNum + 1}`} className={styles.primaryAction}>
                Next Lesson →
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.actionsRow}>
            {cooldownSeconds > 0 ? (
              <div className={styles.cooldownNotice}>
                Take a breather — the quiz reopens in <b>{cooldownSeconds}s</b>
              </div>
            ) : null}
            <div className={styles.actionsRowInner}>
              <Link href="/course" className={styles.secondaryAction}>
                Review Lesson Later
              </Link>
              <button
                type="button"
                onClick={handleRetry}
                disabled={cooldownSeconds > 0}
                className={styles.primaryAction}
              >
                Try Again ({result.attemptsLeft} left)
              </button>
            </div>
          </div>
        )}

        <div className={styles.reviewHeading}>Review Your Answers</div>
        {result.review.map((item, i) => (
          <div key={i} className={item.wasCorrect ? styles.reviewCardCorrect : styles.reviewCardIncorrect}>
            <div className={styles.reviewQuestion}>{item.question}</div>
            <div className={item.wasCorrect ? styles.reviewYourAnswerCorrect : styles.reviewYourAnswerIncorrect}>
              Your answer: {item.yourAnswer}
            </div>
            <div className={styles.reviewCorrectAnswer}>Correct answer: {item.correctAnswer}</div>
            <div className={styles.reviewExplanation}>{item.explanation}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.quizHeader}>
        <div className={styles.quizMeta}>
          Question {currentIndex + 1} of {total}
        </div>
        <div className={styles.quizMeta}>{attemptsLeft} tries left</div>
      </div>
      <div className={styles.dots}>
        {dots.map((state, i) => (
          <div key={i} className={`${styles.dot} ${styles[`dot_${state}`]}`} />
        ))}
      </div>

      <h2 className={styles.question}>{currentQuestion.q}</h2>

      <div className={styles.choices}>
        {currentQuestion.options.map((option, i) => (
          <div
            key={i}
            onClick={() => selectOption(i)}
            className={i === currentAnswer ? styles.optionSelected : styles.option}
          >
            {option}
          </div>
        ))}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.navRow}>
        {isFirst ? (
          <div style={{ flex: 1 }} />
        ) : (
          <button type="button" onClick={() => setCurrentIndex((i) => i - 1)} className={styles.backButton}>
            ← Back
          </button>
        )}
        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={currentAnswer === null || isPending}
            className={styles.submitButton}
          >
            {isPending ? "Submitting…" : "Submit Quiz"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={currentAnswer === null}
            className={styles.nextButton}
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}
