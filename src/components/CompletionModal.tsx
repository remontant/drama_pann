import { useEffect } from 'react';
import { trackView } from '@/lib/gtag';
import { getSeries } from '@/lib/data';

interface Props {
  seriesId: string;
  onOtherContent: () => void;
  onClose: () => void;
}

export default function CompletionModal({ seriesId, onOtherContent, onClose }: Props) {
  const series = getSeries(seriesId)!;
  useEffect(() => { trackView('/modal/completion', '완료 모달'); }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          margin: '0 16px 32px',
          background: '#1c1c1c',
          borderRadius: 20,
          padding: '32px 20px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.5px',
            lineHeight: '26px',
            marginBottom: 14,
          }}
        >
          드라마 판 재미있게 보셨나요?
        </div>

        <div
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '22px',
            letterSpacing: '-0.3px',
            marginBottom: 28,
          }}
        >
          이어지는 이야기는 현재 준비 중입니다.
          <br />
          곧 이용하실 수 있도록 준비중이니
          <br />
          조금만 기다려 주세요!
        </div>

        <button
          onClick={() => { trackView('/click/completion/other-content', '다른 콘텐츠 보기'); onOtherContent(); }}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 12,
            background: 'var(--plot-red)',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.3px',
            cursor: 'pointer',
          }}
        >
          다른 컨텐츠 보기
        </button>
      </div>
    </div>
  );
}
