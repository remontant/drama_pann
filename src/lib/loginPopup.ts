export const LOGIN_ACK_PARAM = 'drama_login' as const;
export const LOGIN_BROADCAST_CHANNEL = 'drama_pann_login' as const;

const W = 480, H = 800;

function popupFeatures(): string {
  const left = Math.round(window.screenX + (window.outerWidth - W) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - H) / 2);
  return `width=${W},height=${H},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`;
}

export function openLoginPopup(): void {
  // redirect URL = 현재 드라마판 URL + ?drama_login=1
  const callbackUrl = new URL(window.location.href);
  callbackUrl.searchParams.set(LOGIN_ACK_PARAM, '1');
  const loginUrl = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(callbackUrl.toString())}`;

  const popup = window.open(loginUrl, 'dramaPannLogin', popupFeatures());
  if (!popup) {
    window.location.href = loginUrl;
    return;
  }
  popup.focus();

  // BroadcastChannel로 로그인 완료 감지
  // storage 이벤트보다 안정적이고 COOP 영향 없음
  const bc = new BroadcastChannel(LOGIN_BROADCAST_CHANNEL);
  bc.onmessage = (e) => {
    if (e.data?.type !== 'login_complete') return;
    bc.close();
    clearInterval(closePoll);
    window.dispatchEvent(new CustomEvent('drama-login-complete'));
  };

  // 팝업 닫힘 감지 — 닫히면 채널 정리
  const closePoll = window.setInterval(() => {
    if (popup.closed) {
      clearInterval(closePoll);
      bc.close();
    }
  }, 400);
}
