import { useState, useEffect, useCallback, useRef } from 'react';
import { List, Mute, Volume } from '@/components/Icons';
import { FeedEntry, getSeries } from '@/lib/data';
import { trackView } from '@/lib/gtag';
import { vndrCall, NDR } from '@/lib/ndr';

let _ytApiCallbacks: (() => void)[] = [];

function ensureYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).YT?.Player) {
      resolve();
      return;
    }
    _ytApiCallbacks.push(resolve);
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
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
  onDurationChange?: (duration: number) => void;
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
  onDurationChange,
}: Props) {
  const series = getSeries(entry.seriesId)!;
  const [realDuration, setRealDuration] = useState(entry.duration ?? 90);
  const [paused, setPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const ytPlayer = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeRef = useRef(active);
  const isMutedRef = useRef(isMuted);
  const pausedRef = useRef(paused);
  const onEndedRef = useRef(onEnded);
  const onProgressChangeRef = useRef(onProgressChange);
  const onDurationChangeRef = useRef(onDurationChange);
  activeRef.current = active;
  isMutedRef.current = isMuted;
  pausedRef.current = paused;
  onEndedRef.current = onEnded;
  onProgressChangeRef.current = onProgressChange;
  onDurationChangeRef.current = onDurationChange;

  const videoUrl = entry.videoUrl || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
  const videoId = extractYoutubeId(videoUrl);

  useEffect(() => {
    if (!videoId || !wrapperRef.current) return;
    let cancelled = false;

    if (ytPlayer.current) {
      try { ytPlayer.current.destroy(); } catch {}
      ytPlayer.current = null;
    }

    const placeholder = document.createElement('div');
    wrapperRef.current.appendChild(placeholder);

    ensureYouTubeAPI().then(() => {
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
              try {
                e.target.getIframe().className = 'youtube-iframe-full';
              } catch {}
              const dur: number = e.target.getDuration();
              if (dur > 0) { setRealDuration(dur); onDurationChange?.(dur); }
              if (!isMutedRef.current) e.target.unMute();
              if (activeRef.current) {
                e.target.playVideo();
              } else {
                e.target.pauseVideo();
              }
              ytReadyRef.current = true;
              setIsReady(true);
              setIsError(false);
            },
            onStateChange: (e: any) => {
              if (cancelled) return;
              if (e.data === 0 && activeRef.current) {
                setTimeout(() => onEndedRef.current?.(), 0);
              }
            },
            onError: (e: any) => {
              const msg: Record<number, string> = {
                2: '잘못된 파라미터',
                5: 'HTML5 플레이어 오류',
                100: '영상 없음 또는 비공개',
                101: '퍼가기 차단된 영상',
                150: '퍼가기 차단된 영상',
              };
              console.warn('[Player] YouTube 오류:', e.data, msg[e.data] ?? '알 수 없음');
              if (!cancelled) setIsError(true);
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
      if (placeholder.isConnected) placeholder.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, retryCount]);

  useEffect(() => {
    const p = ytPlayer.current;
    if (!p?.playVideo) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    try {
      if (active && !paused) {
        p.playVideo();
        // 모바일 gesture 타임아웃 + YouTube 느린 초기화 대비 다단계 재시도
        [600, 2500, 5000].forEach((delay) => {
          timers.push(setTimeout(() => {
            try { if (p.getPlayerState?.() !== 1 && !pausedRef.current) p.playVideo(); } catch {}
          }, delay));
        });
      } else {
        p.pauseVideo();
      }
    } catch {}
    return () => timers.forEach(clearTimeout);
  }, [active, paused]);

  useEffect(() => {
    const p = ytPlayer.current;
    if (!p?.mute) return;
    try {
      isMuted ? p.mute() : p.unMute();
    } catch {}
  }, [isMuted]);

  useEffect(() => {
    if (!active) {
      setPaused(false);
      setIsReady(false);
      setIsError(false);
      try { ytPlayer.current?.seekTo(0, true); } catch {}
    } else if (ytReadyRef.current) {
      setIsReady(true);
    }
  }, [active]);

  // active 상태에서 15초 내 로딩 완료 안 되면 에러 처리
  useEffect(() => {
    if (!active || isReady || isError) return;
    const timer = setTimeout(() => setIsError(true), 15000);
    return () => clearTimeout(timer);
  }, [active, isReady, isError]);

  useEffect(() => {
    if (!active || paused) return;
    const interval = setInterval(() => {
      const p = ytPlayer.current;
      if (!p?.getCurrentTime) return;
      try {
        const ct: number = p.getCurrentTime();
        const dur: number = p.getDuration();
        if (ct >= 0) { onProgressChangeRef.current?.(ct); }
        if (dur > 0) { setRealDuration(dur); onDurationChangeRef.current?.(dur); }
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [active, paused]); // onProgressChange/onDurationChange는 ref로 접근해 deps 제외

  const togglePause = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-noprop]')) return;
    const willBePaused = !paused;
    // iOS gesture chain에서 직접 호출 — useEffect 비동기 경로 대신 동기 호출로 autoplay 차단 우회
    try {
      willBePaused ? ytPlayer.current?.pauseVideo() : ytPlayer.current?.playVideo();
    } catch {}
    setPaused(willBePaused);
  }, [paused]);

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
      <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* 썸네일 오버레이 — 플레이어 준비 전까지 검은 화면 대신 표시 */}
      {videoId && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: '#000',
            pointerEvents: 'none',
            opacity: isReady ? 0 : 1,
            transition: 'opacity 400ms ease',
          }}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
            }}
          />
        </div>
      )}


      {/* 에러 오버레이 — 로딩 타임아웃 또는 YouTube 에러 시 */}
      {isError && active && (
        <div
          data-noprop="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: 'rgba(0,0,0,0.75)',
          }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.3px' }}>
            영상을 불러올 수 없습니다
          </span>
          <button
            onClick={() => {
              setIsError(false);
              setIsReady(false);
              ytReadyRef.current = false;
              setRetryCount((c) => c + 1);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: 'var(--plot-red)',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.3px',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 우측 버튼 레일 */}
      <div
        data-noprop="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', right: 14, bottom: 86, zIndex: 4,
          display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center',
        }}
      >
        <RailButton onClick={() => {
          trackView(isMuted ? '/click/mute/off' : '/click/mute/on', '음소거 토글');
          vndrCall(NDR.MUTE);
          // iOS gesture chain: mute/unmute 직접 호출 + 멈춰있으면 playVideo 재시도
          try {
            if (isMuted) {
              ytPlayer.current?.unMute();
              if (ytPlayer.current?.getPlayerState?.() !== 1 && !pausedRef.current) {
                ytPlayer.current?.playVideo();
              }
            } else {
              ytPlayer.current?.mute();
            }
          } catch {}
          onToggleMute();
        }}>
          {isMuted ? <Mute size={22} strokeWidth={1.75} /> : <Volume size={22} strokeWidth={1.75} />}
        </RailButton>
        <RailButton onClick={() => { trackView('/click/bottomsheet/open', '회차목록 열기'); vndrCall(NDR.EPISODE_LIST); onOpenBottomSheet(); }}>
          <List size={22} strokeWidth={1.75} />
        </RailButton>
      </div>
    </div>
  );
}
