export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/**
 * GA4 가상 페이지뷰 — 모달 노출 / 버튼 클릭 공통 트래킹
 *
 * 경로 설계:
 *   /modal/completion          완료 모달 노출
 *   /modal/unavailable-ep      미공개 회차 팝업 노출
 *   /click/heart               하트 버튼
 *   /click/mute/on|off         음소거 토글
 *   /click/bottomsheet/open    회차목록 열기
 *   /click/bottomsheet/episode 회차 선택
 *   /click/bottomsheet/series  다른 시리즈 선택
 *   /click/player/close        X 버튼
 *   /click/completion/other    다른 콘텐츠 보기
 *   /click/feed/swipe-next     다음 화 스와이프
 *   /click/feed/swipe-prev     이전 화 스와이프
 */
export function trackView(path: string, title?: string) {
  if (!GA_ID || typeof window === 'undefined') return;
  (window as any).gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title ?? path,
    page_location: `${window.location.origin}${path}`,
  });
}
