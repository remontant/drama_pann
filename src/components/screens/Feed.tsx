import { useMemo, useState, useEffect, useRef } from 'react';
import { getFeedFor, getSeries } from '@/lib/data';
import Player from '@/components/player/Player';
import PlayerChrome from '@/components/player/PlayerChrome';
import { trackView } from '@/lib/gtag';

interface Props {
  seriesId: string;
  epIdx: number;
  onEpChange: (idx: number) => void;
  onOpenBottomSheet: () => void;
  onShowCompletion: () => void;
}

export default function Feed({ seriesId, epIdx, onEpChange, onOpenBottomSheet, onShowCompletion }: Props) {
  const allFeed = useMemo(() => getFeedFor(seriesId), [seriesId]);
  const feed = useMemo(() => allFeed.filter((e) => !e.comingSoon), [allFeed]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeProgress, setActiveProgress] = useState(0);
  const [activeDuration, setActiveDuration] = useState(90);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDelta = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
  const activeProgressRef = useRef<number>(0);

  const series = getSeries(seriesId)!;
  const currentEntry = feed[epIdx];

  useEffect(() => {
    activeProgressRef.current = 0;
    setActiveProgress(0);
    setActiveDuration(currentEntry?.duration ?? 90);
  }, [epIdx, seriesId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      containerRef.current.style.transform = `translateY(-${epIdx * 100}%)`;
    }
  }, [epIdx]);

  const isLastEp = epIdx === feed.length - 1;

  const tryGoNext = () => {
    if (isLastEp) {
      const duration = feed[epIdx]?.duration ?? 90;
      if (activeProgressRef.current >= duration * 0.8) {
        onShowCompletion();
      }
      return;
    }
    onEpChange(epIdx + 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
    touchDelta.current = 0;
    if (containerRef.current) containerRef.current.style.transition = 'none';
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    let delta = e.targetTouches[0].clientY - touchStartY.current;
    if (epIdx === 0 && delta > 0) delta *= 0.3;
    else if (isLastEp && delta < 0) delta *= 0.3;
    touchDelta.current = delta;
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(calc(-${epIdx * 100}% + ${delta}px))`;
    }
  };

  const onTouchEnd = () => {
    if (touchStartY.current === null) return;
    const delta = touchDelta.current;

    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      containerRef.current.style.transform = `translateY(-${epIdx * 100}%)`;
    }

    if (delta < -50) {
      trackView('/click/feed/swipe-next', '다음 화 스와이프');
      tryGoNext();
    } else if (delta > 50 && epIdx > 0) {
      trackView('/click/feed/swipe-prev', '이전 화 스와이프');
      onEpChange(epIdx - 1);
    }

    touchStartY.current = null;
    touchDelta.current = 0;
  };

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 800) return;
    if (e.deltaY > 30) {
      tryGoNext();
      lastWheelTime.current = now;
    } else if (e.deltaY < -30 && epIdx > 0) {
      onEpChange(epIdx - 1);
      lastWheelTime.current = now;
    }
  };

  if (!feed.length) return null;

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--paper)' }}
    >
      {/* 스크롤되는 영상 영역 */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        style={{ position: 'absolute', inset: 0 }}
      >
        <div
          ref={containerRef}
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            transform: `translateY(-${epIdx * 100}%)`,
            transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {feed.map((entry, i) => {
            const isNear = Math.abs(i - epIdx) <= 1;
            return (
              <div
                key={entry.id}
                style={{ flex: '0 0 100%', width: '100%', height: '100%', position: 'relative' }}
              >
                {isNear && (
                  <Player
                    entry={entry}
                    active={i === epIdx}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted((p) => !p)}
                    onOpenBottomSheet={onOpenBottomSheet}
                    onProgressChange={(p) => {
                      activeProgressRef.current = p;
                      if (i === epIdx) setActiveProgress(p);
                    }}
                    onDurationChange={(d) => {
                      if (i === epIdx) setActiveDuration(d);
                    }}
                    onEnded={() => {
                      if (i === feed.length - 1) {
                        onShowCompletion();
                      } else {
                        onEpChange(i + 1);
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 고정 오버레이 — 헤더 + 인디케이터 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <PlayerChrome
          series={series}
          ep={currentEntry?.ep ?? 1}
          progress={activeProgress}
          duration={activeDuration}
        />
      </div>
    </div>
  );
}
