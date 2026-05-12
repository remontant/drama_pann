# Drama Pann (드라마판) — Shortform Vertical Drama Player

> "1분 만에 바뀌는 판도, 미친 몰입의 숏폼 드라마"

Drama Pann은 유튜브 기반 세로형 숏폼 시리즈 드라마를 감상할 수 있는 플랫폼 PoC(Proof of Concept)입니다.
틱톡/유튜브 쇼츠 스타일의 스와이프 피드 UX와 YouTube IFrame API 기반 플레이어를 결합해, 모바일 환경에 최적화된 숏폼 드라마 시청 경험을 검증합니다.

---

## 🚀 프로젝트 개요

- **목적**: 세로형 숏폼 비디오 피드 전환 UX 및 시청 행동 데이터 수집 검증
- **운영 기간**: 2주 라이브 PoC
- **배포**: [drama-pann.vercel.app](https://drama-pann.vercel.app)

### 주요 기능

- **숏폼 피드 플레이어**: 100% 뷰포트 세로형 YouTube 영상 재생
- **스와이프 에피소드 전환**: 터치(모바일) / 휠(PC) 상하 스와이프로 다음·이전 화 이동
- **회차 정보 바텀시트**: 전체 회차 목록 + 다른 콘텐츠 탭
- **시청 완료 모달**: 마지막 화 시청 후 노출
- **플로팅 하트 애니메이션**: 인스타 라이브 스타일 연속 하트 UI
- **음소거 토글**: 최초 음소거 → 버튼으로 온/오프
- **GA4 이벤트 트래킹**: 가상 URL 기반 클릭/노출 수치 수집

---

## 🛠 기술 스택

| 항목 | 내용 |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Library | React 18 |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (CSS Variables 디자인 토큰) |
| Icons | Lucide React |
| Player | YouTube IFrame API (`YT.Player`) |
| Analytics | Google Analytics 4 (가상 URL 방식) |
| Deployment | Vercel |

---

## 📂 폴더 구조

```
drama_pann/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃, GA4 스크립트 삽입
│   │   ├── globals.css         # 디자인 토큰 및 전역 스타일
│   │   ├── page.tsx            # 진입점 → App 렌더
│   │   └── main/
│   │       └── page.tsx        # 테스트용 메인 페이지 (/main)
│   ├── components/
│   │   ├── App.tsx             # 루트 상태 관리 (시리즈, 에피소드, 모달)
│   │   ├── BottomSheet.tsx     # 회차정보 + 다른 콘텐츠 바텀시트
│   │   ├── CompletionModal.tsx # 시청 완료 모달
│   │   ├── Icons.tsx           # Lucide 아이콘 re-export
│   │   ├── ProgressBar.tsx     # 재생 프로그레스 바
│   │   ├── player/
│   │   │   ├── Player.tsx      # YouTube IFrame API 플레이어 + 하트 애니메이션
│   │   │   └── PlayerChrome.tsx # 플레이어 UI 오버레이 (상단바, 하단 진행바)
│   │   └── screens/
│   │       └── Feed.tsx        # 스와이프 피드 (에피소드 목록 + 전환 로직)
│   └── lib/
│       ├── data.ts             # 시리즈·에피소드 하드코딩 데이터 + 유틸
│       └── gtag.ts             # GA4 가상 URL 트래킹 유틸
└── public/
    └── assets/                 # 파비콘, 로고 SVG
```

---

## ⚙️ 실행 방법

**1. 의존성 설치**

```bash
npm install
```

**2. 환경변수 설정**

`.env.local.example`을 복사해 `.env.local` 생성 후 GA4 측정 ID 입력:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> GA_ID 없이도 실행 가능. 트래킹만 비활성화됨.

**3. 개발 서버 실행**

```bash
npm run dev
```

`http://localhost:3000` 접속

---

## 📊 GA4 트래킹 이벤트

가상 URL(`page_view` 이벤트) 방식으로 수집. GA4 → 탐색 → 자유형식에서 `페이지 경로` 기준으로 조회.

| 가상 경로 | 의미 |
|---|---|
| `/` | 메인 PV |
| `/modal/completion` | 시청 완료 모달 노출 |
| `/click/heart` | 하트 버튼 클릭 |
| `/click/mute/on` | 음소거 켜기 |
| `/click/mute/off` | 음소거 끄기 |
| `/click/bottomsheet/open` | 회차목록 열기 |
| `/click/bottomsheet/episode/available` | 공개 회차 클릭 |
| `/click/bottomsheet/episode/unavailable` | 미공개 회차 클릭 |
| `/click/bottomsheet/series/{시리즈명}` | 특정 시리즈 선택 |
| `/click/player/close` | X 버튼 (플레이어 닫기) |
| `/click/completion/other-content` | 다른 콘텐츠 보기 클릭 |
| `/click/feed/swipe-next` | 다음 화 스와이프 |
| `/click/feed/swipe-prev` | 이전 화 스와이프 |

---

## 💡 주요 구현 포인트

### 1. YouTube IFrame API 기반 플레이어 (`Player.tsx`)
- `new YT.Player()` 공식 API로 생성, `getDuration()` / `getCurrentTime()` 500ms 폴링으로 실제 재생 시간 동기화
- HMR 재진입 대응: `window.YT?.Player` 존재 여부를 직접 체크해 Promise 블로킹 방지
- 모든 YT.Player 호출 try-catch 처리

### 2. 스와이프 피드 (`Feed.tsx`)
- React state가 아닌 DOM `transform` 직접 제어로 60fps 네이티브 앱 수준 스와이프 구현
- 마지막 화에서 80% 이상 시청 후 위 스와이프 시 완료 모달 노출

### 3. 플로팅 하트 애니메이션 (`Player.tsx`)
- 클릭마다 랜덤 크기·색상·방향의 하트가 위로 떠오르는 CSS keyframe 애니메이션
- 카운트 없음, 저장 없음 — 순수 UX 피드백용

### 4. 콘텐츠 데이터 (`lib/data.ts`)
- 8개 시리즈, 시리즈당 5화 YouTube URL 하드코딩
- 썸네일은 YouTube 이미지 CDN(`i.ytimg.com`) 사용

---

## 🔗 관련 링크

- **배포 URL**: https://drama-pann.vercel.app
- **테스트 메인 페이지**: https://drama-pann.vercel.app/main
