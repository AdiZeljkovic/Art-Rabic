import type {NextConfig} from 'next';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Report-only dok se ne potvrdi da ništa ne blokira; zatim preimenovati
  // u 'Content-Security-Policy' i skinuti 'unsafe-eval'.
  { key: 'Content-Security-Policy-Report-Only', value: csp },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compress: true,
  poweredByHeader: false,
  images: {
    // Samo WebP. AVIF je 2-3x sporiji za enkodiranje — sa 165 korica na jednoj
    // stranici to je razlika između 30 s i 130 s CPU-a po hladnoj posjeti.
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    // Izvorne korice su 800px; veće širine bi samo trošile CPU bez dobitka.
    deviceSizes: [640, 750, 828],
    imageSizes: [64, 96, 128, 256, 384],
    // Placeholder korice je SVG; bez ovoga optimizer vraća 400 i slika je slomljena.
    // Sandbox CSP sprječava izvršavanje skripti unutar SVG-a.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // Serijalizuj sharp. Bez ovoga paralelne transformacije preko HTTP/2
    // podignu RSS preko PM2 limita i proces uđe u restart petlju.
    imgOptConcurrency: 1,
    imgOptTimeoutInSeconds: 10,
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
