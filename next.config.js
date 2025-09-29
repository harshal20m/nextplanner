/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable compression
    compress: true,

    // Optimize images
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
    },

    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },

    // Reduce bundle size
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },

    // Enable static optimization
    output: "standalone",

    // Reduce build size (swcMinify is enabled by default in Next.js 13+)

    // Optimize for production
    poweredByHeader: false,

    // Enable gzip compression
    compress: true,
};

module.exports = nextConfig;
