// Line art ornaments echoing the reference artwork: soft blue florals and a
// mother silhouette drawn with fine navy strokes.
export function BrandMark({ size = 34, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 43c-6-3.5-9.5-9-9.5-15C14.5 19 19 13 24 8c5 5 9.5 11 9.5 20 0 6-3.5 11.5-9.5 15z"
        stroke="#4a7cae"
        strokeWidth="1.4"
        fill="#e3ecf6"
      />
      <path
        d="M24 43V20"
        stroke="#2b3a4f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 30c-2.5-1-4-3-4.5-5.5 2.5 0 4.5 2 4.5 5.5zM24 24c2.5-1 4-3 4.5-5.5-2.5 0-4.5 2-4.5 5.5z"
        fill="#6f9bc8"
        stroke="#2b3a4f"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="15" r="3.4" fill="#9dbddd" stroke="#2b3a4f" strokeWidth="1.1" />
      <path
        d="M10 12c3.5-3 8-3.5 11-1M38 12c-3.5-3-8-3.5-11-1"
        stroke="#8fae9a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function FloralCorner({ size = 220, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="#4a7cae" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <path d="M20 190C25 140 40 100 75 70" />
        <path d="M32 150c18-4 30-16 34-32" />
        <path d="M45 118c-14 2-25-4-30-16 14-3 25 3 30 16z" fill="#e3ecf6" />
        <path d="M58 96c12-8 16-20 13-33-13 7-17 19-13 33z" fill="#c6d9ec" />
        <g fill="#9dbddd">
          <circle cx="88" cy="52" r="9" />
          <circle cx="108" cy="42" r="7" />
          <circle cx="74" cy="34" r="6" />
        </g>
        <g stroke="#2b3a4f" strokeWidth="0.9" fill="#6f9bc8">
          <path d="M88 44c2-4 6-4 8 0 2 4 0 8-4 8s-6-4-4-8z" />
          <path d="M104 36c1.6-3 4.6-3 6 0 1.4 3 0 6-3 6s-4.4-3-3-6z" />
          <path d="M72 29c1.4-2.6 4-2.6 5.2 0 1.2 2.6 0 5-2.6 5s-3.8-2.4-2.6-5z" />
        </g>
        <circle cx="88" cy="48" r="2" fill="#2b3a4f" />
        <circle cx="107" cy="39" r="1.6" fill="#2b3a4f" />
        <circle cx="74" cy="31" r="1.4" fill="#2b3a4f" />
      </g>
    </svg>
  );
}

export function MotherSilhouette({ size = 180, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 260"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M120 30c8 6 12 15 12 24 0 8-4 14-10 18"
        stroke="#2b3a4f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M108 62c-14 0-26 10-28 24-2 16 2 30 2 46 0 22-6 40-18 56"
        stroke="#2b3a4f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M122 70c12 4 20 14 22 28 2 16-2 30-4 46-2 20 4 36 16 50"
        stroke="#2b3a4f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M84 132c-6 12-14 22-26 30"
        stroke="#2b3a4f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M136 128c10 4 20 2 28-6"
        stroke="#2b3a4f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M82 140c16 8 34 8 48 0 10 16 14 34 12 54-2 22-10 40-24 54"
        stroke="#4a7cae"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M88 156c14 6 30 6 44 0"
        stroke="#9dbddd"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M108 118c6 0 10 4 10 9 0 4-4 7-10 7s-10-3-10-7c0-5 4-9 10-9z"
        stroke="#2b3a4f"
        strokeWidth="1.3"
        fill="#e3ecf6"
      />
      <path
        d="M148 96c8-6 16-6 22-2-4 8-12 11-22 2z"
        stroke="#2b3a4f"
        strokeWidth="1.2"
        fill="#e3ecf6"
      />
      <path
        d="M162 92c3-4 6-4 8 0 2 3 1 6-2 6s-5-3-6-6z"
        stroke="#2b3a4f"
        strokeWidth="1"
        fill="#6f9bc8"
      />
    </svg>
  );
}

export function InfoIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 7.25v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="4.9" r="0.85" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.2l2.4 2.4 4.6-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SendIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M15.5 2.5L8 10M15.5 2.5l-5 13-2.5-5.5L2.5 7.5l13-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5l1.4 4.1 4.1 1.4-4.1 1.4L8 12.5 6.6 8.4 2.5 7l4.1-1.4L8 1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M13 10.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.2a1 1 0 001 .8h3.8a1 1 0 001-.8l.6-8.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
