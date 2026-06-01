import { useEffect } from 'react';
import { LOGIN_ACK_PARAM, LOGIN_ACK_VALUE, LOGIN_MESSAGE_TYPE } from '@/lib/loginPopup';

/**
 * 로그인 팝업 콜백 처리.
 * 팝업 창에서 ?drama_login=1 파라미터를 감지하면 opener에 postMessage 후 자동으로 닫힌다.
 * App 최상단에 마운트.
 */
export default function LoginPopupAckBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(LOGIN_ACK_PARAM) !== LOGIN_ACK_VALUE) return;

    const opener = window.opener;
    if (opener && !opener.closed) {
      opener.postMessage({ type: LOGIN_MESSAGE_TYPE }, window.location.origin);
      window.close();
      return;
    }

    // opener 없으면 (팝업 차단됐다가 일반 탭으로 열린 경우) 파라미터만 제거
    const url = new URL(window.location.href);
    url.searchParams.delete(LOGIN_ACK_PARAM);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }, []);

  return null;
}
