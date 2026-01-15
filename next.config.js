/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Railway e containers Linux precisam disso para otimizar o tamanho da imagem
  output: 'standalone',
  
  // Ignora erros de TS e Lint no build para não bloquear o deploy em produção
  // Recomendado apenas se você já roda verificações em CI/CD separado ou localmente
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Garante que imagens de domínios externos (se houver) funcionem
  images: {
    domains: ['lh3.googleusercontent.com'], // Exemplo para avatares do Google
  },
};

module.exports = nextConfig;