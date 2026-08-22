import styles from "./StaticFallback.module.css";

/** Strong static hero shown if WebGL is unavailable or the Canvas errors. */
export default function StaticFallback() {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <span className="label">MDIGITAL®</span>
        <span className="label">Design — Development — AI</span>
      </div>

      <div className={styles.center}>
        <h1 className={styles.word}>
          We create
          <br />
          digital
          <br />
          experiences.
        </h1>
      </div>

      <div className={styles.bottom}>
        <span className="label">Independent digital studio</span>
        <span className="label">Santiago — Miami</span>
      </div>
    </div>
  );
}
