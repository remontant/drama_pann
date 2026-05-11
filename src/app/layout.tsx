import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '드라마판 | 1분 만에 바뀌는 판도, 미친 몰입의 숏폼 드라마',
  description: '1분 만에 바뀌는 판도, 미친 몰입의 숏폼 드라마',
  icons: { icon: '/assets/favicon.svg' },
  openGraph: {
    title: '판에서 즐기는 숏폼 드라마, 60초면 서사 완성',
    description: '이 퀄리티 실화? 지금 드라마판 접속하면 인기작 5화가 무료!',
    // description: '판에서 난리 난 그 숏드라마, 아직도 안 봤어? (무료 보기 오픈)',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '판에서 즐기는 숏폼 드라마, 60초면 서사 완성',
    description: '이 퀄리티 실화? 지금 드라마판 접속하면 인기작 5화가 무료!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
