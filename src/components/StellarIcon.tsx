export function StellarIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-label="StellarPay logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="url(#grad)" />
      <path
        d="M10 22L18 10L26 22H20L18 18L16 22H10Z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="18" cy="26" r="2.5" fill="white" fillOpacity="0.8" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B4D8" />
          <stop offset="1" stopColor="#7B2FBE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
