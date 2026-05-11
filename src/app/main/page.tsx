import Link from 'next/link';
import { SERIES } from '@/lib/data';

export default function MainPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: 24,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Drama<span style={{ color: '#e63946' }}>Pann</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>
          숏폼 드라마 테스트 메인 페이지
        </p>
      </div>

      {/* CTA — 랜덤 진입 */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '15px 32px',
          borderRadius: 50,
          background: '#e63946',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          boxShadow: '0 4px 24px rgba(230,57,70,0.45)',
        }}
      >
        ▶ 드라마판 보기
      </Link>

      {/* 시리즈별 직접 진입 링크 */}
      <div style={{ width: '100%', maxWidth: 360 }}>
        <p
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          시리즈별 직접 진입 (테스트용)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SERIES.map((s) => (
            <Link
              key={s.id}
              href={`/?series=${s.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                transition: 'background 150ms',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.poster}
                alt={s.title}
                width={40}
                height={40}
                style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <div>{s.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {s.genre} · {s.episodes.length}화 업로드
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
