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

        {/* 메인 CTA */}
        <a
          href={BASE}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: 'var(--plot-red)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            marginBottom: 40,
          }}
        >
          드라마판 바로가기 →
        </a>

        {/* 시리즈별 바로가기 */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 12,
            letterSpacing: '0.06em',
          }}
        >
          시리즈 직접 선택
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SERIES.map((s) => (
            <a
              key={s.id}
              href={`${BASE}?series=${s.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              <img
                src={s.poster}
                alt={s.title}
                style={{
                  width: 36,
                  height: 48,
                  borderRadius: 5,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {s.genre} · 총 {s.totalEp}화
                  {s.isComingSoon && (
                    <span style={{ marginLeft: 8, color: 'var(--plot-red)', fontWeight: 600 }}>
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
