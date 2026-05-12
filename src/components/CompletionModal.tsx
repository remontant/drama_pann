import { useEffect } from 'react';
import { X } from '@/components/Icons';
import { getSeries } from '@/lib/data';
import { trackView } from '@/lib/gtag';

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
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      <div
        style={{
          background: '#1c1c1c',
          borderRadius: 16,
          padding: '32px 24px 24px',
          width: '100%',
          maxWidth: 300,
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        <div
          style={{
            fontSize: 16,
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
            marginBottom: 6,
          }}
        >
          {series.title}의 이야기는 현재 준비중입니다.
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.65,
            marginBottom: 26,
          }}
        >
          곧 이용하실 수 있도록 준비중이오니
          <br />
          조금만 기다려주세요!
        </div>
        <button
          onClick={() => { trackView('/click/completion/other-content', '다른 콘텐츠 보기'); onOtherContent(); }}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 10,
            background: 'var(--plot-red)',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
          }}
        >
          다른 콘텐츠 보기
        </button>
      </div>
    </div>
  );
}
