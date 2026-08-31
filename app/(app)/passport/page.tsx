import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/products";
import { formatDate } from "@/lib/format";
import { submitPassportApplicationAction, resumePassportPaymentAction } from "@/actions/passport";
import { reconcileCheckoutSession } from "@/lib/stripeFulfillment";
import { PassportApplyForm } from "./PassportApplyForm";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Kingdom Passport · Kingdom Culture Academy" };

type SearchParams = { error?: string; submitted?: string; session_id?: string };

export default async function PassportPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { error, submitted, session_id: sessionId } = await searchParams;
  const user = await requireUser();

  if (submitted === "1") {
    await reconcileCheckoutSession(sessionId);
  }

  const application = await prisma.passportApplication.findUnique({ where: { userId: user.id } });

  if (application?.paymentStatus === "paid") {
    const certNumber = `KCA-P-${user.id.slice(0, 8).toUpperCase()}`;
    return (
      <div>
        <div className={styles.badgeRow}>
          <span className={styles.passportBadge}>
            <Icon name="passport" size={14} color="#123B36" /> Kingdom Passport
          </span>
        </div>
        <h1 className={styles.title}>Your Kingdom Passport</h1>
        <p className={styles.subtitle}>Issued to citizens and ambassadors of the Kingdom of Heaven.</p>

        <div className={styles.documentOuter}>
          <div className={styles.document}>
            <span className={styles.cornerTL} aria-hidden="true" />
            <span className={styles.cornerTR} aria-hidden="true" />
            <span className={styles.cornerBL} aria-hidden="true" />
            <span className={styles.cornerBR} aria-hidden="true" />

            <div className={styles.documentInner}>
              <div className={styles.documentHeader}>
                <div className={styles.crest}>
                  <Icon name="shield" size={22} color="var(--color-orange)" />
                </div>
                <div>
                  <div className={styles.documentBrand}>Kingdom of Heaven</div>
                  <div className={styles.documentKicker}>Citizenship &amp; Ambassadorial Passport</div>
                </div>
              </div>

              <div className={styles.documentBody}>
                <div className={styles.photoFrame}>
                  {application.pictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={application.pictureUrl} alt={application.fullName} className={styles.photo} />
                  ) : (
                    <Icon name="user" size={36} color="#A85F1E" />
                  )}
                </div>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Full Name</div>
                    <div className={styles.fieldValue}>{application.fullName}</div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Nation of Origin (Earth)</div>
                    <div className={styles.fieldValue}>{application.country}</div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Kingdom Status</div>
                    <div className={styles.fieldValue}>Child &amp; Ambassador of Heaven</div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Authority</div>
                    <div className={styles.fieldValue}>Power of Attorney in the Name of Jesus</div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Issued</div>
                      <div className={styles.fieldValue}>{formatDate(application.paidAt ?? application.createdAt)}</div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Passport No.</div>
                      <div className={styles.fieldValue}>{certNumber}</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className={styles.documentFooterText}>
                This document is not an official travel document. It is a ministry tool that declares the bearer a
                recognized citizen of the Kingdom of Heaven, commissioned as an ambassador to their territory, bearing
                the rights, privileges, and protections of their home country while on earthly assignment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (application) {
    return (
      <div>
        <div className={styles.badgeRow}>
          <span className={styles.passportBadge}>
            <Icon name="passport" size={14} color="#123B36" /> Kingdom Passport
          </span>
        </div>
        <h1 className={styles.title}>Application Submitted</h1>

        <div className={styles.pendingPanel}>
          <div className={styles.pendingIcon}>
            <Icon name="clock" size={26} color="#A85F1E" />
          </div>
          {application.paymentStatus === "refunded" ? (
            <>
              <h2 className={styles.pendingTitle}>Payment refunded</h2>
              <p className={styles.pendingText}>
                Your $50 payment was refunded, so your Kingdom Passport hasn&rsquo;t been issued. If this wasn&rsquo;t
                expected, or you&rsquo;d like to complete payment again, use the button below.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.pendingTitle}>Awaiting payment confirmation</h2>
              <p className={styles.pendingText}>
                Your application is on file. Your Kingdom Passport will be issued here as soon as your $50 payment is
                confirmed.
              </p>
            </>
          )}
          {error === "cancelled" ? (
            <p className={styles.pendingNotice}>Checkout was cancelled. You can pick up where you left off below.</p>
          ) : null}
          <div className={styles.pendingDetails}>
            <div className={styles.pendingRow}>
              <span>Name</span>
              <span>{application.fullName}</span>
            </div>
            <div className={styles.pendingRow}>
              <span>Country</span>
              <span>{application.country}</span>
            </div>
            <div className={styles.pendingRow}>
              <span>Fee</span>
              <span>{formatCents(application.feeCents)}</span>
            </div>
            <div className={styles.pendingRow}>
              <span>Submitted</span>
              <span>{formatDate(application.createdAt)}</span>
            </div>
          </div>
          <form action={resumePassportPaymentAction}>
            <button type="submit" className={styles.resumeButton}>
              Complete Payment
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.badgeRow}>
        <span className={styles.passportBadge}>
          <Icon name="passport" size={14} color="#123B36" /> Kingdom Passport
        </span>
      </div>
      <h1 className={styles.title}>Why Do I Want a Passport to Live in Heaven on Earth?</h1>

      <div className={styles.panel}>
        <p className={styles.paragraph}>
          This passport, though not official, becomes a tool to remind you that you are distinguished from the local
          citizens you are visiting, and this verifies your nation of origin. It is essentially a document that
          represents your citizenship as a new creature who dwells in Heaven, reminding you of the rights,
          privileges, and protections of your home country while you are on earth.
        </p>

        <p className={styles.paragraph}>
          In our case, all citizens of Heaven are new creatures called children, assigned to be ambassadors, the
          highest ranking authority representing the Kingdom of Heaven.
        </p>

        <p className={styles.paragraph}>
          We are not just visitors. We are on ambassadorial assignment, having the Power of Attorney to use the name
          of Jesus. We have access to God&rsquo;s angels, who serve as protective and ministering agents while we are
          on duty representing the Heavenly Kingdom&rsquo;s purposes of colonization.
        </p>

        <h2 className={styles.sectionHeading}>A Government and Its Constitution</h2>
        <p className={styles.paragraph}>
          A government exists primarily to execute its constitution, enforcing the laws of the country which
          establish the value system and culture of its society, creating community.
        </p>

        <ol className={styles.numberedList}>
          <li>
            <span className={styles.numberedTitle}>Values.</span> The laws of a country determine what people value,
            which in turn creates the moral standard, or boundaries, of that society.
          </li>
          <li>
            <span className={styles.numberedTitle}>Social Structure.</span> These values produce a community, or
            colony, which is how people interact socially, forming a society that expresses itself through a distinct
            culture of love.
          </li>
          <li>
            <span className={styles.numberedTitle}>Individual Protection.</span> A constitution functions as a
            contract between the King and, in our case, us, his children, whom he guarantees rights and privileges
            protected by his law of love.
          </li>
        </ol>

        <h2 className={styles.sectionHeading}>Never Meant to Be Independent</h2>
        <p className={styles.paragraph}>
          Personal independence, rebellion, was never the intention of God. We were never created to be independent
          from heavenly rule. We lack the capability of sustaining life ourselves. Look at the example of the vine
          and the branch: a branch separated from the vine can sustain no life.
        </p>

        <p className={styles.paragraph}>
          The parable of the prodigal son is not a story about one person. It is the story of all of humanity,
          claiming independence only to discover that without God as our source we are unable to do it ourselves. So
          God&rsquo;s assignment, our doing the work of reconciliation and colonization, is his precept, God&rsquo;s
          original intent. If you are not fully engaged in this process, then you are irrelevant. We forget we were
          created for His pleasure, not ours.
        </p>

        <h2 className={styles.sectionHeading}>Why Colonization</h2>
        <p className={styles.paragraph}>
          The colon is an organ in the human body, running from the tongue all the way to the rectum. Through
          colonization we are reattached, so that humanity can once again live by every word that comes out of the
          mouth of God. Here is where meditation, chewing the cud, reconnects us to our source, Abba, where in the
          realm of the spirit we live by every word that comes out of the mouth of God.
        </p>

        <h2 className={styles.sectionHeading}>The Shepherd and the Sheep</h2>
        <p className={styles.paragraph}>
          King David wrote the 23rd Psalm as a declaration of his relationship to God. It was not a prayer. It was a
          proclamation, ultimately declaring that God was his Shepherd, and we are his sheep, who can do nothing in
          themselves. Jesus even said the words, &ldquo;I in myself can do nothing.&rdquo; The Kingdom is a place of
          quietness within, where I overcome all anxiety and fear by identifying myself as the sheep, bah-a, abiding
          in my source, Abba, Father. So I sit in the quiet and speak as the lamb: Abbah-a.
        </p>

        <div className={styles.signature}>
          <div>Be Blessed,</div>
          <div className={styles.signatureName}>Dave</div>
        </div>
      </div>

      <div className={styles.applyPanel}>
        <h2 className={styles.applyHeading}>Apply for Your Kingdom Passport</h2>
        <p className={styles.applySubtext}>
          Fill out the application below. A one-time fee of <strong>$50.00</strong> applies. Your passport will be
          issued here as soon as payment is confirmed.
        </p>
        <PassportApplyForm action={submitPassportApplicationAction} />
      </div>
    </div>
  );
}
