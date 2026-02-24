/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/explore',
        destination: '/grants',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
