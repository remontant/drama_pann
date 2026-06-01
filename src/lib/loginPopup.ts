export const LOGIN_SUCCESS_MESSAGE_TYPE = 'DRAMA_PANN_LOGIN_SUCCESS' as const;
export const LOGIN_ACK_PARAM = 'drama_login' as const;
export const LOGIN_ACK_VALUE = '1' as const;

const W = 480, H = 800;

function popupFeatures(): string {
  const left = Math.round(window.screenX + (window.outerWidth - W) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - H) / 2);
  return `width=${W},height=${H},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`;
}

export function openLoginPopup(currentUrl: string = window.location.href): void {
  const callbackUrl = new URL(currentUrl);
  callbackUrl.searchParams.set(LOGIN_ACK_PARAM, LOGIN_ACK_VALUE);

  const loginUrl = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(callbackUrl.toString())}`;

  const popup = window.open(loginUrl, 'dramaPannLogin', popupFeatures());
  if (!popup) {
    window.location.href = `https://xo.nate.com/mnate/Login.sk?redirect=${encodeURIComponent(currentUrl)}`;
    return;
  }
  popup.focus();

  // 부모가 400ms마다 팝업 URL을 확인해서 직접 닫음
  // - 팝업이 xo.nate.com(크로스오리진)이면 popup.location 접근 시 에러 → 로그인 중
  // - 팝업이 shortform.nate.com(동일오리진)으로 돌아오면 URL에 ?drama_login=1 감지 가능
  // - 부모가 popup.close() 호출 → window.opener/COOP 문제 없음
  const poll = window.setInterval(() => {
    if (popup.closed) {
      console.log('[login] popup closed');
      clearInterval(poll);
      return;
    }
    try {
      const href = popup.location.href;
      console.log('[login] popup url:', href);
      const params = new URLSearchParams(popup.location.search);
      if (params.get(LOGIN_ACK_PARAM) === LOGIN_ACK_VALUE) {
        console.log('[login] detected! closing popup');
        clearInterval(poll);
        popup.close();
        window.dispatchEvent(new CustomEvent('drama-login-complete'));
      }
    } catch (e: any) {
      console.log('[login] cross-origin (still on login page):', e?.message);
    }
  }, 400);
}
