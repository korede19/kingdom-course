import type { ContentBlock } from "@/lib/lessons-data";
import styles from "./ContentBlocks.module.css";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.t === "p") {
          return (
            <p key={i} className={styles.paragraph}>
              {block.text}
            </p>
          );
        }
        if (block.t === "quote") {
          return (
            <div key={i} className={styles.quoteBlock}>
              <p className={styles.quoteText}>&ldquo;{block.text}&rdquo;</p>
            </div>
          );
        }
        return (
          <p key={i} className={styles.cite}>
            — {block.text}
          </p>
        );
      })}
    </>
  );
}
