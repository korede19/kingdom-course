import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Icon } from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Bonus: Using the Name of Jesus · Kingdom Culture Academy" };

export default async function BonusPage() {
  await requireUser();

  return (
    <div>
      <Link href="/course" className={styles.backLink}>
        <Icon name="chevronLeft" size={16} /> Back to Progress Map
      </Link>

      <div className={styles.badgeRow}>
        <span className={styles.lessonBadge}>Bonus</span>
      </div>

      <h1 className={styles.title}>Using the Name of Jesus</h1>
      <p className={styles.source}>Adapted from &ldquo;The Wonderful Name of Jesus&rdquo; by E.W. Kenyon</p>

      <div className={styles.panel}>
        <p className={styles.paragraph}>
          E.W. Kenyon explores the concept of the supernatural in the daily life of a believer and argues that
          Christianity is not merely a religion, but the actual life of God through man.
        </p>

        <h2 className={styles.sectionHeading}>Key Themes</h2>

        <ul className={styles.themeList}>
          <li className={styles.themeItem}>
            <span className={styles.themeTitle}>The Expectation of Miracles.</span>{" "}
            The church stopped experiencing miracles not because God stopped performing them, but because the church
            stopped seeking and expecting them.
          </li>
          <li className={styles.themeItem}>
            <span className={styles.themeTitle}>The Four-Fold Right to the Name of Jesus.</span>{" "}
            A central focus is that believers possess a legal right to use the name of Jesus based on four pillars:
            <ol className={styles.subList}>
              <li>
                <span className={styles.themeTitle}>Birth:</span> by virtue of being born into the family of God.
              </li>
              <li>
                <span className={styles.themeTitle}>Baptism:</span> a public declaration of identity in Christ.
              </li>
              <li>
                <span className={styles.themeTitle}>Power of Attorney:</span> the legal authority granted by Jesus
                to act in his place, declared seven times in Scripture.
              </li>
              <li>
                <span className={styles.themeTitle}>Ambassadorial Commission:</span> far greater than our personal
                needs, this is the authority to represent Christ on earth.
              </li>
            </ol>
          </li>
          <li className={styles.themeItem}>
            <span className={styles.themeTitle}>Faith vs. Knowledge.</span>{" "}
            The teaching emphasizes moving away from &ldquo;straining&rdquo; or performing faith to a state of
            settled knowledge. Understanding the finished work of Christ allows believers to use the name of Jesus
            with the same naturalness as writing a check on a fully funded account.
          </li>
          <li className={styles.themeItem}>
            <span className={styles.themeTitle}>Authority Over Demonic Influence.</span>{" "}
            Authority over demonic influence is a standard, yet often neglected, part of the believer&rsquo;s
            inheritance. Address the spiritual source of resistance directly, not through willpower or psychological
            frameworks, but through the authority of the name of Jesus.
          </li>
        </ul>

        <p className={styles.emphasis}>
          Stop asking for permission, and instead live in the reality of your position in Christ, exercising the
          authority already granted to you to bring the fullness of the finished work in the heavenly realm into the
          realm of the senses that has no authority.
        </p>

        <h2 className={styles.sectionHeading}>Prayer Battle</h2>

        <p className={styles.paragraph}>
          If planning to use the Name of Jesus in prayer battles, one needs to know the power invested in that Name
          which God esteems above every name. That Name stands for us as Jesus stands for us. When one really prays
          in that Name intelligently, scripturally, and in the will of God, it is as though Christ Himself prayed.
        </p>

        <p className={styles.paragraph}>
          There is no force, might, or authority in earth, air, or hell that can prevent its answer; it simply must
          come to pass. In your own integrity, in your rights, privileges, and authority you approach your mountain,
          you command it in that Name, &ldquo;Up, hurl yourself into the sea.&rdquo; The mountain cannot help it. You
          cannot help it. All hell cannot help it. It simply must go.
        </p>

        <p className={styles.paragraph}>
          Back of your command lies God&rsquo;s integrity, His omnipotence, and Christ&rsquo;s unlimited power, all
          at your disposal.
        </p>

        <h3 className={styles.subHeading}>Stand in the Name</h3>

        <p className={styles.paragraph}>
          The hosts of hell may assault you, but you meet them in that Name that once spread consternation through
          hell, when He put to naught him that had the authority of death, that is, the devil (Hebrews 2:14). Satan
          dares not face the warrior who is clothed in Christ&rsquo;s righteousness, and who knows the power of that
          mighty Name.
        </p>

        <div className={styles.quoteBlock}>
          <p className={styles.quoteText}>
            &ldquo;Whosoever shall say unto this mountain, Be thou taken up and cast into the sea, and shall not
            doubt in his heart, but shall believe that what he saith cometh to pass, he shall have it.&rdquo;
          </p>
          <p className={styles.cite}>Mark 11:23</p>
        </div>

        <p className={styles.paragraph}>
          You think your mountain is large, the sea at a great distance, your own faith small; well, all this may be
          true, but you have confidence in that Name even if you have not in your own faith. So, in that great Name
          command the mountain to go, not in your faith, but in that Name. It will go. It must go!
        </p>

        <p className={styles.paragraph}>
          It is not the quantity of faith, but the place where it is centered. If you ask in that Name, you are a
          victor from this hour, whether it concerns money, health, or souls, you cannot fail. The Mighty Name that
          heads up all the power of the universe says so, and it must be so.
        </p>

        <h3 className={styles.subHeading}>God&rsquo;s Will</h3>

        <p className={styles.paragraph}>
          An unswerving, unconquerable will knows no defeat. You come to your mountain, you know its power, its
          greatness; you have compassed it more than seven days; you have faced it perhaps for a long period, but
          the battle must be fought today.
        </p>

        <p className={styles.paragraph}>
          You know you are in His will. So now you will this mountain to go; your will becomes His will; your
          command, His command. You say, &ldquo;In the Name of Jesus I command you to go.&rdquo; That makes Jesus
          say it, and when He says it, that makes the Father say it. Standing back of you are the union of the
          Trinity and the power of the universe.
        </p>

        <p className={styles.paragraph}>
          Your will and God&rsquo;s will are allied against the enemy. They are now identical. Through you, God is
          able to fight His enemies. Through you, He can act. Through you, He can use His power as He wills to use
          it. You hurl that matchless Name of His Son against the hosts of hell, and they will fly in confusion.
        </p>

        <p className={styles.paragraph}>
          You walk among men, the God-man, a man of God. God has put Himself in your hands and says, &ldquo;Use my
          will, name, word, and power,&rdquo; and your mountain becomes a plain. Your opponents have to fight God.
          The battle is His. It is His honor now that is assailed. He fights; men tremble, and fall to rise no more.
        </p>

        <p className={styles.footerSource}>The Wonderful Name of Jesus, E.W. Kenyon</p>
      </div>
    </div>
  );
}
