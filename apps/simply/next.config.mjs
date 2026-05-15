/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@simply/ui", "@simply/contracts"],
  async headers() {
    return [
      {
        // Permitir embed del iframe /crypto desde el mismo origen
        source: "/crypto/:path*",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
};

export default nextConfig;
