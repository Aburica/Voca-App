interface VocaBirdProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function VocaBird({ size = 48, className = '', animated = false }: VocaBirdProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="voca bird mascot"
    >
      <defs>
        <linearGradient id="vocaBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD54F" />
          <stop offset="1" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id="vocaBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF8E1" />
          <stop offset="1" stopColor="#FFE082" />
        </linearGradient>
      </defs>
      <path d="M19 12 Q32 4 45 12" fill="none" stroke="#334B58" strokeWidth="3.5" strokeLinecap="round" className={animated ? 'origin-center animate-bob' : ''} />
      <rect x="14" y="10" width="7" height="10" rx="3.5" fill="#334B58" />
      <rect x="43" y="10" width="7" height="10" rx="3.5" fill="#334B58" />
      <path d="M8 22 Q32 60 56 22 L48 22 Q32 42 16 22 Z" fill="url(#vocaBody)" stroke="#FF8F00" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 24 Q32 50 48 24 L44 24 Q32 40 20 24 Z" fill="url(#vocaBelly)" opacity="0.6" />
      <circle cx="32" cy="24" r="12" fill="url(#vocaBody)" stroke="#FF8F00" strokeWidth="1.5" />
      <path d="M32 27 q3 3.5 0 4 q-3 -0.5 0 -4 z" fill="#FF8F00" />
      <circle cx="28" cy="22" r="2.6" fill="#1B2A33" />
      <circle cx="36" cy="22" r="2.6" fill="#1B2A33" />
      <circle cx="28.8" cy="21.2" r="0.9" fill="#fff" />
      <circle cx="36.8" cy="21.2" r="0.9" fill="#fff" />
      <circle cx="25" cy="27" r="1.8" fill="#FB7185" opacity="0.5" />
      <circle cx="39" cy="27" r="1.8" fill="#FB7185" opacity="0.5" />
    </svg>
  );
}

export function VocaLogo({ size = 36, showText = true, animated = false }: { size?: number; showText?: boolean; animated?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <VocaBird size={size} animated={animated} />
      {showText && (
        <span className="font-brand lowercase text-2xl font-extrabold tracking-tight text-ink-900 dark:text-ink-100">
          voca
        </span>
      )}
    </div>
  );
}
