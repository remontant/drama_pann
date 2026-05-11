'use client';

interface Props {
  ep: number;
  totalEp: number;
  time?: string;
}

export default function EpisodeBadge({ ep, totalEp, time }: Props) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 9999,
        background: 'var(--paper-40)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.02em',
        border: '1px solid var(--ink-10)',
      }}
    >
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {String(ep).padStart(2, '0')} <span style={{ opacity: 0.4, margin: '0 2px' }}>/</span> {String(totalEp).padStart(2, '0')}
      </span>
      {time && (
        <>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{time}</span>
        </>
      )}
    </div>
  );
}
