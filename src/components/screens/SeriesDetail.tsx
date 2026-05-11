'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft } from '@/components/Icons';
import { getSeries, fmtTime } from '@/lib/data';

interface Props {
  seriesId: string;
  onBack: () => void;
  onWatch: () => void;
}

export default function SeriesDetail({ seriesId, onBack, onWatch }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const s = getSeries(seriesId);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past the hero section
      setShowStickyCTA(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!s) return null;

  return (
    <div
      style={{
        background: 'var(--paper)',
      }}
    >
      {/* Hero */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '9/12' }}>
        <Image
          src={s.poster}
          alt={s.title}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        {/* Fade to paper */}
        <div
          style={{
            position: 'absolute',
            inset: 'auto 0 0 0',
            height: '60%',
            background:
              'linear-gradient(to top, var(--paper) 0%, var(--paper-00) 100%)',
          }}
        />
        {/* Back button */}
        <button
          onClick={onBack}
          aria-label="뒤로"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            width: 36,
            height: 36,
            borderRadius: 9999,
            background: 'var(--paper-40)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--ink-20)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink)',
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Meta block */}
      <div
        style={{
          padding: '0 20px 32px',
          marginTop: -20,
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(to top, var(--paper) 70%, var(--paper-00) 100%)',
          paddingTop: 40,
        }}
      >
        {s.directorInfo && (
          <div
            style={{
              color: 'var(--ink-80)',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              letterSpacing: '-0.01em',
            }}
          >
            {s.directorInfo}
          </div>
        )}

        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            margin: '0 0 10px',
            color: 'var(--ink)',
          }}
        >
          {s.title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg-3)',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          {s.year && <span>{s.year}</span>}
          {s.year && <span style={{ opacity: 0.4 }}>·</span>}
          <span>에피소드 {s.totalEp}개</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: s.keywords && s.keywords.length > 0 ? 12 : 24,
          }}
        >
          {s.gradeAge && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 5px',
                border: '1px solid var(--ink-40)',
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--ink-80)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {s.gradeAge}
            </div>
          )}
          {s.gradeTheme && s.gradeTheme.length > 0 && (
            <div style={{ fontSize: 13, color: 'var(--ink-80)', fontWeight: 500 }}>
              {s.gradeTheme.join(', ')}
            </div>
          )}
          {((s.gradeAge || (s.gradeTheme && s.gradeTheme.length > 0)) && s.genre) && (
            <span style={{ opacity: 0.4, fontSize: 13 }}>·</span>
          )}
          {s.genre && (
            <div style={{ fontSize: 13, color: 'var(--ink-80)', fontWeight: 500 }}>
              {s.genre}
            </div>
          )}
        </div>

        {s.keywords && s.keywords.length > 0 && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--ink)',
              fontWeight: 600,
              marginBottom: 24,
              lineHeight: 1.4,
            }}
          >
            {s.keywords.join(' · ')}
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={onWatch}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--r-md)',
            background: 'var(--plot-red)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 12,
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'var(--plot-red-hover)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              'var(--plot-red)')
          }
        >
          다음 편 보기 · EP{String(s.episodes[0].ep).padStart(2, '0')}
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onWatch}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--r-md)',
            background: 'transparent',
            color: 'var(--ink)',
            border: '1px solid var(--ink-10)',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          처음부터 보기
        </button>

        {/* Details (Synopsis, Cast, Creator) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {s.synopsis && (
            <p
              style={{
                color: 'var(--ink-80)',
                fontSize: 14,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {s.synopsis}
            </p>
          )}

          {s.cast && s.cast.length > 0 && (
            <div style={{ fontSize: 13, color: 'var(--ink-40)' }}>
              <span style={{ color: 'var(--ink-60)', marginRight: 6 }}>출연진:</span>
              {s.cast.join(', ')}
            </div>
          )}

          {s.creator && (
            <div style={{ fontSize: 13, color: 'var(--ink-40)' }}>
              <span style={{ color: 'var(--ink-60)', marginRight: 6 }}>크리에이터:</span>
              {s.creator}
            </div>
          )}
        </div>

        {/* Episode list */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--fg-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 500,
              marginBottom: 12,
            }}
          >
            에피소드
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: s.totalEp }, (_, i) => {
              const epNum = s.totalEp - i;
              const real = s.episodes.find((e) => e.ep === epNum);
              const title = real?.title ?? '공개 예정';
              const locked = !real;
              return (
                <div
                  key={epNum}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: '1px solid var(--ink-10)',
                    opacity: locked ? 0.4 : 1,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--fg-2)',
                      width: 36,
                      fontWeight: 500,
                    }}
                  >
                    EP{String(epNum).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                    {title}
                  </div>
                  {real && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--fg-3)',
                      }}
                    >
                      {fmtTime(real.duration)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Footer CTAs */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 24px',
          background: 'var(--paper)',
          borderTop: '1px solid var(--ink-10)',
          display: 'flex',
          gap: 10,
          zIndex: 50,
          transform: showStickyCTA ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          maxWidth: 690,
          margin: '0 auto',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          style={{
            flex: 1,
            padding: '12px 8px',
            borderRadius: 16,
            background: 'var(--paper-20)',
            color: 'var(--ink)',
            border: '1px solid var(--ink-20)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
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
          <span style={{ fontSize: 11, color: 'var(--ink-60)', fontWeight: 500 }}>다음 화 보기</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F5C518', fontSize: 14 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#F5C518"/>
              <circle cx="12" cy="12" r="7" fill="#E5A900"/>
              <path d="M12 16.5C9.5 16.5 7.5 14.5 7.5 12C7.5 9.5 9.5 7.5 12 7.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            200
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          style={{
            flex: 1,
            padding: '12px 8px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #E50914 0%, #B00710 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
            transition: 'transform 100ms, filter 150ms',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
          onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)')}
          onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)')}
        >
          <span style={{ fontSize: 11, opacity: 0.9, fontWeight: 500 }}>전체 관람 (할인)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: 10, fontWeight: 500 }}>
              15,000
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD700', fontSize: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#FFD700"/>
                <circle cx="12" cy="12" r="7" fill="#FDB813"/>
                <path d="M12 16.5C9.5 16.5 7.5 14.5 7.5 12C7.5 9.5 9.5 7.5 12 7.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              12,000
            </span>
          </div>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
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
