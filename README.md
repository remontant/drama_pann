# Drama Pann (드라마판) — Shortform Vertical Drama Player

> "1분 만에 바뀌는 판도, 미친 몰입의 숏폼 드라마"

Drama Pann은 유튜브 기반 세로형 숏폼 시리즈 드라마를 감상할 수 있는 플랫폼 PoC(Proof of Concept)입니다.
틱톡/유튜브 쇼츠 스타일의 스와이프 피드 UX와 YouTube IFrame API 기반 플레이어를 결합해, 모바일 환경에 최적화된 숏폼 드라마 시청 경험을 검증합니다.

---

## 🚀 프로젝트 개요

- **목적**: 세로형 숏폼 비디오 피드 전환 UX 및 시청 행동 데이터 수집 검증
- **운영 기간**: 2주 라이브 PoC
- **배포**: [shortform.nate.com/dramapann](https://shortform.nate.com/dramapann)

### 주요 기능

- **숏폼 피드 플레이어**: 100% 뷰포트 세로형 YouTube 영상 재생
- **스와이프 에피소드 전환**: 터치(모바일) / 휠(PC) 상하 스와이프로 다음·이전 화 이동
- **회차 정보 바텀시트**: 전체 회차 목록(YouTube 썸네일) + 다른 콘텐츠 탭
- **시청 완료 모달**: 마지막 화 시청 후 노출
- **음소거 토글**: 최초 음소거 → 버튼으로 온/오프
- **통계 트래킹**: GA4 이벤트 + Nate NDR 클릭/PV 통계

---

## 🛠 기술 스택

| 항목 | 내용 |
|---|---|
| Framework | Vite 5.4 |
| Library | React 18.3 |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (CSS Variables 디자인 토큰) |
| Icons | Lucide React |
| Player | YouTube IFrame API (`YT.Player`) |
| Analytics | Google Analytics 4 + Nate NDR 통계 |
| Deployment | shortform.nate.com/dramapann |

---

## 📂 폴더 구조

```
dramaPann/
├── src/
│   ├── main.tsx                # 진입점
│   ├── components/
│   │   ├── App.tsx             # 루트 상태 관리 (시리즈, 에피소드, 모달)
│   │   ├── BottomSheet.tsx     # 회차정보 + 다른 콘텐츠 바텀시트
│   │   ├── CompletionModal.tsx # 시청 완료 모달
│   │   ├── DramaBi.tsx         # 드라마판 BI 컴포넌트
│   │   ├── Icons.tsx           # Lucide 아이콘 re-export
│   │   ├── ProgressBar.tsx     # 재생 프로그레스 바
│   │   ├── player/
│   │   │   ├── Player.tsx      # YouTube IFrame API 플레이어
│   │   │   └── PlayerChrome.tsx # 플레이어 UI 오버레이 (상단바, 하단 진행바)
│   │   └── screens/
│   │       ├── Feed.tsx        # 스와이프 피드 (에피소드 전환 로직)
│   │       └── Main.tsx        # 테스트용 메인 페이지 (?page=main)
│   └── lib/
│       ├── data.ts             # 시리즈·에피소드 데이터 + 유틸
│       ├── gtag.ts             # GA4 가상 URL 트래킹 유틸
│       └── ndr.ts              # Nate NDR 클릭/PV 통계 유틸
└── public/
    └── assets/
        ├── posters/            # 시리즈 포스터 이미지
        ├── og.svg              # OG 이미지
        └── favicon.svg         # 파비콘
```

---

## ⚙️ 실행 방법

**1. 의존성 설치**

```bash
npm install
```

**2. 환경변수 설정**

`.env.local` 생성 후 GA4 측정 ID 입력:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> GA_ID 없이도 실행 가능. 트래킹만 비활성화됨.

**3. 개발 서버 실행**

```bash
npm run dev
```

`http://localhost:5173` 접속

**4. 빌드**

```bash
npm run build
```

---

## 📊 통계 트래킹

### GA4 이벤트 (가상 URL 방식)

| 가상 경로 | 의미 |
|---|---|
| `/modal/completion` | 시청 완료 모달 노출 |
| `/click/mute/on` | 음소거 켜기 |
| `/click/mute/off` | 음소거 끄기 |
| `/click/bottomsheet/open` | 회차목록 열기 |
| `/click/bottomsheet/episode/available` | 공개 회차 클릭 |
| `/click/bottomsheet/episode/unavailable` | 미공개 회차 클릭 |
| `/click/bottomsheet/series/{시리즈명}` | 특정 시리즈 선택 |
| `/click/completion/other-content` | 다른 콘텐츠 보기 클릭 |
| `/click/feed/swipe-next` | 다음 화 스와이프 |
| `/click/feed/swipe-prev` | 이전 화 스와이프 |

### Nate NDR 통계 (pageId: mw2605)

| 구분 | 항목 | 값 |
|---|---|---|
| PV | 페이지 진입 | `m_ndr.nate.com/m_shortform/dramapann` |
| PV | 시청완료 모달 노출 | `m_ndr.nate.com/m_shortform/f_dramapann` |
| Click | 영상 탭 (일시정지/재생) | STD01 |
| Click | 음소거 버튼 | STD03 |
| Click | 회차목록 버튼 | STD04 |
| Click | 회차정보 탭 | STD05 |
| Click | 공개 회차 클릭 | STD06 |
| Click | 미공개 회차 클릭 | STD07 |
| Click | 다른 콘텐츠 탭 / 시리즈 선택 | STD08 |
| Click | 이전 화 스와이프 | STD09 |
| Click | 다음 화 스와이프 | STD10 |
| Click | 다른 컨텐츠 보기 버튼 | STD11 |

---

## 💡 주요 구현 포인트

### 1. YouTube IFrame API 기반 플레이어 (`Player.tsx`)
- `new YT.Player()` 공식 API로 생성, `getDuration()` / `getCurrentTime()` 500ms 폴링으로 실제 재생 시간 동기화
- HMR 재진입 대응: `window.YT?.Player` 존재 여부를 직접 체크해 Promise 블로킹 방지
- 모든 YT.Player 호출 try-catch 처리

### 2. 스와이프 피드 (`Feed.tsx`)
- React state가 아닌 DOM `transform` 직접 제어로 60fps 네이티브 앱 수준 스와이프 구현
- 마지막 화에서 80% 이상 시청 후 위 스와이프 시 완료 모달 노출

### 3. 회차 바텀시트 (`BottomSheet.tsx`)
- 공개 회차: YouTube 썸네일 이미지 자동 로드 (`img.youtube.com`)
- 현재 시청 중인 회차: 빨간 border 오버레이로 강조
- 미공개 회차 클릭 시 토스트 안내

### 4. 콘텐츠 데이터 (`lib/data.ts`)
- 8개 시리즈, 시리즈당 5~6화 YouTube URL 하드코딩
- 썸네일은 YouTube 이미지 CDN(`i.ytimg.com`) 사용
