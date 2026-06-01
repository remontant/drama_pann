export const LOGIN_MESSAGE_TYPE = 'DRAMA_PANN_LOGIN_SUCCESS' as const;

const W = 480, H = 800;

function popupFeatures(): string {
  const left = Math.round(window.screenX + (window.outerWidth - W) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - H) / 2);
  return `width=${W},height=${H},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`;
}

/**
 * 네이트 로그인 팝업을 열고, 로그인 완료 시 window에 'drama-login-complete' 이벤트를 dispatch한다.
 * 팝업 차단 시 현재 탭에서 로그인 페이지로 이동.
 */
export function openLoginPopup(): void {
  const callbackUrl = `${window.location.origin}/dramapann/login-callback.html`;
  const loginUrl = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(callbackUrl)}`;

  const popup = window.open(loginUrl, 'dramaPannLogin', popupFeatures());
  if (!popup) {
    // 팝업 차단 시 현재 탭에서 로그인 후 드라마판으로 복귀
    window.location.href = loginUrl;
    return;
  }
  popup.focus();

  // 로그인 완료 메시지 수신
  const onMessage = (e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
    if (e.data?.type !== LOGIN_MESSAGE_TYPE) return;
    window.removeEventListener('message', onMessage);
    clearInterval(closePoll);
    window.dispatchEvent(new CustomEvent('drama-login-complete'));
  };
  window.addEventListener('message', onMessage);

  // 팝업 닫힘 감지 — 닫히면 리스너 정리
  const closePoll = window.setInterval(() => {
    if (popup.closed) {
      clearInterval(closePoll);
      window.removeEventListener('message', onMessage);
    }
  }, 400);
}
