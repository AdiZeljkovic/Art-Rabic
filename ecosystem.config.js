// PM2 konfiguracija za mikulicknjige.com
// Pokretanje:  pm2 start ecosystem.config.js --env production
// Restart:     pm2 reload mikulicknjige
//
// NAPOMENA: standalone build (next.config.ts ima output: 'standalone').
// Nakon `npm run build` deploy.sh kopira public/ i .next/static/ u .next/standalone/,
// pa PM2 pokrece cisti node proces bez npm/next CLI omotaca (jedan proces manje, ~40MB manje RAM-a).

module.exports = {
  apps: [
    {
      name: 'mikulicknjige',
      script: '.next/standalone/server.js',
      // cwd se uzima iz foldera iz kojeg pokreces `pm2 start ecosystem.config.js`.
      // Postavi APP_DIR ako pokreces iz drugog foldera.
      cwd: process.env.APP_DIR || __dirname,
      interpreter: 'node',

      // FALLBACK ako `npm run build` ne emituje .next/standalone/ (provjeri
      // `ls .next/standalone/server.js` nakon builda). Tada zakomentarisi
      // 'script'/'interpreter' iznad i koristi:
      //   script: 'node_modules/next/dist/bin/next',
      //   args: 'start -p 3006 -H 127.0.0.1',
      // (radi, ali drzi cijeli node_modules u memoriji - vidi audit sekciju 1)

      // Fork mode - NE cluster. Vidi audit sekciju 4.
      exec_mode: 'fork',
      instances: 1,

      env_production: {
        NODE_ENV: 'production',
        PORT: 3006,
        HOSTNAME: '127.0.0.1', // slusaj samo na loopbacku, nginx je ispred
      },

      // Restart politika
      autorestart: true,
      // Baseline je ~130 MB. Rezerva je za sharp transformacije slika —
      // `imgOptConcurrency: 1` u next.config.ts drži ih serijalizovanim,
      // pa peak ostaje ispod ovoga umjesto da uđe u restart petlju.
      max_memory_restart: '500M',
      min_uptime: '30s',        // ako padne prije 30s smatra se neuspjelim startom
      max_restarts: 10,         // nakon 10 uzastopnih fail-ova PM2 odustaje
      restart_delay: 3000,
      exp_backoff_restart_delay: 200,

      // Logovi — default je ~/.pm2/logs/. Instaliraj pm2-logrotate (vidi README),
      // inace rastu neograniceno.
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Ne gledaj fajlove (production)
      watch: false,

      // Graceful shutdown - Next treba vremena da zatvori otvorene konekcije
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: false,
    },
  ],
}
