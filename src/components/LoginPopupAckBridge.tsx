import { useEffect } from 'react';
import { LOGIN_ACK_PARAM, LOGIN_ACK_VALUE } from '@/lib/loginPopup';

// 팝업이 차단돼서 메인 창에서 ?drama_login=1 파라미터가 붙은 경우 URL만 정리
export default function LoginPopupAckBridge() {
  useEffect(() => {
    const ack = new URLSearchParams(window.location.search).get(LOGIN_ACK_PARAM);
    if (ack !== LOGIN_ACK_VALUE) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(LOGIN_ACK_PARAM);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }, []);
  return null;
}
