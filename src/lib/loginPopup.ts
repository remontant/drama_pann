export const LOGIN_SUCCESS_MESSAGE_TYPE = 'DRAMA_PANN_LOGIN_SUCCESS' as const;
export const LOGIN_ACK_PARAM = 'drama_login' as const;
export const LOGIN_ACK_VALUE = '1' as const;

export function appendLoginAckParam(url: string): string {
  const u = new URL(url);
  u.searchParams.set(LOGIN_ACK_PARAM, LOGIN_ACK_VALUE);
  return u.toString();
}

const W = 480, H = 800;

function popupFeatures(): string {
  const left = Math.round(window.screenX + (window.outerWidth - W) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - H) / 2);
  return `width=${W},height=${H},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`;
}

export function openLoginPopup(currentUrl: string = window.location.href): void {
  const callbackUrl = appendLoginAckParam(currentUrl);
  const loginUrl = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(callbackUrl)}`;

  const popup = window.open(loginUrl, 'dramaPannLogin', popupFeatures());
  if (!popup) {
    window.location.href = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(currentUrl)}`;
    return;
  }
  popup.focus();

  const onMessage = (e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
    if (e.data?.type !== LOGIN_SUCCESS_MESSAGE_TYPE) return;
    window.removeEventListener('message', onMessage);
    clearInterval(closePoll);
    window.dispatchEvent(new CustomEvent('drama-login-complete'));
  };
  window.addEventListener('message', onMessage);

  const closePoll = window.setInterval(() => {
    if (popup.closed) {
      clearInterval(closePoll);
      window.removeEventListener('message', onMessage);
    }
  }, 400);
}
