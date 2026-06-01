// ─── 타입 ───────────────────────────────────────────────────────────────────

export interface ApiContent {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  poster: string;       // 상대경로 "assets/posters/method.png" — 클라이언트가 BASE prefix 붙임
  genre: string;
  season: number;
  totalEp: number;
  sortOrder: number;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEpisode {
  contentId: string;
  ep: number;
  title: string;
  duration: number;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEpisodeWithCounts extends ApiEpisode {
  commentCount: number;
  likeCount: number;
}

export interface ApiContentDetail extends ApiContent {
  episodes: ApiEpisodeWithCounts[];
}

export interface ApiMe {
  isLogin: boolean;
  nickname?: string;
}

export interface ApiLikes {
  count: number;
  liked: boolean;
}

export interface ApiComment {
  id: number;
  contentId: string;
  ep: number;
  nickname: string;
  body: string;
  hidden: boolean;
  reportHidden: boolean;
  isMine: boolean;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCommentList {
  items: ApiComment[];
  nextCursor: number | null;
}

// ─── 베이스 URL ──────────────────────────────────────────────────────────────

const BASE = '/service/api/dramapann';

// ─── 공통 fetch 래퍼 ─────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
  });
  if (!res.ok) throw new Error(`[API] ${init?.method ?? 'GET'} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Me ─────────────────────────────────────────────────────────────────────

/** 현재 로그인 상태 + 닉네임 조회 */
export async function fetchMe(): Promise<ApiMe> {
  try {
    return await apiFetch<ApiMe>('/me');
  } catch {
    return { isLogin: false };
  }
}

/** 닉네임 변경 */
export async function updateNickname(nickname: string): Promise<ApiMe> {
  return apiFetch<ApiMe>('/me/nickname', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  });
}

// ─── Contents ────────────────────────────────────────────────────────────────

/** 공개 콘텐츠 목록 (숨김 제외, sortOrder ASC) */
export async function fetchContents(): Promise<ApiContent[]> {
  const data = await apiFetch<{ items: ApiContent[] }>('/contents');
  return data.items;
}

/** 콘텐츠 상세 — 회차 + commentCount/likeCount 포함 */
export async function fetchContent(id: string): Promise<ApiContentDetail> {
  return apiFetch<ApiContentDetail>(`/contents/${id}`);
}

// ─── Comments ────────────────────────────────────────────────────────────────

/** 회차 댓글 목록 (cursor pagination) */
export async function fetchComments(
  contentId: string,
  ep: number,
  cursor?: number,
  limit = 20,
): Promise<ApiCommentList> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor != null) params.set('cursor', String(cursor));
  return apiFetch<ApiCommentList>(`/episodes/${contentId}/${ep}/comments?${params}`);
}

/** 댓글 작성 (로그인 필수) */
export async function postComment(contentId: string, ep: number, body: string): Promise<ApiComment> {
  return apiFetch<ApiComment>(`/episodes/${contentId}/${ep}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}

/** 댓글 수정 (본인만) */
export async function updateComment(commentId: number, body: string): Promise<ApiComment> {
  return apiFetch<ApiComment>(`/comments/${commentId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}

/** 댓글 삭제 (본인만) */
export async function deleteComment(commentId: number): Promise<void> {
  await apiFetch(`/comments/${commentId}/delete`, { method: 'POST' });
}

/** 댓글 신고 */
export async function reportComment(commentId: number, reason?: string): Promise<void> {
  await apiFetch(`/comments/${commentId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
}

// ─── Likes ───────────────────────────────────────────────────────────────────

/** 좋아요 카운트 + 본인 여부 */
export async function fetchLikes(contentId: string, ep: number): Promise<ApiLikes> {
  return apiFetch<ApiLikes>(`/episodes/${contentId}/${ep}/likes`);
}

/** 좋아요 토글 (로그인 필수) */
export async function toggleLike(contentId: string, ep: number): Promise<ApiLikes> {
  return apiFetch<ApiLikes>(`/episodes/${contentId}/${ep}/likes`, { method: 'POST' });
}
