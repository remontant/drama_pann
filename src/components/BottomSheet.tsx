import { useState, useRef } from 'react';
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
  const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);

  const availableCount = series.episodes.length;
  const allEpisodes = Array.from({ length: series.totalEp }, (_, i) => ({
    ep: i + 1,
    available: i < availableCount,
    idx: i,
  }));

  const otherSeries = SERIES.filter((s) => s.id !== seriesId).slice(0, 8);

  const handleEpClick = (ep: { available: boolean; idx: number }) => {
    if (!ep.available) {
      setShowUnavailablePopup(true);
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.25)',
            }}
          />
        </div>

        {/* Series header */}
        <div style={{ padding: '8px 20px 16px' }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              marginBottom: 3,
            }}
          >
            {series.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            총 {series.totalEp}화
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0 20px',
          }}
        >
          {(['episodes', 'other'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--plot-red)' : '2px solid transparent',
                marginBottom: -1,
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}
            >
              {tab === 'episodes' ? '회차정보' : '다른 콘텐츠'}
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
                    {ep.ep}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 14,
              }}
            >
              {otherSeries.map((s) => (                <button
                  key={s.id}
                  onClick={() => { trackView(`/click/bottomsheet/series/${s.title}`, `시리즈 선택 ${s.title}`); onSelectSeries(s.id); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '3/4',
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: '#1a1a1a',
                      marginBottom: 6,
                    }}
                  >
                    <img
                      src={s.poster}
                      alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#fff',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 1.3,
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: 2,
                    }}
                  >
                    {s.genre}
                  </div>
                </button>
              ))}

              {/* 준비중 플레이스홀더 */}
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    aspectRatio: '3/4',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px dashed rgba(255,255,255,0.12)',
                    marginBottom: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 22 }}>🎬</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    준비중
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.3,
                  }}
                >
                  Coming Soon
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unavailable episode popup */}
      {showUnavailablePopup && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            padding: 24,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              background: '#1c1c1c',
              borderRadius: 16,
              padding: '28px 24px 24px',
              width: '100%',
              maxWidth: 300,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                marginBottom: 10,
              }}
            >
              드라마 판 재미있게 보셨나요?
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.65,
                marginBottom: 22,
              }}
            >
              이어지는 이야기는 현재 준비중입니다.
              <br />
              곧 이용하실 수 있도록 준비중이오니
              <br />
              조금만 기다려주세요!
            </div>
            <button
              onClick={() => setShowUnavailablePopup(false)}
              style={{
                width: '100%',
                padding: '12px 0',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
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
