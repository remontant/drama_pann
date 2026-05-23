import { useMemo, useState, useEffect, useRef } from 'react';
import { getFeedFor, getSeries } from '@/lib/data';
import Player, { PlayerHandle } from '@/components/player/Player';
import PlayerChrome from '@/components/player/PlayerChrome';
import { trackView } from '@/lib/gtag';
import { vndrCall, NDR } from '@/lib/ndr';

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
  const touchAreaRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDelta = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
  const activeProgressRef = useRef<number>(0);
  // gesture chain 안에서 다음/이전 Player의 playVideo()를 직접 호출하기 위한 핸들 맵
  const playerHandlesRef = useRef<Record<string, PlayerHandle | null>>({});

  const series = getSeries(seriesId)!;
  const currentEntry = feed[epIdx];

  // Safari iOS: non-passive touchmove로 페이지 스크롤 차단
  useEffect(() => {
    const el = touchAreaRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => { e.preventDefault(); };
    el.addEventListener('touchmove', handler, { passive: false });
    return () => el.removeEventListener('touchmove', handler);
  }, []);

  useEffect(() => {
    activeProgressRef.current = 0;
    setActiveProgress(0);
    setActiveDuration(currentEntry?.duration ?? 90);
  }, [epIdx, seriesId]);

  const prevSeriesRef = useRef(seriesId);
  useEffect(() => {
    const seriesChanged = prevSeriesRef.current !== seriesId;
    prevSeriesRef.current = seriesId;
    if (containerRef.current) {
      // 시리즈가 바뀐 경우 트랜지션 없이 즉시 위치 리셋 (슬라이드 인 모션 방지)
      containerRef.current.style.transition = seriesChanged ? 'none' : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      containerRef.current.style.transform = `translateY(-${epIdx * 100}%)`;
    }
  }, [epIdx, seriesId]);

  const isLastEp = epIdx === feed.length - 1;

  const tryGoNext = () => {
    if (isLastEp) {
      onShowCompletion();
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
    if (isLastEp && delta < 0) delta *= 0.3;
    touchDelta.current = delta;
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(calc(-${epIdx * 100}% + ${delta}px))`;
    }
  };

  const onTouchEnd = () => {
    if (touchStartY.current === null) return;
    const delta = touchDelta.current;
    const goingNext = delta < -50;

    if (containerRef.current) {
      // 마지막 화에서 위로 플리킹 → 모달만 띄우므로 튕겨 돌아오는 모션 없이 즉시 리셋
      const skipAnim = goingNext && isLastEp;
      containerRef.current.style.transition = skipAnim ? 'none' : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      containerRef.current.style.transform = `translateY(-${epIdx * 100}%)`;
    }

    if (goingNext) {
      trackView('/click/feed/swipe-next', '다음 화 스와이프');
      vndrCall(NDR.SWIPE_NEXT);
      // iOS gesture chain 안에서 직접 play() 호출 — useEffect 비동기 경로 우회
      if (!isLastEp) playerHandlesRef.current[feed[epIdx + 1]?.id]?.play();
      tryGoNext();
    } else if (delta > 50 && epIdx > 0) {
      trackView('/click/feed/swipe-prev', '이전 화 스와이프');
      vndrCall(NDR.SWIPE_PREV);
      playerHandlesRef.current[feed[epIdx - 1]?.id]?.play();
      onEpChange(epIdx - 1);
    }

    touchStartY.current = null;
    touchDelta.current = 0;
  };

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 800) return;
    if (e.deltaY > 30) {
      if (!isLastEp) playerHandlesRef.current[feed[epIdx + 1]?.id]?.play();
      tryGoNext();
      lastWheelTime.current = now;
    } else if (e.deltaY < -30 && epIdx > 0) {
      playerHandlesRef.current[feed[epIdx - 1]?.id]?.play();
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
        ref={touchAreaRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
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
                    ref={(handle) => { playerHandlesRef.current[entry.id] = handle; }}
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
