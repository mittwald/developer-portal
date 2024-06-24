import styles from "./HTTPMethod.module.css";
import clsx from "clsx";

export default function HTTPMethod({ method, deprecated }: { method: string, deprecated?: boolean }) {
  const methodClass = `method${method.toUpperCase()}`;
  const methodOrDeprecatedClass = deprecated ? styles.methodDeprecated : styles[methodClass];
  return <span className={clsx(styles.method, methodOrDeprecatedClass)}>{method.toUpperCase()}</span>;
}