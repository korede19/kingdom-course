import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LESSONS } from "@/lib/lessons-data";
import { PRODUCTS, formatCents } from "@/lib/products";
import { PASS_THRESHOLD, MAX_ATTEMPTS } from "@/lib/progress";
import { LogoMark } from "@/components/Logo";
import heroPhoto from "@/public/images/hero.jpg";
import { LandingMotion } from "./LandingMotion";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Kingdom Culture Academy · A Journey into the Culture of Heaven on Earth",
  description:
    "A ten-lesson journey that unlearns the culture of earth and forms you as a citizen and ambassador of the Kingdom. Lessons, reflections, quizzes, badges and a certificate of completion.",
  alternates: { canonical: "/" },
};

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/** Scroll-reveal hook-up: `LandingMotion` flips `data-in` when the element enters the viewport. */
function rv(kind: "up" | "row" | "scale" | "words" | "line", delay = 0) {
  return { "data-reveal": kind, style: { "--d": delay } as CssVars };
}

/** Splits text into words that rise out of a mask, one after another. */
function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word} style={{ "--i": start + i } as CssVars}>
            <span className={styles.wordInner}>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/** Words that light up one by one as the reader scrolls (driven by `LandingMotion`). */
function ScrubWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span data-w="">{word}</span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/** "The Original Mandate: Colonizing Earth with Heaven" → ["The Original Mandate", "Colonizing Earth with Heaven"] */
function splitTitle(title: string): [string, string | null] {
  const i = title.indexOf(": ");
  if (i === -1) return [title, null];
  return [title.slice(0, i), title.slice(i + 2)];
}

/** Mirrors the "coming soon" courses on the member dashboard. */
const UPCOMING = [
  { title: "Kingdom Prayer & Intercession", body: "Learning to pray as a governing citizen, not a beggar." },
  { title: "Marketplace Ministry", body: "Carrying kingdom culture into work, business, and industry." },
  { title: "Family Discipleship", body: "Raising children who know their identity from day one." },
];

const STEPS = [
  {
    title: "Read",
    body: "Each lesson opens with a word, sets out its objectives, then walks through the teaching in short, unhurried parts.",
  },
  {
    title: "Reflect",
    body: "Five questions per lesson, answered in your own words. Written for the heart before the head.",
  },
  {
    title: "Be tested",
    body: `Ten questions. ${PASS_THRESHOLD} correct to pass, ${MAX_ATTEMPTS} attempts before a short rest. Explanations follow every answer.`,
  },
  {
    title: "Receive the seal",
    body: "Pass the quiz and the lesson’s badge is yours. Finish all ten and your certificate is issued.",
  },
];

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const quizTotal = LESSONS.reduce((n, l) => n + l.quiz.length, 0);
  const facts = [
    { label: "Lessons", value: LESSONS.length },
    { label: "Badges to earn", value: LESSONS.length },
    { label: "Quiz questions", value: quizTotal },
    { label: "Certificate", value: 1 },
  ];

  return (
    <div className={styles.page} data-landing="">
      <LandingMotion />

      {/* ───────── Nav (fixed) ───────── */}
      <header className={styles.nav}>
        <Link href="/" className={styles.wordmark} aria-label="Kingdom Culture Academy">
          <LogoMark size={46} />
          <span className={styles.wordmarkText}>
            <strong>Kingdom</strong>
            <small>Culture Academy</small>
          </span>
        </Link>
        <nav className={styles.navLinks} aria-label="Sections">
          <a href="#journey">The Journey</a>
          <a href="#method">Method</a>
          <a href="#beyond">Beyond the Course</a>
        </nav>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.navSignIn}>
            Sign in
          </Link>
          <Link href="/login?mode=register" className={styles.navSignUp}>
            Sign up
          </Link>
        </div>
        <div className={styles.progress} aria-hidden="true" />
      </header>

      <main>
        {/* ───────── Hero ───────── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={`${styles.kicker} ${styles.intro}`} style={{ "--d": 0 } as CssVars}>
                The Kingdom Course
              </p>
              <h1 className={styles.headline}>
                <Words text="Unlearn the culture of earth." />
                <em>
                  <Words text="Live the culture of heaven." start={5} />
                </em>
              </h1>
              <p className={`${styles.lede} ${styles.intro}`} style={{ "--d": 1 } as CssVars}>
                The flagship course of Kingdom Culture Academy. Ten lessons that form you as a citizen and an
                ambassador of the Kingdom, at the pace of your own life.
              </p>
              <div className={`${styles.ctaRow} ${styles.intro}`} style={{ "--d": 2 } as CssVars}>
                <Link href="/login?mode=register" className={styles.ctaPrimary}>
                  Begin the journey
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/login" className={styles.ctaGhost}>
                  I already have an account
                </Link>
              </div>
            </div>

            <figure className={styles.arch}>
              <Image
                src={heroPhoto}
                alt="A congregation with raised hands in worship"
                fill
                priority
                sizes="(min-width: 960px) 420px, 80vw"
                className={styles.archImage}
              />
              <div className={styles.archTint} />
              <figcaption className={styles.archCaption}>
                <span>Matthew 6:10</span>
                <q>Your kingdom come, your will be done, on earth as it is in heaven.</q>
              </figcaption>
            </figure>
          </div>

          <dl className={styles.facts}>
            {facts.map((fact, i) => (
              <div key={fact.label} {...rv("up", i)}>
                <dt>{fact.label}</dt>
                <dd data-count={fact.value}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ───────── Premise ───────── */}
        <section className={styles.premise}>
          <p className={styles.premiseText} data-scrub="">
            <ScrubWords text="Every citizen is shaped by the culture they were raised in. This course asks a plain question:" />
            <em>
              <ScrubWords text="what culture are you actually living from?" />
            </em>
          </p>
        </section>

        {/* ───────── Curriculum ───────── */}
        <section id="journey" className={styles.journey}>
          <div className={styles.journeyHead}>
            <p className={styles.eyebrow} {...rv("up")}>
              The Kingdom Course
            </p>
            <h2 className={styles.h2} {...rv("words", 1)}>
              <Words text="Ten lessons." />
              <br />
              <Words text="One formation." start={2} />
            </h2>
            <p className={styles.sectionLede} {...rv("up", 4)}>
              From the original mandate to the eternal kingdom, each lesson builds on the last and closes with a seal
              you earn.
            </p>
          </div>

          <ol className={styles.lessonList} {...rv("line")}>
            {LESSONS.map((lesson) => {
              const [main, sub] = splitTitle(lesson.title);
              return (
                <li key={lesson.num} className={styles.lessonRow} {...rv("row")}>
                  <span className={styles.lessonNum}>{String(lesson.num).padStart(2, "0")}</span>
                  <div className={styles.lessonBody}>
                    <h3 className={styles.lessonTitle}>{main}</h3>
                    {sub ? <p className={styles.lessonSub}>{sub}</p> : null}
                  </div>
                  <span className={styles.lessonBadge}>{lesson.badge}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ───────── Method ───────── */}
        <section id="method" className={styles.method}>
          <div className={styles.methodInner}>
            <div className={styles.methodHead}>
              <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} {...rv("up")}>
                How it works
              </p>
              <h2 className={`${styles.h2} ${styles.h2Light}`} {...rv("words", 1)}>
                <Words text="A rhythm you can keep." />
              </h2>
            </div>
            <ol className={styles.steps} {...rv("line")}>
              {STEPS.map((step, i) => (
                <li key={step.title} className={styles.step} {...rv("up", i)}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Beyond ───────── */}
        <section id="beyond" className={styles.beyond}>
          <div className={styles.beyondHead}>
            <p className={styles.eyebrow} {...rv("up")}>
              Beyond the course
            </p>
            <h2 className={styles.h2} {...rv("words", 1)}>
              <Words text="Carry it further." />
            </h2>
          </div>

          <div className={styles.beyondGrid}>
            <article className={styles.passport} {...rv("scale")}>
              <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
              <p className={styles.passportKicker}>Kingdom of Heaven</p>
              <h3 className={styles.passportTitle}>The Kingdom Passport</h3>
              <p className={styles.passportBody}>
                A citizenship and ambassadorial passport, issued in your name with your photograph, a document to
                keep as a mark of where you belong.
              </p>
              <span className={styles.passportNote}>Available to members</span>
            </article>

            <div className={styles.shelf}>
              {PRODUCTS.map((product, i) => (
                <article key={product.id} className={styles.book} {...rv("up", i + 1)}>
                  {product.coverImage ? (
                    <div className={styles.cover}>
                      <Image
                        src={product.coverImage}
                        alt={`Cover of ${product.name}`}
                        fill
                        sizes="(min-width: 960px) 160px, 40vw"
                        className={styles.coverImage}
                      />
                    </div>
                  ) : null}
                  <div className={styles.bookText}>
                    <p className={styles.bookFormat}>{product.subtitle}</p>
                    <h3 className={styles.bookTitle}>{product.name}</h3>
                    <p className={styles.bookPrice}>{formatCents(product.priceCents)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── More courses ───────── */}
        <section className={styles.academy}>
          <div className={styles.academyHead}>
            <p className={styles.eyebrow} {...rv("up")}>
              The Academy
            </p>
            <h2 className={styles.h2} {...rv("words", 1)}>
              <Words text="This is where it begins." />
            </h2>
            <p className={styles.sectionLede} {...rv("up", 4)}>
              The Kingdom Course is the foundation. More courses are on the way, each building on it.
            </p>
          </div>
          <ul className={styles.upcomingList} {...rv("line")}>
            {UPCOMING.map((course, i) => (
              <li key={course.title} className={styles.upcomingRow} {...rv("row", i * 0.5)}>
                <h3 className={styles.upcomingTitle}>{course.title}</h3>
                <p className={styles.upcomingBody}>{course.body}</p>
                <span className={styles.upcomingTag}>Coming soon</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Closing ───────── */}
        <section className={styles.closing}>
          <p className={styles.closingVerse} {...rv("words")}>
            <Words text="“Do not be conformed to this world, but be transformed by the renewal of your mind.”" />
          </p>
          <p className={styles.closingRef} {...rv("up", 4)}>
            Romans 12:2
          </p>
          <div className={styles.closingCta} {...rv("up", 5)}>
            <Link href="/login?mode=register" className={styles.ctaPrimary}>
              Create your account
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/login" className={styles.closingSignIn}>
              Sign in
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Kingdom Culture Academy</span>
        <nav aria-label="Legal">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
