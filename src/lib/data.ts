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
  directorInfo?: string;
  year?: number;
  gradeAge?: string;
  gradeTheme?: string[];
  keywords?: string[];
  cast?: string[];
  creator?: string;
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
    id: 'polpung-marriage',
    title: '폭풍같은 결혼생활',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/Hrwa_vJduMg/hqdefault.jpg',
    genre: '로맨스',
    season: 1,
    totalEp: 12,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtu.be/Hrwa_vJduMg?si=ZwhnrdbS0wNZmRq1' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtu.be/QeEqfGUtuPw?si=lNMgDOdPL3al_ogg' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtu.be/ngKR5eGvHEQ?si=29uflaNKm3GliQgf' },
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
    genre: '의학',
    season: 1,
    totalEp: 14,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/vvK9xqPCA2Q?si=hC7-xFYZe1w85N0D' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/6XkQXgf2oNI?si=4XE3wfN0iO54Inyq' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/5sBVjbRG1c4?si=ciclqtfG6RAv9Aj4' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/hXRzuiX9Ifo?si=48lL7a-c_nKFsL2L' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/MVHvFuu_FzU?si=w-oFdr-BL_vywdFG' },
    ],
  },
  {
    id: 'cant-die-night',
    title: '죽을수없는밤',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/B4WUPJc_vTo/hqdefault.jpg',
    genre: '스릴러',
    season: 1,
    totalEp: 10,
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
    id: 'secret-wife',
    title: '비밀 결혼한 아내',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/4G6d14qNPFQ/hqdefault.jpg',
    genre: '로맨스',
    season: 1,
    totalEp: 13,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/4G6d14qNPFQ?si=zY4xBByy6n3hFsPw' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/Rk6FPLhB9JU?si=KlRrxrXLROzy4qCF' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/-IDxz2It2Xg?si=BAiOEMxv_btZxaPT' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/T3rPaxXI8hI?si=SqMhHDIGXADsWSYa' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/KhSNnI--GCY?si=AYZ5EtWzNU2ml9MD' },
    ],
  },
  {
    id: 'this-age',
    title: '이멋살',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/vCdii0kstBY/hqdefault.jpg',
    genre: '드라마',
    season: 1,
    totalEp: 15,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/vCdii0kstBY?si=p-70H-I5haWwPxEr' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/uK6uqWGhzYw?si=4lH-8AAWcGlqPLZh' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/5h-S88Fa2PM?si=Wi9wf38QpGyhbQ_J' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/UyqXrITMzZU?si=5eO0JPVeOhCopqKX' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/CjtkfX9JOC0?si=hMzvxhzfJlcqmemy' },
    ],
  },
  {
    id: 'first-time',
    title: '처음: the first time',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/VdgxkZkec_Y/hqdefault.jpg',
    genre: '로맨스',
    season: 1,
    totalEp: 12,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/VdgxkZkec_Y?si=Tom6-hkpFdwsJfHB' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/RVZj6ANfg9s?si=Sac4WohGnTNKfznn' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/__Rk9jvWoOs?si=Nz9evHOavMdNG8Ms' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/YlpBi8Eb2zo?si=LhhoQPHGB_W-AiyQ' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/o70hByMJhVg?si=54NN-rYF0eKDlod0' },
    ],
  },
  {
    id: 'love-light',
    title: '러브라이트',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/umuBL7AnnAI/hqdefault.jpg',
    genre: '로맨스',
    season: 1,
    totalEp: 10,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/umuBL7AnnAI?si=9rFZaoMzwjb2Gow6' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/kD2OuzclEB4?si=7i15upsX9EFks_PC' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/EFZAErYnFRM?si=pfihOzm25ydynz-D' },
    ],
  },
  {
    id: 'method',
    title: '메소드',
    tagline: '',
    synopsis: '',
    poster: 'https://i.ytimg.com/vi/vv93c3IFbPo/hqdefault.jpg',
    genre: '드라마',
    season: 1,
    totalEp: 14,
    stills: [],
    episodes: [
      { ep: 1, title: '1화', duration: 90, videoUrl: 'https://youtube.com/shorts/vv93c3IFbPo?si=pX9W0lhShiFDzX1-' },
      { ep: 2, title: '2화', duration: 90, videoUrl: 'https://youtube.com/shorts/VQWN7ubpRqM?si=GIQ_Z63b1U22dBYs' },
      { ep: 3, title: '3화', duration: 90, videoUrl: 'https://youtube.com/shorts/1oUQ8TQhsRA?si=Ugi7UxB9QXQliuyZ' },
      { ep: 4, title: '4화', duration: 90, videoUrl: 'https://youtube.com/shorts/B-lQdZ09sDU?si=Djz02e-KB3fj2rhH' },
      { ep: 5, title: '5화', duration: 90, videoUrl: 'https://youtube.com/shorts/LjjPhzar5HA?si=s0MZ9qEivo_BeKJH' },
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
