import type {NextConfig} from 'next';
const isProd = process.env.NODE_ENV === 'production';
const repositoryName = 'wynter-dev.github.io';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  basePath: isProd ? `/${repositoryName}` : '',
};

export default nextConfig;
