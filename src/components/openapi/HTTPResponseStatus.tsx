import styles from './HTTPResponseStatus.module.css';
import clsx from "clsx";
import { statusCodeName } from "@site/src/openapi/statusCodeName";

function getClassNameByCode(code: string): string {
  if (code.startsWith('2')) {
    return styles.success;
  } else if (code.startsWith('3')) {
    return styles.redirect;
  } else if (code.startsWith('4')) {
    return styles.clientError;
  } else {
    return styles.serverError;
  }
}

function HTTPResponseStatus({code}: {code: string}) {
  return <span className={clsx(styles.responseStatus, getClassNameByCode(code))}>{code} {statusCodeName(code)}</span>;
}

export default HTTPResponseStatus;