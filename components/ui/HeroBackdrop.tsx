import styles from "./HeroBackdrop.module.css";

/**
 * Sits behind the Hero's transparent canvas (z-15, canvas is z-20) so
 * flat black never reads as truly flat: a soft off-center radial glow, a
 * faint architectural gold line, and a subtle grain give the opening frame
 * depth before the MC/particles ever render. Every later act's own layer
 * is opaque and z-20+, so this is permanently hidden once scrolled past —
 * safe to mount unconditionally rather than gate on act1Active.
 */
export default function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden>
      <span className={styles.line} />
    </div>
  );
}
