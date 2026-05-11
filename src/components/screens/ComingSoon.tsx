'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FeedEntry, getSeries } from '@/lib/data';

interface Props {
  entry: FeedEntry;
  onBackToList: () => void;
}

export default function ComingSoon({ entry, onBackToList }: Props) {
  const [showModal, setShowModal] = useState(false);
  const s = getSeries(entry.seriesId)!;
  const releasedCount = s.episodes.length;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink)',
        padding: '0 32px',
        overflow: 'hidden',
      }}
    >
      {/* Blurred poster backdrop */}
      <Image
        src={s.poster}
        alt=""
        fill
        style={{
          objectFit: 'cover',
          filter: 'blur(40px) brightness(0.35)',
          transform: 'scale(1.15)',
        }}
        unoptimized
        aria-hidden
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, var(--paper-60) 0%, var(--paper-80) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          width: '100%',
          padding: '0 20px',
        }}
      >
        {/* Poster thumb */}
        <div
          style={{
            width: 120,
            height: 160,
            margin: '0 auto 28px',
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--ink-10)',
          }}
        >
          <Image
            src={s.poster}
            alt={s.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </div>


        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            margin: '0 0 16px',
            color: 'var(--ink)',
          }}
        >
          드디어 밝혀지는<br/>진짜 이야기
        </h2>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--ink-60)',
            margin: '0 0 32px',
          }}
        >
          더 파격적이고 더 아찔한 다음 편,<br/>지금 바로 확인해 보세요.
        </p>

        {/* Progress bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 9999,
              background: 'var(--ink-10)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(releasedCount / s.totalEp) * 100}%`,
                height: '100%',
                background: '#E63946',
                borderRadius: 9999,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--ink-80)',
              letterSpacing: '0.06em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {releasedCount}/{s.totalEp}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {/* Episode purchase button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            style={{
              flex: 1,
              padding: '14px 8px',
              borderRadius: 16,
              background: 'var(--paper-20)',
              color: 'var(--ink)',
              border: '1px solid var(--ink-20)',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'transform 100ms, background 150ms',
            }}
            onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)')}
            onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--paper-20)';
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--paper-40)')}
          >
            <span style={{ fontSize: 12, color: 'var(--ink-60)', fontWeight: 500 }}>다음 화 보기</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F5C518', fontSize: 16 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#F5C518"/>
                <circle cx="12" cy="12" r="7" fill="#E5A900"/>
                <path d="M12 16.5C9.5 16.5 7.5 14.5 7.5 12C7.5 9.5 9.5 7.5 12 7.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              800
            </span>
          </button>

          {/* Full series purchase button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            style={{
              flex: 1,
              padding: '14px 8px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #E50914 0%, #B00710 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
              transition: 'transform 100ms, filter 150ms',
              animation: 'btnGlow 2s infinite',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
            onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)')}
            onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)')}
          >
            <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>전체 관람 (할인)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: 11, fontWeight: 500 }}>
                12,500
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD700', fontSize: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#FFD700"/>
                  <circle cx="12" cy="12" r="7" fill="#FDB813"/>
                  <path d="M12 16.5C9.5 16.5 7.5 14.5 7.5 12C7.5 9.5 9.5 7.5 12 7.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                11,500
              </span>
            </div>
          </button>
        </div>

        {/* Back to list button detached */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBackToList();
          }}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 9999,
            background: 'transparent',
            color: 'var(--ink-40)',
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-60)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-40)')}
        >
          아니요, 다른 드라마 볼게요
        </button>
      </div>

      {showModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--paper-2)',
              padding: '24px 32px',
              borderRadius: 16,
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              border: '1px solid var(--ink-10)',
              maxWidth: 300,
              width: '100%',
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--ink)' }}>Coming Soon</h3>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.5 }}>
              해당 기능은 현재 준비 중입니다.<br/>조금만 기다려주세요!
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 9999,
                background: 'var(--plot-red)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
