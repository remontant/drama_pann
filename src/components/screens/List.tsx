'use client';

import Image from 'next/image';
import { SERIES } from '@/lib/data';
import { Play, Search } from '@/components/Icons';

interface Props {
  onOpenSeries: (id: string) => void;
}

export default function List({ onOpenSeries }: Props) {
  const featured = SERIES[0];
  const rest = SERIES.slice(1);

  if (!featured) return null;

  return (
    <div
      style={{
        background: 'var(--paper)',
        fontFamily: 'var(--font-sans)',
        minHeight: '100vh',
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'var(--paper)',
          padding: '22px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--ink-10)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            lineHeight: 1,
          }}
        >
          Drama <span style={{ color: 'var(--plot-red)' }}>Pann</span>
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          padding: '20px 20px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--ink-60)',
          textTransform: 'uppercase',
        }}
      >
        NOW PLAYING
      </div>

      {/* Featured card */}
      <div style={{ padding: '0 20px 28px' }}>
        <button
          onClick={() => onOpenSeries(featured.id)}
          style={{
            display: 'block',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(15,14,13,0.20), 0 0 0 1px var(--ink-10)',
            }}
          >
            <Image
              src={featured.poster}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            {/* Bottom gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                height: '62%',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.25) 55%, transparent)',
              }}
            />
            {/* Genre chip */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                padding: '5px 10px',
                borderRadius: 9999,
                background: 'var(--paper-10)',
                border: '1px solid var(--paper-20)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--paper-80)',
                textTransform: 'uppercase',
              }}
            >
              {featured.genre}
            </div>
            {/* Text block */}
            <div
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 18,
                color: 'var(--ink)',
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: 6,
                }}
              >
                {featured.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: 'var(--ink-80)',
                  marginBottom: 14,
                }}
              >
                {featured.tagline}
              </div>
              {/* CTA */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 9999,
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                <Play size={14} strokeWidth={0} fill="var(--paper)" />
                <span>EP1부터 보기</span>
                <span
                  style={{
                    marginLeft: 4,
                    paddingLeft: 10,
                    borderLeft: '1px solid var(--paper-20)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--paper-60)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {featured.episodes.length}/{featured.totalEp} EP
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* ALL SERIES label */}
      <div
        style={{
          padding: '0 20px 6px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--ink-60)',
          textTransform: 'uppercase',
        }}
      >
        ALL SERIES · {SERIES.length}
      </div>

      {/* Series list rows */}
      <div
        style={{
          padding: '6px 12px 32px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {rest.map((s, i) => {
          const isComingSoon = s.isComingSoon;

          return (
            <button
              key={s.id}
              onClick={() => {
                if (!isComingSoon) onOpenSeries(s.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 8px',
                border: 'none',
                background: 'transparent',
                cursor: isComingSoon ? 'default' : 'pointer',
                textAlign: 'left',
                opacity: isComingSoon ? 0.4 : 1,
                borderBottom:
                  i < rest.length - 1 ? '1px solid var(--ink-10)' : 'none',
              }}
            >
              {/* Rank */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink-40)',
                  width: 22,
                  textAlign: 'center',
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(i + 2).padStart(2, '0')}
              </div>
              {/* Poster thumb */}
              <div
                style={{
                  width: 64,
                  height: 84,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                  boxShadow: '0 0 0 1px var(--ink-10)',
                }}
              >
                <Image
                  src={s.poster}
                  alt=""
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              {/* Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.title}
                  </div>
                  {isComingSoon && (
                    <div
                      style={{
                        padding: '3px 6px',
                        borderRadius: 4,
                        background: 'rgba(230,57,70,0.08)',
                        color: 'var(--plot-red)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9.5,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        flexShrink: 0,
                      }}
                    >
                      COMING SOON
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--ink-60)',
                    lineHeight: 1.4,
                    marginBottom: 6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'keep-all',
                  } as React.CSSProperties}
                >
                  {s.tagline}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: 'var(--ink-40)',
                  }}
                >
                  <span>{s.genre}</span>
                  <span
                    style={{
                      width: 2,
                      height: 2,
                      borderRadius: 9999,
                      background: 'var(--ink-20)',
                    }}
                  />
                  <span>
                    S{s.season} · {isComingSoon ? '공개 예정' : `${s.episodes.length}/${s.totalEp} EP`}
                  </span>
                </div>
              </div>
              {/* Play glyph */}
              {!isComingSoon && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    flexShrink: 0,
                    background: 'var(--plot-red)',
                    display: 'flex',
                    alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--paper)',
                }}
              >
                <Play size={14} strokeWidth={0} fill="var(--paper)" />
              </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '20px 20px 32px',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'var(--ink-40)',
          textAlign: 'center',
        }}
      >
        판보다 더 판 같은 드라마 · DRAMA PANN
      </div>
    </div>
  );
}
