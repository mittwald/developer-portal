import styles from "@site/src/components/openapi/RequiredOptional.module.css";

export function Required() {
  return <span className={styles.required}>required</span>;
}

export function Optional() {
  return <span className={styles.optional}>optional</span>;
}