import styles from "./ProgressBar.module.css";

export function ProgressBar({ percent, height = 8 }: { percent: number; height?: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={styles.track} style={{ height }}>
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
