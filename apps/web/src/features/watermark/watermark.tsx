import styles from './watermark.module.css';

export function Watermark() {
  return (
    <a href="https://www.workflowbuilder.io/" className={styles['watermark']}>
      {/* <img src="/watermark.svg" alt="Workflow Builder" /> */}
    </a>
  );
}
