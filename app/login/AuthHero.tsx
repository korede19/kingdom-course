import Image from "next/image";
import heroPhoto from "@/public/images/hero.jpg";
import { LogoMark } from "@/components/Logo";
import styles from "./AuthHero.module.css";

export function AuthHero() {
  return (
    <div className={styles.hero}>
      <Image src={heroPhoto} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" className={styles.image} priority />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <div className={styles.brandRow}>
          <LogoMark size={46} color="var(--color-gold)" />
          <span className={styles.brandName}>Kingdom Culture Academy</span>
        </div>
        <h1 className={styles.title}>A Journey into the Culture of Heaven on Earth</h1>
        <div className={styles.divider} />
        <p className={styles.verse}>&ldquo;Your kingdom come, your will be done, on earth as it is in heaven.&rdquo;</p>
        <div className={styles.verseRef}>MATTHEW 6:10</div>
      </div>
    </div>
  );
}
