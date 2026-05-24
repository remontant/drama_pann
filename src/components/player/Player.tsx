import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
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

export interface PlayerHandle {
  play: () => void;
  primeAudio: () => void; // 현재 no-op — 향후 활용 가능하도록 인터페이스 유지
}

interface Props {
  entry: FeedEntry;
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

const Player = forwardRef<PlayerHandle, Props>(function Player({
  entry,
  isMuted,
  onToggleMute,
  onOpenBottomSheet,
  onEnded,
  onProgressChange,
  onDurationChange,
}: Props, ref) {
  const series = getSeries(entry.seriesId)!;
  const [realDuration, setRealDuration] = useState(entry.duration ?? 90);
  const [paused, setPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const ytPlayer = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isMutedRef = useRef(isMuted);
  const pausedRef = useRef(paused);
  const onEndedRef = useRef(onEnded);
  const onProgressChangeRef = useRef(onProgressChange);
  const onDurationChangeRef = useRef(onDurationChange);
  isMutedRef.current = isMuted;
  pausedRef.current = paused;
  onEndedRef.current = onEnded;
  onProgressChangeRef.current = onProgressChange;
  onDurationChangeRef.current = onDurationChange;

  const videoUrl = entry.videoUrl || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
  const videoId = extractYoutubeId(videoUrl);

  useImperativeHandle(ref, () => ({
    play: () => {
      // gesture chain 안에서 호출됨
      try {
        if (!isMutedRef.current) {
          // 음소거가 해제된 상태로 스와이프해서 넘어왔을 때,
          // 브라우저 정책상 소리 있는 자동재생이 막히는 것을 방지하기 위해
          // unMute()를 명시적으로 호출하여 사용자 제스처를 전달
          ytPlayer.current?.unMute?.();
        }
        ytPlayer.current?.playVideo?.();
      } catch {}
    },
    primeAudio: () => {},
  }), []);

  // 1. Initialize Player ONCE
  useEffect(() => {
    if (!wrapperRef.current) return;
    let cancelled = false;

    const placeholder = document.createElement('div');
    wrapperRef.current.appendChild(placeholder);

    ensureYouTubeAPI().then(() => {
      if (cancelled || !placeholder.isConnected) return;
      try {
        ytPlayer.current = new (window as any).YT.Player(placeholder, {
          videoId: extractYoutubeId(entry.videoUrl || ''),
          playerVars: {
            autoplay: 1,
            mute: isMutedRef.current ? 1 : 0,
            controls: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (e: any) => {
              if (cancelled) return;
              try { e.target.getIframe().className = 'youtube-iframe-full'; } catch {}
              ytReadyRef.current = true;
              setIsReady(true);
              setIsError(false);
              
              if (!isMutedRef.current) {
                e.target.unMute();
              }
              e.target.playVideo();
            },
            onStateChange: (e: any) => {
              if (cancelled) return;
              if (e.data === 1) {
                setIsReady(true);
              } else if (e.data === 3) {
                setIsReady(false); // 버퍼링 중일 때 썸네일 노출
              }
              if (e.data === 0) {
                setTimeout(() => onEndedRef.current?.(), 0);
              }
            },
            onError: (e: any) => {
              console.warn('[Player] YouTube 오류:', e.data);
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
  }, []); // Run only once on mount

  // 2. Handle videoId changes
  useEffect(() => {
    if (!ytReadyRef.current || !ytPlayer.current) return;
    const vid = extractYoutubeId(entry.videoUrl || '');
    if (vid) {
      setIsReady(false);
      setIsError(false);
      ytPlayer.current.loadVideoById(vid);
      if (!isMutedRef.current) {
        ytPlayer.current.unMute();
      }
      ytPlayer.current.playVideo();
    }
  }, [entry.videoUrl]);

  useEffect(() => {
    const p = ytPlayer.current;
    if (!p?.playVideo) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    try {
      if (!paused) {
        try {
          const st = p.getPlayerState?.();
          if (st !== 1 && st !== 3) p.playVideo();
        } catch {}
        [600, 2500, 5000].forEach((delay) => {
          timers.push(setTimeout(() => {
            try {
              const currentSt = p.getPlayerState?.();
              if (currentSt !== 1 && currentSt !== 3 && !pausedRef.current) p.playVideo();
            } catch {}
          }, delay));
        });
      } else {
        p.pauseVideo();
      }
    } catch {}
    return () => timers.forEach(clearTimeout);
  }, [paused]);

  useEffect(() => {
    const p = ytPlayer.current;
    if (!p) return;
    try {
      isMuted ? p.mute() : p.unMute();
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  useEffect(() => {
    if (isReady || isError) return;
    const timer = setTimeout(() => setIsError(true), 15000);
    return () => clearTimeout(timer);
  }, [isReady, isError]);

  // Stuck audio recovery
  useEffect(() => {
    if (isMuted) return;
    const timer = setTimeout(() => {
      try {
        const p = ytPlayer.current;
        if (p?.getPlayerState?.() === 3) {
          console.warn(`[Player:${entry.ep}] audio 로딩 stuck — auto-mute fallback`);
          p.mute();
        }
      } catch {}
    }, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, entry.videoUrl]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const p = ytPlayer.current;
      if (!p?.getCurrentTime) return;
      try {
        const ct: number = p.getCurrentTime();
        const dur: number = p.getDuration();
        if (ct >= 0) onProgressChangeRef.current?.(ct);
        if (dur > 0) { setRealDuration(dur); onDurationChangeRef.current?.(dur); }
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [paused]);

  const togglePause = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-noprop]')) return;
    const willBePaused = !paused;
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

      {videoId && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: '#000', pointerEvents: 'none',
            opacity: isReady ? 0 : 1, transition: 'opacity 400ms ease',
          }}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      )}

      {isError && (
        <div
          data-noprop="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', inset: 0, zIndex: 6,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 16, background: 'rgba(0,0,0,0.75)',
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
              padding: '10px 24px', borderRadius: 8, background: 'var(--plot-red)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
              letterSpacing: '-0.3px', cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      )}

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
          try {
            // gesture chain에서 직접 처리
            if (isMuted) {
              ytPlayer.current?.unMute();
              ytPlayer.current?.setVolume(100);
              // 재생 중이 아니면 kick-start
              if (ytPlayer.current?.getPlayerState?.() !== 1 && !paused) {
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
        <RailButton onClick={() => {
          trackView('/click/bottomsheet/open', '회차목록 열기');
          vndrCall(NDR.EPISODE_LIST);
          onOpenBottomSheet();
        }}>
          <List size={22} strokeWidth={1.75} />
        </RailButton>
      </div>
    </div>
  );
});

export default Player;
