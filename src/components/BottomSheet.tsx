import { useState, useRef, useEffect } from 'react';
import { SERIES, getSeries } from '@/lib/data';
import { trackView } from '@/lib/gtag';

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|\?v=))([\w-]{11})/);
  return match ? match[1] : null;
}

interface Props {
  seriesId: string;
  currentEpIdx: number;
  onClose: () => void;
  onSelectEpisode: (idx: number) => void;
  onSelectSeries: (id: string) => void;
}

export default function BottomSheet({
  seriesId,
  currentEpIdx,
  onClose,
  onSelectEpisode,
  onSelectSeries,
}: Props) {
  const series = getSeries(seriesId)!;
  const [activeTab, setActiveTab] = useState<'episodes' | 'other'>('episodes');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastExiting(false);
    setToastVisible(true);
    trackView('/toast/unavailable-episode', '미공개 회차 안내 토스트');
    toastTimerRef.current = setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setToastVisible(false), 300);
    }, 3000);
  };

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);

  const availableCount = series.episodes.length;
  const allEpisodes = Array.from({ length: series.totalEp }, (_, i) => ({
    ep: i + 1,
    available: i < availableCount,
    idx: i,
    videoUrl: i < availableCount ? series.episodes[i].videoUrl : undefined,
  }));

  const otherSeries = SERIES.filter((s) => s.id !== seriesId);

  const handleEpClick = (ep: { available: boolean; idx: number }) => {
    if (!ep.available) {
      showToast();
      trackView('/click/bottomsheet/episode/unavailable', '미공개 회차 클릭');
      return;
    }
    trackView('/click/bottomsheet/episode/available', '공개 회차 클릭');
    onSelectEpisode(ep.idx);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.targetTouches[0].clientY;
    dragDelta.current = 0;
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.targetTouches[0].clientY - dragStartY.current;
    if (delta > 0) {
      dragDelta.current = delta;
      if (sheetRef.current) {
        sheetRef.current.style.transition = 'none';
        sheetRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  };

  const onDragEnd = () => {
    if (dragDelta.current > 120) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)';
      sheetRef.current.style.transform = 'translateY(0)';
    }
    dragStartY.current = null;
    dragDelta.current = 0;
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 20 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0e0e0e',
          borderRadius: '20px 20px 0 0',
          height: 'calc(608 / 750 * 100dvh)',
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateY(0)',
          transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.25)',
            }}
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            //padding: '0 20px',
          }}
        >
          {(['episodes', 'other'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '1px solid var(--plot-red)' : '1px solid transparent',
                marginBottom: -1,
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.3px',
                cursor: 'pointer',
              }}
            >
              {tab === 'episodes' ? '회차정보' : '다른 콘텐츠'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px 0' }}>
          {activeTab === 'episodes' ? (
            <>
              {/* Series title */}
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 14,
                  padding: '0 4px',
                  letterSpacing: '-0.5px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {series.title}{' '}
                <span style={{ color: '#ccc', fontWeight: 500, fontSize: 15 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none" style={{ margin: '0 4px', verticalAlign: 'middle' }}>
                    <circle cx="2" cy="2" r="2" fill="#CCCCCC"/>
                  </svg>
                  총 {series.totalEp}화
                </span>
              </div>

              {/* 3-column episode grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  paddingBottom: 20,
                }}
              >
                {allEpisodes.map((ep) => {
                  const isCurrent = ep.idx === currentEpIdx;
                  return (
                    <button
                      key={ep.ep}
                      onClick={() => handleEpClick(ep)}
                      style={{
                        position: 'relative',
                        aspectRatio: '104/70',
                        borderRadius: 10,
                        border: isCurrent ? '2px solid var(--plot-red)' : '2px solid transparent',
                        background: '#242424',
                        cursor: ep.available ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        overflow: 'hidden',
                        transition: 'filter 120ms',
                      }}
                      onMouseEnter={(e) => {
                        if (ep.available) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
                      }}
                    >
                      {/* YouTube thumbnail (공개 화차만) */}
                      {ep.available && (() => {
                        const thumbId = extractYouTubeId(ep.videoUrl);
                        return thumbId ? (
                          <img
                            src={`https://img.youtube.com/vi/${thumbId}/mqdefault.jpg`}
                            alt=""
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center center',
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(145deg, #E50914 0%, #8B0000 100%)',
                          }} />
                        );
                      })()}

                      {/* 썸네일 위 어둠 오버레이 */}
                      {ep.available && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.25)',
                        }} />
                      )}

                      {/* Play button */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"
                        style={{ position: 'relative', zIndex: 1, opacity: ep.available ? 1 : 0.3 }}
                      >
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="black" fillOpacity="0.5"/>
                        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#999999"/>
                        <path d="M12.2667 20.6446V11.0455C12.2667 10.1965 13.2103 9.68772 13.9196 10.1543L21.0719 14.8598C21.7055 15.2767 21.7139 16.203 21.088 16.6313L13.9357 21.5249C13.2278 22.0093 12.2667 21.5024 12.2667 20.6446Z" fill="white"/>
                      </svg>

                      {/* Episode number badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          zIndex: 1,
                          display: 'flex',
                          width: 36,
                          padding: '3px 0',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                          background: 'rgba(0, 0, 0, 0.30)',
                        }}
                      >
                        <span
                          style={{
                            color: '#FFF',
                            fontFamily: '"Apple SD Gothic Neo", var(--font-sans)',
                            fontSize: 13,
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '15px',
                            letterSpacing: '-0.5px',
                          }}
                        >
                          {ep.ep}화
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
                paddingBottom: 20,
              }}
            >
              {otherSeries.map((s) => {
                const isCurrent = s.id === seriesId;
                return (
                  <button
                    key={s.id}
                    onClick={isCurrent ? undefined : () => { trackView(`/click/bottomsheet/series/${s.title}`, `시리즈 선택 ${s.title}`); onSelectSeries(s.id); }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: isCurrent ? 'default' : 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {/* 포스터 */}
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '3/4',
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#1a1a1a',
                      }}
                    >
                      <img
                        src={s.poster}
                        alt={s.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />

                      {/* 현재 시청 중 오버레이 — 기획 미포함, 추후 사용
                      {isCurrent && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(0,0,0,0.55)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} style={{ width: 3, borderRadius: 2, background: 'var(--plot-red)', animation: `nowPlayingBar 0.9s ease-in-out ${i * 0.15}s infinite alternate` }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)', background: 'rgba(229,9,20,0.85)', padding: '3px 8px', borderRadius: 4 }}>시청 중</div>
                        </div>
                      )}
                      */}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 미공개 회차 토스트 */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 10,
          right: 10,
          zIndex: 30,
          pointerEvents: 'none',
          opacity: toastVisible && !toastExiting ? 1 : 0,
          transform: toastVisible && !toastExiting ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 250ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 355,
            padding: '16px 65.5px',
            alignItems: 'center',
            gap: 6,
            borderRadius: 8,
            background: '#FFF',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 15, color: '#222', lineHeight: 1, flexShrink: 0 }}>ⓘ</span>
          <span
            style={{
              color: '#222',
              fontFamily: '"Apple SD Gothic Neo", var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              lineHeight: '15px',
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap',
            }}
          >
            이어지는 이야기는 현재 준비 중입니다.
          </span>
        </div>
      </div>
    </div>
  );
}
