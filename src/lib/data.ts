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

const BASE = import.meta.env.BASE_URL;

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
    id: 'sibling-husband',
    title: '동생의 남편과 결혼했습니다',
    tagline: '',
    synopsis: '',
    poster: `${BASE}assets/posters/sibling-husband.png`,
    genre: '복수',
    season: 1,
    totalEp: 15,
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
    poster: `${BASE}assets/posters/to-ex.png`,
    genre: '복수, 바람',
    season: 1,
    totalEp: 15,
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
    poster: `${BASE}assets/posters/divorce-play.png`,
    genre: '치정, 복수',
    season: 1,
    totalEp: 15,
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
    poster: `${BASE}assets/posters/love-light.png`,
    genre: '커플, 로맨스',
    season: 1,
    totalEp: 9,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/umuBL7AnnAI?si=9rFZaoMzwjb2Gow6' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/kD2OuzclEB4?si=7i15upsX9EFks_PC' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/EFZAErYnFRM?si=pfihOzmZ5ydynz-D' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtu.be/FKVumQwqY0Q?si=v876WQj62jHAifM_' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtu.be/0n-i1tin8LQ?si=k4KABToLPaIdXNqd' },
    ],
  },
  {
    id: 'method',
    title: '메소드',
    tagline: '',
    synopsis: '',
    poster: `${BASE}assets/posters/method.png`,
    genre: '복수, 회귀',
    season: 1,
    totalEp: 15,
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
