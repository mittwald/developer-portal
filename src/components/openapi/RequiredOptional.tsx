import { AlertBadge } from "@mittwald/flow-react-components";

export function Required() {
  return <AlertBadge status="warning">required</AlertBadge>;
}

export function Optional() {
  return <AlertBadge status="info">optional</AlertBadge>;
}
