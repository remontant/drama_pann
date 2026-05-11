/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbnews.nateimg.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'cdn.startupn.kr',
      },
      {
        protocol: 'https',
        hostname: 'cdn.ppss.kr',
      },
      {
        protocol: 'https',
        hostname: 'pimg.mk.co.kr',
      },
    ],
  },
};
export default nextConfig;
