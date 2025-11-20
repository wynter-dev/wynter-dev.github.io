import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  basePath: ''
};

export default nextConfig;
