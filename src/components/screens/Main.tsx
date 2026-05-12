import { SERIES } from '@/lib/data';

const BASE = import.meta.env.BASE_URL;

export default function Main() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0e0e0e',
        color: '#fff',
        padding: '40px 24px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>
            Drama<span style={{ color: 'var(--plot-red)' }}>Pann</span>
          </span>
          <span
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            테스트 메인
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SERIES.map((s) => (
            <a
              key={s.id}
              href={`${BASE}?series=${s.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              <img
                src={s.poster}
                alt={s.title}
                style={{
                  width: 44,
                  height: 60,
                  borderRadius: 6,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  {s.genre} · 총 {s.totalEp}화
                  {s.isComingSoon && (
                    <span
                      style={{
                        marginLeft: 8,
                        color: 'var(--plot-red)',
                        fontWeight: 600,
                      }}
                    >
                      준비중
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
