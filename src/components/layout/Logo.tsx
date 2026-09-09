/** Marca do aplicativo: o pote, com os filmes dentro. */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M20 20h24l-2.5 5.5a4 4 0 0 0 .4 4l1.6 2.3A14 14 0 0 1 32 54a14 14 0 0 1-11.5-22.2l1.6-2.3a4 4 0 0 0 .4-4z"
        className="fill-pote-accent"
      />
      <rect x="17" y="14" width="30" height="6" rx="3" className="fill-pote-accent-strong" />
      <circle cx="27" cy="41" r="3" className="fill-pote-bg" />
      <circle cx="37" cy="45" r="2.5" className="fill-pote-bg" />
      <circle cx="36" cy="35" r="2" className="fill-pote-bg" />
    </svg>
  )
}
