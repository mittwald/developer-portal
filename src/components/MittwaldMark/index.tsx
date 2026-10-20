import React from "react";

interface MittwaldMarkProps {
  /** Accessible name of the mark */
  label: string;
  /** Sizes the mark; it is drawn in the current text color */
  className?: string;
}

/** The mittwald "m." mark as used in mStudio */
export default function MittwaldMark({ label, className }: MittwaldMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M18.4001 6.8087C18.4001 5.81468 19.2136 5 20.1865 5C21.1817 5 21.9952 5.8135 21.9964 6.8087C21.9964 7.78045 21.1817 8.59512 20.1865 8.59512C19.2147 8.59512 18.4001 7.78162 18.4001 6.8087ZM11.4735 9.94316C12.2331 8.67836 13.6866 8.06765 14.8881 8.06765C17.8597 8.06765 18.7869 10.112 18.7845 12.8104V18.4744L15.9607 19.0277V13.169C15.9607 11.7776 15.6231 10.7449 14.1274 10.7449C12.736 10.7449 11.9776 11.8609 11.9776 13.2523V18.8167H9.15376V13.169C9.15376 11.7776 8.83727 10.7449 7.32045 10.7449C5.88685 10.7449 5.17064 11.9664 5.17064 13.3578V18.8143H2.34682L2.348 10.1249L2.34682 10.0967L1.99634 8.31264L4.87642 7.74881L5.22574 9.52234C5.86927 8.66312 7.03912 8.06765 8.22773 8.06765C9.89342 8.06765 10.9261 8.76276 11.4735 9.94316Z"
      />
    </svg>
  );
}
