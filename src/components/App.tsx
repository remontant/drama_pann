import { useState, useEffect } from 'react';
import Feed from './screens/Feed';
import BottomSheet from './BottomSheet';
import CompletionModal from './CompletionModal';
import Main from './screens/Main';
import { getAllSeries, setSeriesData, Series } from '@/lib/data';
import { firePagePV } from '@/lib/ndr';
import { trackView } from '@/lib/gtag';
import { fetchContents, fetchContent } from '@/lib/api';
import { LOGIN_ACK_PARAM, LOGIN_BROADCAST_CHANNEL } from '@/lib/loginPopup';

function pickRandomSeries(excludeId?: string): string {
  const available = getAllSeries().filter((s) => !s.isComingSoon && s.id !== excludeId);
  return available[Math.floor(Math.random() * available.length)].id;
}

/** API ApiContentDetail → 앱 내부 Series 변환 */
function toSeries(detail: Awaited<ReturnType<typeof fetchContent>>): Series {
  const base = import.meta.env.BASE_URL;
  return {
    id: detail.id,
    title: detail.title,
    tagline: detail.tagline ?? '',
    synopsis: detail.synopsis ?? '',
    poster: `${base}${detail.poster}`,
    genre: detail.genre ?? '',
    season: detail.season ?? 1,
    totalEp: detail.totalEp,
    stills: [],
    isComingSoon: detail.hidden,
    episodes: detail.episodes.map((e) => ({
      ep: e.ep,
      title: e.title,
      duration: e.duration,
      videoUrl: e.videoUrl,
    })),
  };
}

function PlayerApp() {
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [epIdx, setEpIdx] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      // API에서 콘텐츠 목록 + 상세(회차 포함) 로드
      try {
        const contents = await fetchContents();
        const details = await Promise.all(contents.map((c) => fetchContent(c.id)));
        setSeriesData(details.map(toSeries));
      } catch (err) {
        console.warn('[App] API 로드 실패, 하드코딩 데이터 사용:', err);
      }

      const params = new URLSearchParams(window.location.search);
      const qSeries = params.get('series');
      const found = qSeries ? getAllSeries().find((s) => s.id === qSeries) : null;
      setSeriesId(found ? found.id : pickRandomSeries());
      setMounted(true);
      firePagePV();
      trackView('/dramapann', '드라마판');
    })();
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
        2026 <span style={{ opacity: 0.4 }}>·</span> VERTICAL DRAMA
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: 650,
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

function LoginCallback() {
  useEffect(() => {
    const bc = new BroadcastChannel(LOGIN_BROADCAST_CHANNEL);
    bc.postMessage({ type: 'login_complete' });
    // 메시지 전달 후 창 닫기 — 즉시 닫으면 메시지가 전달 전에 소멸될 수 있음
    setTimeout(() => { bc.close(); window.close(); }, 300);
  }, []);
  return null;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'main' || window.location.hash === '#main') return <Main />;
  if (params.get(LOGIN_ACK_PARAM) === '1') return <LoginCallback />;
  return <PlayerApp />;
}
