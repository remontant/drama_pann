import { useEffect } from 'react';
import { LOGIN_SUCCESS_MESSAGE_TYPE, LOGIN_ACK_PARAM, LOGIN_ACK_VALUE } from '@/lib/loginPopup';

export default function LoginPopupAckBridge() {
  const ack = new URLSearchParams(window.location.search).get(LOGIN_ACK_PARAM);

  useEffect(() => {
    if (ack !== LOGIN_ACK_VALUE) return;

    const opener = window.opener;
    if (opener && !opener.closed) {
      opener.postMessage({ type: LOGIN_SUCCESS_MESSAGE_TYPE }, window.location.origin);
      window.close();
      return;
    }

    // opener 없으면 파라미터만 제거
    const url = new URL(window.location.href);
    url.searchParams.delete(LOGIN_ACK_PARAM);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }, [ack]);

  return null;
}
