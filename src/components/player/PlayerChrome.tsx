import { X } from '@/components/Icons';
import ProgressBar from '@/components/ProgressBar';
import { Series, fmtTime } from '@/lib/data';
import { trackView } from '@/lib/gtag';

interface Props {
  series: Series;
  ep: number;
  progress: number;
  duration: number;
}

export default function PlayerChrome({ series, ep, progress, duration }: Props) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 80,
          background: 'rgba(0,0,0,0.92)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          height: 60,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: '38%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2) 60%, transparent)',
          pointerEvents: 'none',
        }}
      />
      {/* 하단 인디케이터 전용 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: 90,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 40%, transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '22px 20px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            Drama<span style={{ color: 'var(--plot-red)' }}>Pann</span>
          </span>
          <span style={{ color: 'var(--ink-30)', fontSize: 12 }}>·</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--ink-80)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {series.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--ink-50)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {ep}/{series.totalEp}
          </span>
        </div>

        <button
          data-noprop="true"
          onClick={(e) => {
            e.stopPropagation();
            trackView('/click/player/close', '플레이어 닫기');
            if (window.history.length <= 1) {
              window.close();
            } else {
              window.history.back();
            }
          }}
          aria-label="닫기"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--paper-40)',
            border: '1px solid var(--ink-10)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'var(--ink)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Bottom meta */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 18px 20px',
          zIndex: 2,
          color: 'var(--ink)',
        }}
      >
        <ProgressBar value={progress} total={duration} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-60)',
            marginTop: 6,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{fmtTime(progress)}</span>
          <span>{fmtTime(duration)}</span>
        </div>
      </div>
    </>
  );
}
