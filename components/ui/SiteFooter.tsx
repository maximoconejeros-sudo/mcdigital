import styles from "./SiteFooter.module.css";

/**
 * The real ending V10 asked for — FinalNarrative's own ivory-to-black walk
 * hands off directly into this, a normal-flow (not fixed/pinned) section so
 * it simply appears once the user scrolls past the closing brand moment.
 * Deliberately plain: no animation, no scroll-driven reveal — the drama
 * already happened above, this is the resting frame the page settles into.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.brand}>MC DIGITAL®</span>
      </div>

      <h2 className={styles.headline} aria-hidden>
        Make it impossible
        <br />
        to ignore.
      </h2>

      <div className={styles.metaRow}>
        <span>Santiago / Miami</span>
        <span>Web / Landing Pages / AI &amp; Automation</span>
        <span>Instagram / WhatsApp / Email</span>
      </div>

      <div className={styles.copyright}>© {year} MC Digital</div>
    </footer>
  );
}
