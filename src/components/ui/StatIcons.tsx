import clsx from "clsx";

type IconProps = { className?: string };

const base = "h-[1em] w-[1em]";

/** A launching rocket — used for the startups-incubated stat. */
export function RocketStatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={clsx(base, className)}>
      <path
        d="M24 4c5 3.5 8 9.5 8 16.5 0 4-1 7.6-2.6 10.7l-5.4 3.3-5.4-3.3C17 28.1 16 24.5 16 20.5 16 13.5 19 7.5 24 4Z"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="18" r="2.6" stroke="currentColor" strokeWidth="2.3" />
      <path
        d="M16.5 25 11 30.5V25a5 5 0 0 1 5.5-5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.5 25 37 30.5V25a5 5 0 0 0-5.5-5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 34.5 24 44l3.5-9.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A building floor-plate — used for the innovation-space stat. */
export function BuildingStatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={clsx(base, className)}>
      <rect x="10" y="8" width="20" height="36" rx="1.5" stroke="currentColor" strokeWidth="2.3" />
      <path d="M30 20h8v24h-8" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      {[13, 20, 27].map((y) => (
        <g key={y}>
          <line x1="14" y1={y} x2="18" y2={y} stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <line x1="22" y1={y} x2="26" y2={y} stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        </g>
      ))}
      <line x1="33" y1="25" x2="35" y2="25" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <line x1="33" y1="31" x2="35" y2="31" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M18 44v-7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v7" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  );
}

/** A coin marked with the rupee sign — used for external funding raised. */
export function RupeeStatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={clsx(base, className)}>
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.3" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="currentColor"
        fontFamily="var(--font-sans)"
      >
        ₹
      </text>
    </svg>
  );
}

/** A gear over a baseplate — used for the infrastructure & research stat. */
export function InfraStatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={clsx(base, className)}>
      <path d="M8 38h32" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="24" cy="20" r="7" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="24" cy="20" r="2.4" stroke="currentColor" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 24 + Math.cos(angle) * 9;
        const y1 = 20 + Math.sin(angle) * 9;
        const x2 = 24 + Math.cos(angle) * 11.5;
        const y2 = 20 + Math.sin(angle) * 11.5;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        );
      })}
      <path d="M16 38v-6a8 8 0 0 1 16 0v6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}
