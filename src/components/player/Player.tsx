'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, List, Mute, Volume, Heart } from '@/components/Icons';
import PlayerChrome from './PlayerChrome';
import { FeedEntry, getSeries } from '@/lib/data';

// ── YouTube IFrame API 전역 로더 ─────────────────────────────────────────────
let _ytApiCallbacks: (() => void)[] = [];

function ensureYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    // 이미 로드된 경우 (정상 or HMR 후 재진입)
    if ((window as any).YT?.Player) {
      resolve();
      return;
    }
    _ytApiCallbacks.push(resolve);
    // 스크립트 태그가 이미 있으면 로드 완료 후 콜백이 호출될 때까지 대기
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    // 최초 1회 스크립트 삽입
    (window as any).onYouTubeIframeAPIReady = () => {
      _ytApiCallbacks.forEach((cb) => cb());
      _ytApiCallbacks = [];
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
  });
}

function extractYoutubeId(url: string) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|\?v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

interface Props {
  entry: FeedEntry;
  active: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBottomSheet: () => void;
  onEnded?: () => void;
  onProgressChange?: (progress: number) => void;
}

function RailButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 46,
        height: 46,
        borderRadius: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ink-10)',
        border: '1px solid var(--ink-20)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--ink)',
        cursor: 'pointer',
        transition: 'transform 80ms cubic-bezier(0.22,1,0.36,1), background 150ms',
      }}
      onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)')}
      onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );
}

export default function Player({
  entry,
  active,
  isMuted,
  onToggleMute,
  onOpenBottomSheet,
  onEnded,
  onProgressChange,
}: Props) {
  const series = getSeries(entry.seriesId)!;
  const [progress, setProgress] = useState(0);
  const [realDuration, setRealDuration] = useState(entry.duration ?? 90);
  const [paused, setPaused] = useState(false);

  // ── 플로팅 하트 ───────────────────────────────────────────────────────────────
  interface FloatingHeart {
    id: number;
    size: number;
    color: string;
    dxMid: number;
    dxEnd: number;
    rot: number;
    duration: number;
  }
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const HEART_COLORS = ['#ff2d55', '#ff6b8a', '#ff4f7b', '#ff1f5e', '#e5455a', '#ff5c8a'];

  const onHeartPress = useCallback(() => {
    const heart: FloatingHeart = {
      id: Date.now() + Math.random(),
      size: 18 + Math.floor(Math.random() * 14),
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      dxMid: (Math.random() - 0.5) * 36,
      dxEnd: (Math.random() - 0.5) * 72,
      rot: (Math.random() - 0.5) * 30,
      duration: 1100 + Math.random() * 500,
    };
    setFloatingHearts((prev) => [...prev, heart]);
    setTimeout(() => setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id)), heart.duration + 100);
  }, []);

  const ytPlayer = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 렌더마다 동기적으로 업데이트 — useEffect로 하면 onReady 콜백에서 stale 값 참조 위험
  const activeRef = useRef(active);
  const isMutedRef = useRef(isMuted);
  const onEndedRef = useRef(onEnded);
  activeRef.current = active;
  isMutedRef.current = isMuted;
  onEndedRef.current = onEnded;

  const videoUrl = entry.videoUrl || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
  const videoId = extractYoutubeId(videoUrl);

  // ── YT.Player 생성 ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!videoId || !wrapperRef.current) return;
    let cancelled = false;

    // 이전 플레이어 + iframe 정리
    if (ytPlayer.current) {
      try { ytPlayer.current.destroy(); } catch {}
      ytPlayer.current = null;
    }

    // placeholder div 생성 — YT.Player가 이 div를 iframe으로 교체
    const placeholder = document.createElement('div');
    wrapperRef.current.appendChild(placeholder);

    ensureYouTubeAPI()
      .then(() => {
        if (cancelled || !placeholder.isConnected) return;
        try {
          ytPlayer.current = new (window as any).YT.Player(placeholder, {
            videoId,
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
            },
            events: {
              onReady: (e: any) => {
                if (cancelled) return;
                // iframe에 전체화면 스타일 적용
                try {
                  e.target.getIframe().className = 'youtube-iframe-full';
                } catch {}
                // 실제 재생 길이
                const dur: number = e.target.getDuration();
                if (dur > 0) setRealDuration(dur);
                // 초기 상태 적용
                if (!isMutedRef.current) e.target.unMute();
                if (!activeRef.current) e.target.pauseVideo();
              },
              onStateChange: (e: any) => {
                // 0 = 영상 종료
                if (e.data === 0 && activeRef.current) {
                  setTimeout(() => onEndedRef.current?.(), 0);
                }
              },
            },
          });
        } catch (err) {
          console.error('[Player] YT.Player 생성 실패:', err);
        }
      });

    return () => {
      cancelled = true;
      if (ytPlayer.current) {
        try { ytPlayer.current.destroy(); } catch {}
        ytPlayer.current = null;
      }
      // placeholder가 아직 교체 전이면 직접 제거
      if (placeholder.isConnected) placeholder.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // ── 재생 / 일시정지 ──────────────────────────────────────────────────────────
  useEffect(() => {
    const p = ytPlayer.current;
    if (!p?.playVideo) return;
    try {
      active && !paused ? p.playVideo() : p.pauseVideo();
    } catch {}
  }, [active, paused]);

  // ── 음소거 토글 ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const p = ytPlayer.current;
    if (!p?.mute) return;
    try {
      isMuted ? p.mute() : p.unMute();
    } catch {}
  }, [isMuted]);

  // ── 비활성 시 처음으로 되감기 ────────────────────────────────────────────────
  useEffect(() => {
    if (!active) {
      setProgress(0);
      setPaused(false);
      try { ytPlayer.current?.seekTo(0, true); } catch {}
    }
  }, [active]);

  // ── 실시간 시간 폴링 (500ms) ─────────────────────────────────────────────────
  useEffect(() => {
    if (!active || paused) return;
    const interval = setInterval(() => {
      const p = ytPlayer.current;
      if (!p?.getCurrentTime) return;
      try {
        const ct: number = p.getCurrentTime();
        const dur: number = p.getDuration();
        if (ct >= 0) { setProgress(ct); onProgressChange?.(ct); }
        if (dur > 0) setRealDuration(dur);
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [active, paused, onProgressChange]);

  const togglePause = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-noprop]')) return;
    setPaused((p) => !p);
  }, []);

  return (
    <div
      onClick={togglePause}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--paper)',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* YT.Player가 내부에 iframe을 생성할 컨테이너 */}
      <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* 클릭 인터셉터 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* 일시정지 인디케이터 */}
      {paused && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3, pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 80, height: 80, borderRadius: 9999,
              background: 'var(--paper-60)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink)',
            }}
          >
            <Play size={32} strokeWidth={0} fill="var(--ink)" />
          </div>
        </div>
      )}

      {/* 플레이어 크롬 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <PlayerChrome series={series} ep={entry.ep!} progress={progress} duration={realDuration} />
      </div>

      {/* 플로팅 하트 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            style={{
              position: 'absolute',
              bottom: 153,
              right: 14 + 23 - heart.size / 2,
              width: heart.size,
              height: heart.size,
              animation: `floatHeart ${heart.duration}ms ease-out forwards`,
              '--dx-mid': `${heart.dxMid}px`,
              '--dx-end': `${heart.dxEnd}px`,
              '--rot': `${heart.rot}deg`,
            } as React.CSSProperties}
          >
            <Heart size={heart.size} fill={heart.color} strokeWidth={0} />
          </div>
        ))}
      </div>

      {/* 우측 버튼 레일 */}
      <div
        data-noprop="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', right: 14, bottom: 130, zIndex: 4,
          display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center',
        }}
      >
        <RailButton onClick={onToggleMute}>
          {isMuted ? <Mute size={22} strokeWidth={1.75} /> : <Volume size={22} strokeWidth={1.75} />}
        </RailButton>
        <RailButton onClick={onOpenBottomSheet}>
          <List size={22} strokeWidth={1.75} />
        </RailButton>
        <div style={{ height: 10 }} />
        <RailButton onClick={onHeartPress}>
          <Heart size={22} strokeWidth={1.75} />
        </RailButton>
      </div>
    </div>
  );
}
