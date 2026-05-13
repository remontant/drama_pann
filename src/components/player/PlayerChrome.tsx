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
      {/* 상단 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 100,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 하단 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: '38%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
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
          padding: '24px 20px 0',
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

      {/* 하단 — 시리즈 정보 + 프로그레스 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 18px 20px',
          zIndex: 2,
        }}
      >
        {/* 시리즈명 + 에피소드 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            {series.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 500,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {String(ep).padStart(2, '0')}화
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            /{series.totalEp}화
          </span>
        </div>

        <ProgressBar value={progress} total={duration} />
      </div>
    </>
  );
}
