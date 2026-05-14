interface Props {
  value: number;
  total: number;
  thick?: boolean;
}

export default function ProgressBar({ value, total, thick = false }: Props) {
  const pct = Math.max(0, Math.min(100, (value / total) * 100));
  return (
    <div
      style={{
        height: thick ? 6 : 3,
        background: 'var(--ink-20)',
        borderRadius: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: '#E63946',
          borderRadius: 0,
          transition: 'width 200ms linear',
        }}
      />
    </div>
  );
}
