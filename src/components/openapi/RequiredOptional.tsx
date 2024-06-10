import styles from "@site/src/components/openapi/RequiredOptional.module.css";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";

export function Required() {
  return <StatusBadge status="warning">required</StatusBadge>;
}

export function Optional() {
  return <StatusBadge status="info">optional</StatusBadge>;
}