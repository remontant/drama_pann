'use client';

import { useState, useCallback } from 'react';
import { Heart } from './Icons';

interface Props {
  id: string;
  size?: number;
}

function getLiked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem('plot.liked') || '[]'));
  } catch {
    return new Set();
  }
}

function saveLiked(set: Set<string>) {
  try {
    localStorage.setItem('plot.liked', JSON.stringify([...set]));
  } catch {}
}

export default function LikeButton({ id, size = 48 }: Props) {
  const [liked, setLiked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getLiked().has(id);
  });
  const [animKey, setAnimKey] = useState(0);

  const toggle = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setAnimKey((k) => k + 1);
    const set = getLiked();
    if (next) set.add(id);
    else set.delete(id);
    saveLiked(set);
  }, [id, liked]);

  const iconSize = Math.round(size * 0.46);

  return (
    <button
      key={animKey}
      onClick={toggle}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: liked ? 'rgba(230,57,70,0.14)' : 'var(--ink-10)',
        border: `1px solid ${liked ? 'rgba(230,57,70,0.35)' : 'var(--ink-20)'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: liked ? '#E63946' : 'var(--ink)',
        cursor: 'pointer',
        animation: liked ? 'plotLikePop 320ms cubic-bezier(0.22,1,0.36,1)' : 'none',
        transition: 'background 150ms, border-color 150ms, color 150ms',
      }}
    >
      <Heart
        size={iconSize}
        strokeWidth={1.75}
        fill={liked ? 'currentColor' : 'none'}
      />
    </button>
  );
}
