import Image from "next/image";
import heroPhoto from "@/public/images/hero.jpg";
import styles from "./AuthHero.module.css";

export function AuthHero() {
  return (
    <div className={styles.hero}>
      <Image src={heroPhoto} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" className={styles.image} priority />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <div className={styles.brandRow}>
          <div className={styles.brandBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 6V11C3 16.5 6.8 21.2 12 22.5C17.2 21.2 21 16.5 21 11V6L12 2Z"
                stroke="#F2C99B"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
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
