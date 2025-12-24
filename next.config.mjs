/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "instagram.f**.fbcdn.net", // ajusta según lo que veas en la URL real
      },
    ],
  },
};

export default nextConfig;