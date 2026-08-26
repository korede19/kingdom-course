"use client";

import { useActionState } from "react";
import type { PassportApplyState } from "@/actions/passport";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import styles from "./page.module.css";

export function PassportApplyForm({
  action,
}: {
  action: (prevState: PassportApplyState, formData: FormData) => Promise<PassportApplyState>;
}) {
  const [state, formAction, pending] = useActionState<PassportApplyState, FormData>(action, null);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.formRow}>
        <PhotoUploadField name="pictureUrl" required />

        <div className={styles.formFields}>
          <label className={styles.label} htmlFor="fullName">
            Full Name
          </label>
          <input id="fullName" name="fullName" type="text" placeholder="Jordan Ade" className={styles.input} required />

          <label className={styles.label} htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Street, City, State"
            className={styles.input}
            required
          />

          <label className={styles.label} htmlFor="country">
            Country
          </label>
          <input id="country" name="country" type="text" placeholder="Nigeria" className={styles.input} required />
        </div>
      </div>

      {state?.error ? <div className={styles.formError}>{state.error}</div> : null}

      <button type="submit" className={styles.submitButton} disabled={pending}>
        {pending ? "Submitting…" : "Submit Application, $50.00"}
      </button>
    </form>
  );
}
