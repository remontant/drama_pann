import { useState, useEffect } from 'react';
import Feed from './screens/Feed';
import BottomSheet from './BottomSheet';
import CompletionModal from './CompletionModal';
import Main from './screens/Main';
import { SERIES } from '@/lib/data';

function pickRandomSeries(excludeId?: string): string {
  const available = SERIES.filter((s) => !s.isComingSoon && s.id !== excludeId);
  return available[Math.floor(Math.random() * available.length)].id;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'main') return <Main />;

  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [epIdx, setEpIdx] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qSeries = params.get('series');
    const found = qSeries ? SERIES.find((s) => s.id === qSeries) : null;
    setSeriesId(found ? found.id : pickRandomSeries());
    setMounted(true);
  }, []);

  const handleSelectSeries = (id: string) => {
    setSeriesId(id);
    setEpIdx(0);
    setShowBottomSheet(false);
  };

  const handleSelectEpisode = (idx: number) => {
    setEpIdx(idx);
    setShowBottomSheet(false);
  };

  const handleOtherContent = () => {
    setSeriesId(pickRandomSeries(seriesId ?? undefined));
    setEpIdx(0);
    setShowCompletion(false);
  };

  if (!mounted || !seriesId) return null;

  return (
    <>
      <div className="side-text side-text-left">
        DRAMA PANN <span style={{ opacity: 0.4 }}>·</span> 멈출 수 없는 엔딩, 판은 이미 시작됐다
      </div>
      <div className="side-text side-text-right">
        2026 <span style={{ opacity: 0.4 }}>·</span> VERTICAL CINEMA
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: 690,
          margin: '0 auto',
          minHeight: '100dvh',
          position: 'relative',
          background: 'var(--paper)',
        }}
      >
        <Feed
          seriesId={seriesId}
          epIdx={epIdx}
          onEpChange={setEpIdx}
          onOpenBottomSheet={() => setShowBottomSheet(true)}
          onShowCompletion={() => setShowCompletion(true)}
        />

        {showBottomSheet && (
          <BottomSheet
            seriesId={seriesId}
            currentEpIdx={epIdx}
            onClose={() => setShowBottomSheet(false)}
            onSelectEpisode={handleSelectEpisode}
            onSelectSeries={handleSelectSeries}
          />
        )}

        {showCompletion && (
          <CompletionModal
            seriesId={seriesId}
            onOtherContent={handleOtherContent}
            onClose={() => setShowCompletion(false)}
          />
        )}
      </div>
    </>
  );
}
