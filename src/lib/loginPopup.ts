export const LOGIN_STORAGE_KEY = 'drama_pann_login_at' as const;
export const LOGIN_ACK_PARAM = 'drama_login' as const;

const W = 480, H = 800;

function popupFeatures(): string {
  const left = Math.round(window.screenX + (window.outerWidth - W) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - H) / 2);
  return `width=${W},height=${H},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`;
}

export function openLoginPopup(currentUrl: string = window.location.href): void {
  const callbackUrl = new URL(currentUrl);
  callbackUrl.searchParams.set(LOGIN_ACK_PARAM, '1');
  const loginUrl = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(callbackUrl.toString())}`;

  const popup = window.open(loginUrl, 'dramaPannLogin', popupFeatures());
  if (!popup) {
    window.location.href = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(currentUrl)}`;
    return;
  }
  popup.focus();

  // COOP로 popup 참조가 끊기므로 popup.closed/location 모두 신뢰 불가.
  // storage 이벤트는 COOP 영향 없이 동일 도메인 창 간 동작함.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== LOGIN_STORAGE_KEY) return;
    window.removeEventListener('storage', onStorage);
    window.dispatchEvent(new CustomEvent('drama-login-complete'));
  };
  window.addEventListener('storage', onStorage);

  // 10분 후 자동 정리
  setTimeout(() => window.removeEventListener('storage', onStorage), 10 * 60 * 1000);
}
