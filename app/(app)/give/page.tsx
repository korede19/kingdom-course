import type { Metadata } from "next";
import { DonationForm } from "./DonationForm";
import { reconcileCheckoutSession } from "@/lib/stripeFulfillment";
import { Icon } from "@/components/Icon";
import styles from "./DonationForm.module.css";

export const metadata: Metadata = { title: "Give · Kingdom Culture Academy" };

type SearchParams = { thanks?: string; error?: string; session_id?: string };

export default async function GivePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { thanks, error, session_id: sessionId } = await searchParams;

  if (thanks === "1") {
    await reconcileCheckoutSession(sessionId);
    return (
      <div className={styles.confirmationPanel}>
        <div className={styles.confirmationIcon}>
          <Icon name="heart" size={42} color="#D2823C" />
        </div>
        <h2 className={styles.confirmationTitle}>Thank you for your generosity</h2>
        <p className={styles.confirmationText}>
          Your gift helps carry the Kingdom&rsquo;s work forward. A receipt from Stripe is on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error === "cancelled" ? (
        <div className={styles.wrap}>
          <div className={styles.cancelNotice}>Checkout was cancelled. No gift was charged. Feel free to try again below.</div>
        </div>
      ) : null}
      <DonationForm />
    </div>
  );
}
