import { fetchMe } from '@/lib/api';

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

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(poll);
    window.removeEventListener('storage', onStorage);
    window.dispatchEvent(new CustomEvent('drama-login-complete'));
  };

  // ① localStorage storage 이벤트 — 데스크톱 / iOS 일반 모드
  const onStorage = (e: StorageEvent) => {
    if (e.key !== LOGIN_STORAGE_KEY) return;
    finish();
  };
  window.addEventListener('storage', onStorage);

  // ② fetchMe() 폴링 — iOS 개인정보 보호 탭 (localStorage 탭간 격리)
  let count = 0;
  const poll = setInterval(async () => {
    count++;
    if (count > 90) { // 최대 3분
      clearInterval(poll);
      window.removeEventListener('storage', onStorage);
      return;
    }
    try {
      const me = await fetchMe();
      if (me.isLogin) finish();
    } catch {}
  }, 2000);
}
