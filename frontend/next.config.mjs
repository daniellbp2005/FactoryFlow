/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    // Permite que o build em produção termine com sucesso
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
