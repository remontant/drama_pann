export interface Episode {
  ep: number;
  title: string;
  duration: number;
  videoUrl?: string;
}

export interface Series {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  poster: string;
  genre: string;
  season: number;
  totalEp: number;
  stills: string[];
  episodes: Episode[];
  isComingSoon?: boolean;
}

export interface FeedEntry {
  id: string;
  seriesId: string;
  ep?: number;
  epTitle?: string;
  duration?: number;
  videoUrl?: string;
  comingSoon?: boolean;
  nextEp?: number;
}

export const SERIES: Series[] = [
  {
    id: 'cant-die-night',
    title: '죽을 수 없는 밤',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/B4WUPJc_vTo/hqdefault.jpg',
    genre: '스릴러',
    season: 1,
    totalEp: 11,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/B4WUPJc_vTo?si=QQlDP9a2IPg9GP4M' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/4ZJ5o6EgTjU?si=fc-sfu_uOD1m-r11' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/dS4tZen1Cs0?si=Ch7Szu036EbwbxAG' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/CifWlpCg7T8?si=wAzGUOn7tTlyLqKC' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/cKopasWbniE?si=pfSIGtow6Hq_DhI6' },
    ],
  },
  {
    id: 'game-of-death',
    title: 'The game of death',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/iKGF9KaHCuE/hqdefault.jpg',
    genre: '스릴러',
    season: 1,
    totalEp: 4,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/iKGF9KaHCuE?si=fC4IuHbzuJI5CdFx' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/5gQ6t6I4b9Y?si=AQNMIrC9PTxtSpyL' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/G42jhh0mfpI?si=oAdlzeKbVZKUOr2Z' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/msQmhsilc0c?si=mMOaU1Sa6u6vvzX9' },
    ],
  },
  {
    id: 'perfect-friend',
    title: '너의 완벽한 친구',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/vK59shy0aMw/hqdefault.jpg',
    genre: '공포, 스릴러',
    season: 1,
    totalEp: 7,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/vK59shy0aMw?si=Te2kkxa1crya2Qwm' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/V5NfHDNW1_4?si=KT-7F2eoQ3_VxzNJ' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/rWH38whdZXA?si=No7S_Pl5_OcOUkfd' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/a9Rk-bgSnEk?si=3L6F2-Lx5teSTdsE' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/uo8WOVO2KvE?si=ip7GY7uXJZF6n2Ou' },
    ],
  },
  {
    id: 'love-expiry',
    title: '사랑의 유통기한',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/X5DFFKjVoCU/hqdefault.jpg',
    genre: '연애, 공감, 실험',
    season: 1,
    totalEp: 4,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/X5DFFKjVoCU?si=wQq4DdpS6D2q5jTl' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/1cVf27B4GsM?si=kuKeT2q7K8b_rjAa' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/zwPCpr4WCHE?si=CDXM_vkqwRgfvkF_' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/O5ZdOct4duI?si=Q8uI0DkbDDScr2q8' },
    ],
  },
  {
    id: 'sibling-husband',
    title: '동생의 남편과 결혼했습니다',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/6hq3eoCTzQU/hqdefault.jpg',
    genre: '복수',
    season: 1,
    totalEp: 69,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/6hq3eoCTzQU?si=sQEdUdXWN5YR8ISs' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/f_ThmjPoblE?si=JkS6tU8N9LFVm5dP' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/XP9_brb85WQ?si=_C1sQ8VM3p8J9YCQ' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/brwyfbwreNo?si=EUpM2kTlfwmGKjvZ' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/W2o8_QJqTdc?si=SOUKQu7KL0x-S2FJ' },
    ],
  },
  {
    id: 'to-ex',
    title: 'To.엑스',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/jt53c8uJa9E/hqdefault.jpg',
    genre: '복수, 바람',
    season: 1,
    totalEp: 63,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/jt53c8uJa9E?si=PO_HDcF-KooIVRw4' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/W7GFH2GWpYI?si=cquC7BrVt_e_GBnI' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/7LE81YwswGo?si=Bn_TruhUTx42x2VU' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/wZuF5TzqJPs?si=bh4RPnVLTaHVml0u' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/7K1IWjETN4w?si=Duktgn_KozQDvlRm' },
    ],
  },
  {
    id: 'divorce-play',
    title: '이혼하고 나랑 놀래?',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/kD9elRMWCg8/hqdefault.jpg',
    genre: '치정, 복수',
    season: 1,
    totalEp: 61,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/kD9elRMWCg8?si=E0Zu2-GYLddC4vp0' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/S9JjCev-We0?si=QAw7ffFnqk_mYQER' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/UEcYkh7sLTQ?si=w28DuEeR-AY0zDiB' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/nBI70LsnW_w?si=cxqkKDAg5USgtsYT' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/z3_pznzAOFo?si=T9DwiMOY-oSOWHeV' },
    ],
  },
  {
    id: 'love-light',
    title: '러브라이트',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/umuBL7AnnAI/hqdefault.jpg',
    genre: '커플, 로맨스',
    season: 1,
    totalEp: 9,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/umuBL7AnnAI?si=9rFZaoMzwjb2Gow6' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/kD2OuzclEB4?si=7i15upsX9EFks_PC' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/EFZAErYnFRM?si=pfihOzmZ5ydynz-D' },
    ],
  },
  {
    id: 'method',
    title: '메소드',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/H-QduAYVKiE/hqdefault.jpg',
    genre: '복수, 회귀',
    season: 1,
    totalEp: 100,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/H-QduAYVKiE?si=UBbgm8v9i9PBbq_L' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/G_0pxIIYGas?si=Fi0y7f8ZJD9NcciU' },
      { ep: 3, title: '3화 (3-1)', duration: 90, videoUrl: 'https://youtu.be/SHsV9aPSyLA?si=1pabLccSMYoeZTzD' },
      { ep: 4, title: '4화 (3-2)', duration: 90, videoUrl: 'https://youtu.be/oB4fMcEFbrA?si=fgfXjpcZRspkPE0Y' },
      { ep: 5, title: '5화 (4-1)', duration: 90, videoUrl: 'https://youtu.be/-UNyNnu21Qo?si=fccJkOAkI6qr0g8g' },
      { ep: 6, title: '6화 (4-2)', duration: 90, videoUrl: 'https://youtu.be/UL97SayONSg?si=TBAMk5cuorPTNlIO' },
    ],
  },
  {
    id: 'storm-marriage',
    title: '폭풍같은 결혼생활',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/Hrwa_vJduMg/hqdefault.jpg',
    genre: '',
    season: 1,
    totalEp: 5,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/Hrwa_vJduMg?si=ZwhnrdbS0wNZmRq1' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/QeEqfGUtuPw?si=lNMgDOdPL3al_ogg' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/ngKR5eGvHEQ?si=29uflaNKm3GIiQgf' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/yVJHmCYbpGM?si=V7VGxlChKMm_9_yE' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/L7kdf3d00V8?si=lPUAzkgNWJ9DNUkT' },
    ],
  },
  {
    id: 'doctor-shin',
    title: '닥터신',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/vvK9xqPCA2Q/hqdefault.jpg',
    genre: '',
    season: 1,
    totalEp: 5,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/vvK9xqPCA2Q?si=hC7-xFYZe1w85N0D' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/6XkQXgf2oNI?si=4XESwfN0iO54lnyq' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/5sBVjbRG1c4?si=cicIqtfG6RAv9Aj4' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/hXRzuiX9Ifo?si=48iL7a-c_nKFsL2L' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/MVHvFuu_FzU?si=w-oFdr-BL_vywdFG' },
    ],
  },
  {
    id: 'this-age',
    title: '이멋살',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/vCdii0kstBY/hqdefault.jpg',
    genre: '',
    season: 1,
    totalEp: 5,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/vCdii0kstBY?si=p-70H-I5haWwPxEr' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/uK6uqWGhzYw?si=4IH-8AAWcGlqPLZh' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/5h-S88Fa2PM?si=Wi9wf38QpGyhbQ_J' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/UyqXrITMzZU?si=5eO0JPVeOhCopqKX' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/CjtkfX9JOC0?si=hMzvxhzfJIcqmemy' },
    ],
  },
  {
    id: 'first-time',
    title: '처음: The first time',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/VdgxkZkec_Y/hqdefault.jpg',
    genre: '',
    season: 1,
    totalEp: 5,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/VdgxkZkec_Y?si=Tom6-hkpFdwsJfHB' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/RVZj6ANfg9s?si=Sac4WohGnTNKfznn' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/__Rk9jvWoOs?si=Nz9evHOavMdNG8Ms' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/Ylpbi8Eb2zo?si=LhhoQPHGB_W-AiyQ' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/o70hByMJhVg?si=54NN-rYF0eKDIod0' },
    ],
  },
  {
    id: 'seduce-husband',
    title: '남편을 유혹해줘요',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/HSrP7qXrRPk/hqdefault.jpg',
    genre: '',
    season: 1,
    totalEp: 5,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://www.youtube.com/watch?v=HSrP7qXrRPk' },
    ],
  },
];

export function getSeries(id: string): Series | undefined {
  return SERIES.find((s) => s.id === id);
}

export function getFeedFor(seriesId: string): FeedEntry[] {
  const s = getSeries(seriesId);
  if (!s) return [];
  const entries: FeedEntry[] = s.episodes.map((e) => ({
    id: `${s.id}-${e.ep}`,
    seriesId: s.id,
    ep: e.ep,
    epTitle: e.title,
    duration: e.duration,
    videoUrl: e.videoUrl,
  }));
  if (s.episodes.length < s.totalEp) {
    entries.push({
      id: `${s.id}-coming-soon`,
      seriesId: s.id,
      comingSoon: true,
      nextEp: s.episodes.length + 1,
    });
  }
  return entries;
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
