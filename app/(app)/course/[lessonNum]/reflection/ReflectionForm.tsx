"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveReflectionAction } from "@/actions/progress";
import styles from "./ReflectionForm.module.css";

export function ReflectionForm({
  lessonNum,
  questions,
  savedAnswers,
}: {
  lessonNum: number;
  questions: string[];
  savedAnswers: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);

  function goToQuiz() {
    router.push(`/course/${lessonNum}/quiz`);
  }

  function handleSaveContinue() {
    const answers = refs.current.map((el) => el?.value ?? "");
    startTransition(async () => {
      await saveReflectionAction(lessonNum, answers);
      goToQuiz();
    });
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Take a moment to reflect</h1>
      <p className={styles.subtitle}>
        These are for your personal formation, not evaluation. Answer as many as you like — or skip ahead to the
        quiz.
      </p>
      {questions.map((question, i) => (
        <div key={i} className={styles.questionBlock}>
          <div className={styles.question}>
            {i + 1}. {question}
          </div>
          <textarea
            ref={(el) => {
              refs.current[i] = el;
            }}
            defaultValue={savedAnswers[i] ?? ""}
            placeholder="Write as much or as little as you like…"
            className={styles.textarea}
          />
        </div>
      ))}
      <div className={styles.actions}>
        <button type="button" onClick={goToQuiz} className={styles.skipButton} disabled={isPending}>
          Skip to Quiz
        </button>
        <button type="button" onClick={handleSaveContinue} className={styles.saveButton} disabled={isPending}>
          {isPending ? "Saving…" : "Save & Continue to Quiz →"}
        </button>
      </div>
    </div>
  );
}
