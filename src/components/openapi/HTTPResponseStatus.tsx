import styles from './HTTPResponseStatus.module.css';
import clsx from "clsx";

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

function codeName(code: string): string|undefined {
  // Thanks, Copilot!
  switch (code) {
    case "200": return "OK";
    case "201": return "Created";
    case "202": return "Accepted";
    case "204": return "No Content";
    case "301": return "Moved Permanently";
    case "302": return "Found";
    case "303": return "See Other";
    case "304": return "Not Modified";
    case "400": return "Bad Request";
    case "401": return "Unauthorized";
    case "403": return "Forbidden";
    case "404": return "Not Found";
    case "405": return "Method Not Allowed";
    case "406": return "Not Acceptable";
    case "409": return "Conflict";
    case "410": return "Gone";
    case "412": return "Precondition Failed";
    case "415": return "Unsupported Media Type";
    case "422": return "Unprocessable Entity";
    case "429": return "Too Many Requests";
    case "500": return "Internal Server Error";
    case "501": return "Not Implemented";
    case "502": return "Bad Gateway";
    case "503": return "Service Unavailable";
    case "504": return "Gateway Timeout";
  }
}

function HTTPResponseStatus({code}: {code: string}) {
  return <span className={clsx(styles.responseStatus, getClassNameByCode(code))}>{code} {codeName(code)}</span>;
}

export default HTTPResponseStatus;