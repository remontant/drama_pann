import { X } from '@/components/Icons';
import ProgressBar from '@/components/ProgressBar';
import DramaBi from '@/components/DramaBi';
import { Series } from '@/lib/data';
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
      {/* 상단 solid bg */}
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 54,
          background: 'rgba(0,0,0,0.80)',
          pointerEvents: 'none',
        }}
      />

      {/* 하단 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: 86,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.60) 40%, #000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 상단 바 — BI + X */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 54,
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <DramaBi height={22} />

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
            width: 32,
            height: 32,
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--ink)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={22} strokeWidth={2} />
        </button>
      </div>

      {/* 시리즈명 + 에피소드 — bottom 40 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          padding: '0 18px',
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            fontWeight: 600,
            lineHeight: '24px',
            letterSpacing: '-0.5px',
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {series.title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: '20px',
            letterSpacing: '-0.5px',
            color: '#fff',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {String(ep).padStart(2, '0')}화
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '-0.5px',
            color: '#CCC',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          /{series.totalEp}화
        </span>
      </div>

      {/* 프로그레스바 — edge to edge, bottom 16 */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <ProgressBar value={progress} total={duration} />
      </div>
    </>
  );
}
