/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   experimental: {
      typedRoutes: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "images.pexels.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "images.unsplash.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "shop.vinfastauto.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "a0.muscache.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "www.gstatic.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "maps.gstatic.com",
            port: "",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "iwayex.com",
            port: "",
            pathname: "/**",
         }
      ],
   },
};

module.exports = nextConfig;
