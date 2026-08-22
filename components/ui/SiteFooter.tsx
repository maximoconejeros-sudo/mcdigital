import { CONTACT } from "@/lib/content/contact";
import styles from "./SiteFooter.module.css";

const LINKS = ["Servicios", "Capacidades", "Nosotros", "Contacto"];

/**
 * The real ending V9 asked for — FinalNarrative's gold line hands off into
 * this, a normal-flow (not fixed/pinned) section so it simply appears once
 * the user scrolls past the closing brand moment. Deliberately plain: no
 * animation, no scroll-driven reveal — the drama already happened above,
 * this is the resting frame the page settles into.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.brand}>MC DIGITAL®</span>

        <nav className={styles.links} aria-label="Footer">
          {LINKS.map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} data-cursor>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.meta}>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
          >
            {CONTACT.instagramHandle}
          </a>
          <span>Santiago — Miami</span>
          <span>© {year} MC Digital</span>
        </div>
      </div>

      <span className={styles.watermark} aria-hidden>
        MC Digital
      </span>
    </footer>
  );
}
