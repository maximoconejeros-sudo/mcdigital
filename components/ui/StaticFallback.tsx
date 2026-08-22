import styles from "./StaticFallback.module.css";

/** Strong static hero shown if WebGL is unavailable or the Canvas errors. */
export default function StaticFallback() {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <span className="label">MC DIGITAL®</span>
        <span className="label">Web / AI / Digital systems</span>
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
        <span className="label">Digital growth agency</span>
        <span className="label">Santiago — Miami</span>
      </div>
    </div>
  );
}
