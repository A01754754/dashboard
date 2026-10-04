// Marco logo: a tilted coffee bean with its S-shaped crease.
// The bean uses `currentColor`; the crease uses `cut` so it reads against the logo background.
export function CoffeeBeanMark({ size = 20, cut = 'currentColor', className = '' }: { size?: number; cut?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <g transform="rotate(35 12 12)">
        <ellipse cx="12" cy="12" rx="7" ry="10" fill="currentColor" />
        <path d="M12 2.6 C 8.2 7.4, 15.8 16.6, 12 21.4" fill="none" stroke={cut} strokeWidth="1.9" strokeLinecap="round" />
      </g>
    </svg>
  )
}
