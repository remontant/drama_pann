import { useState, useRef, useEffect } from 'react';
import { SERIES, getSeries } from '@/lib/data';
import { trackView } from '@/lib/gtag';

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
  }));

  const otherSeries = SERIES;

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
          maxHeight: '82vh',
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
              {tab === 'episodes' ? '회차 정보' : '다른 콘텐츠'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 20 }}>
          {activeTab === 'episodes' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 8,
              }}
            >
              {allEpisodes.map((ep) => {
                const isCurrent = ep.idx === currentEpIdx;
                return (
                  <button
                    key={ep.ep}
                    onClick={() => handleEpClick(ep)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 10,
                      border: isCurrent
                        ? '2px solid var(--plot-red)'
                        : '1px solid rgba(255,255,255,0.12)',
                      background: isCurrent
                        ? 'rgba(229,9,20,0.18)'
                        : ep.available
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.02)',
                      color: isCurrent
                        ? 'var(--plot-red)'
                        : ep.available
                        ? '#fff'
                        : 'rgba(255,255,255,0.2)',
                      fontSize: 12,
                      fontWeight: isCurrent ? 700 : 500,
                      fontFamily: 'var(--font-mono)',
                      cursor: ep.available ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 120ms',
                    }}
                  >
                    {String(ep.ep).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
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
      {toastVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 16,
            right: 16,
            zIndex: 30,
            pointerEvents: 'none',
            opacity: toastExiting ? 0 : 1,
            transform: toastExiting ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 300ms ease, transform 300ms ease',
          }}
        >
          <div
            style={{
              background: 'rgba(38,38,38,0.97)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 10,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11.0002" r="8.70833" stroke="#BBBBBB" strokeWidth="0.916667" />
              <circle cx="11" cy="15.5832" r="0.916667" fill="#BBBBBB" />
              <rect x="10.0833" y="5.9585" width="1.83333" height="7.33333" rx="0.916667" fill="#BBBBBB" />
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#E1E1E1',
                fontFamily: 'var(--font-sans)',
                lineHeight: '20px',
                letterSpacing: '-1px',
              }}
            >
              {/* {series.title}의 이어지는 이야기는 현재 준비 중입니다. */}
              이어지는 이야기는 현재 준비 중입니다.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
