export function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M4.5 6.4c2.1-.9 4-.6 5.7.5 1 .7 2 .7 3 0 1.7-1.1 3.6-1.4 5.7-.5v11.1c-2.1-.9-4-.6-5.7.5-1 .7-2 .7-3 0-1.7-1.1-3.6-1.4-5.7-.5V6.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 7.2v10.7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Chevron({ className = "chevron" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check({ className = "check" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path
        d="M3.5 8.4 6.4 11.3 12.5 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
