/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      dangerouslyAllowSVG: true, 
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ui-avatars.com',
          pathname: '/api/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/api/departments/avatars/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  