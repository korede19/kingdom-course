"use client";

import { useActionState, useState } from "react";
import { submitDonationAction, type DonationState } from "@/actions/donations";
import { Icon } from "@/components/Icon";
import styles from "./DonationForm.module.css";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export function DonationForm() {
  const [state, formAction, isPending] = useActionState<DonationState | null, FormData>(submitDonationAction, null);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");

  if (state?.ok) {
    return (
      <div className={styles.confirmationPanel}>
        <div className={styles.confirmationIcon}>
          <Icon name="heart" size={42} color="#D2823C" />
        </div>
        <h2 className={styles.confirmationTitle}>Thank you for your generosity</h2>
        <p className={styles.confirmationText}>
          {`Your ${state.freqLabel} gift of ${state.amountLabel} helps carry the Kingdom's work forward. A receipt would normally be sent to ${state.email}.`}
        </p>
      </div>
    );
  }

  function selectPreset(value: number) {
    setAmount(value);
    setCustomAmount("");
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Give to the Kingdom</h1>

      <div className={styles.commonwealth}>
        <div className={styles.commonwealthIcon}>
          <Icon name="heart" size={20} color="#D2823C" />
        </div>
        <p className={styles.commonwealthText}>
          One of the major principles of the Heavenly Kingdom Culture is Commonwealth. Therefore, in an effort to
          encourage you to participate in God&rsquo;s commonwealth system, &ldquo;give and it shall be given,&rdquo;
          we offer this course free of charge, but leave a place where you can leave a donation. This allows us to
          continue giving the course freely, while helping you step into Kingdom culture.
        </p>
      </div>

      <form action={formAction} className={styles.panel}>
        <div className={styles.freqTabs}>
          <button
            type="button"
            className={frequency === "once" ? styles.freqActive : styles.freqInactive}
            onClick={() => setFrequency("once")}
          >
            One-Time
          </button>
          <button
            type="button"
            className={frequency === "monthly" ? styles.freqActive : styles.freqInactive}
            onClick={() => setFrequency("monthly")}
          >
            Monthly
          </button>
        </div>
        <input type="hidden" name="frequency" value={frequency} />

        <div className={styles.sectionLabel}>Select an amount</div>
        <div className={styles.presetGrid}>
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => selectPreset(value)}
              className={amount === value && customAmount === "" ? styles.presetActive : styles.preset}
            >
              ${value}
            </button>
          ))}
        </div>

        <div className={styles.customAmountWrap}>
          <span className={styles.dollarSign}>$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              const value = Number(e.target.value);
              if (!Number.isNaN(value) && value > 0) setAmount(value);
            }}
            className={styles.customAmountInput}
          />
        </div>
        <input type="hidden" name="amount" value={amount} />

        <label className={styles.label} htmlFor="donation-name">
          Your Name
        </label>
        <input id="donation-name" name="name" type="text" placeholder="Jordan Ade" className={styles.input} required />

        <label className={styles.label} htmlFor="donation-email">
          Email
        </label>
        <input
          id="donation-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className={styles.input}
          required
        />

        {state && !state.ok ? <div className={styles.error}>{state.error}</div> : null}

        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Processing…" : `Give $${amount % 1 === 0 ? amount : amount.toFixed(2)}${frequency === "monthly" ? "/mo" : ""}`}
        </button>
      </form>
    </div>
  );
}
