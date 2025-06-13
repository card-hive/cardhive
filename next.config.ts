import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vuttvgeuoefxkokqwbxz.supabase.co',
                pathname: '/storage/v1/object/public/module-images/**',
            },
        ],
    },
};

export default nextConfig;
