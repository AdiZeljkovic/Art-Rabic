# Art Rabic — mikulicknjige.com

Web stranica i katalog izdavačke kuće **Art Rabic** iz Sarajeva. Posjetioci pregledaju katalog od preko 160 naslova, otvaraju stranicu pojedine knjige i naručuju je pouzećem. Uredništvo upravlja knjigama, narudžbama, porukama i newsletter listom kroz zaštićeni admin panel.

---

## Sadržaj

- [Tehnologije](#tehnologije)
- [Struktura projekta](#struktura-projekta)
- [Lokalno pokretanje](#lokalno-pokretanje)
- [Baza podataka](#baza-podataka)
- [Uvoz kataloga knjiga](#uvoz-kataloga-knjiga)
- [Environment varijable](#environment-varijable)
- [Deployment](#deployment)
- [Nginx i HestiaCP](#nginx-i-hestiacp)
- [Backup](#backup)
- [Sigurnost](#sigurnost)
- [Održavanje](#održavanje)

---

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| UI | React 19, Tailwind CSS v4, Motion |
| Jezik | TypeScript (strict) |
| Baza | MariaDB / MySQL |
| ORM | Prisma 7 sa `@prisma/adapter-mariadb` |
| Autentikacija | HMAC-SHA256 potpisan cookie, bcrypt (cost 12) |
| Email | Nodemailer preko SMTP-a |
| Proces | PM2 (fork mode) iza nginx reverse proxyja |

Build koristi `output: 'standalone'` — produkcijski server je samostalan `node` proces bez `npm`/`next` omotača, što štedi oko 200 MB memorije.

---

## Struktura projekta

```
app/
  (site)/              Javne stranice — Header i Footer se renderuju ovdje
    page.tsx           Početna
    knjige/            Katalog i detalj knjige
    checkout/[id]/     Narudžba
    kontakt/  o-nama/  o-kupovini/  uslovi-kupovine/  pravila-koristenja/
  admin/               Admin panel (zaštićen middlewareom i layout provjerom)
  api/                 REST rute
  layout.tsx           Root layout — namjerno bez headers(), da ISR radi
  not-found.tsx        404
  error.tsx            500
components/            React komponente po domenu
lib/
  prisma.ts            PrismaClient singleton
  auth.ts              Potpisivanje i verifikacija admin sesije
  email.ts             Nodemailer transporter i HTML templati
  rate-limit.ts        In-memory rate limiter
  ip.ts                Ekstrakcija stvarne IP adrese iza proxyja
  format.ts            Formatiranje cijena, mapiranje modela u UI tip
prisma/
  schema.prisma        Model baze
  migrations/          Migracije
  seed.ts              Kategorije, demo knjige, admin nalog
scripts/
  import-books.js      Parser starih HTML stranica → books-import.sql
  optimize-images.js   Pre-optimizacija korica (jpg → webp, max 800px)
deploy/hestia/         Nginx template za HestiaCP
books-import.sql       167 knjiga spremnih za uvoz
ecosystem.config.js    PM2 konfiguracija
deploy.sh              Deploy sa backupom, health checkom i rollbackom
```

### Zašto route grupa `(site)`

Root layout ne smije pozivati `headers()` — taj poziv forsira dinamički rendering **cijelog** stabla ruta i poništava `revalidate` na svakoj stranici. Zato su Header i Footer premješteni u `app/(site)/layout.tsx`, a root layout drži samo `<html>`, `<body>` i fontove. Time početna i katalog rade kao ISR i ne pogađaju bazu pri svakom zahtjevu.

---

## Lokalno pokretanje

Preduslovi: Node.js 20+, MariaDB ili MySQL 8.

```bash
git clone https://github.com/AdiZeljkovic/mikulicknjige.git
cd mikulicknjige
npm install

cp .env.example .env
# uredi .env — minimalno DATABASE_URL i COOKIE_SECRET
```

Generiši `COOKIE_SECRET`:

```bash
openssl rand -hex 32
```

Pripremi bazu i pokreni:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Aplikacija radi na `http://localhost:3000`.

### Skripte

| Komanda | Opis |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Produkcijski build |
| `npm start` | Pokreće build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Provjera tipova |

---

## Baza podataka

Šest modela: `Book`, `Category`, `Order`, `ContactMessage`, `NewsletterSubscriber`, `AdminUser`, plus enum `OrderStatus`.

```
Category 1──n Book 1──n Order
```

`Book.categoryId` je opcionalan (`ON DELETE SET NULL`) — knjiga može postojati bez kategorije. `Order.bookId` je `ON DELETE RESTRICT`, pa se knjiga sa narudžbama ne može obrisati; umjesto brisanja označi je kao „nije na stanju".

### Migracije

```bash
# Produkcija — primijeni postojeće migracije
npx prisma migrate deploy

# Development — kreiraj novu nakon izmjene schema.prisma
npx prisma migrate dev --name opis_izmjene
```

Prisma 7 čita `DATABASE_URL` iz `prisma.config.ts`, **ne** iz `datasource` bloka u `schema.prisma`. Zbog toga `schema.prisma` namjerno nema `url` property.

### Seed

Kreira kategorije, demo knjige i admin nalog:

```bash
ADMIN_PASSWORD='jaka-lozinka-min-16-znakova' npx prisma db seed
```

Seed odbija raditi ako je `ADMIN_PASSWORD` kraća od 16 znakova. Korisničko ime se postavlja preko `ADMIN_USERNAME` (default `admin`).

> Na MySQL-u pod Linuxom imena tabela su **case-sensitive** — tabela je `Book`, ne `book`. Ručni SQL mora poštovati tačan zapis.

---

## Uvoz kataloga knjiga

Repo sadrži `books-import.sql` sa 167 knjiga (naslov, autor, cijena, opis, putanja do korice). Slike su u `public/images/knjige/` i verzionisane su u gitu.

```bash
mysql -u KORISNIK -p BAZA < books-import.sql
```

### Ponovna generacija iz HTML izvora

`scripts/import-books.js` parsira staru statičku stranicu (folder `mikulicknjige/` sa `knjigaN.html`), kopira slike u `public/images/knjige/` i generiše SQL:

```bash
node scripts/import-books.js
```

> **SQL nije idempotentan.** `Book` nema unique constraint na naslovu, a `isbn` je `NULL` za sve uvezene knjige — ponovno pokretanje duplira cijeli katalog. Prije ponovnog uvoza očisti:
> ```sql
> DELETE FROM `Book` WHERE isbn IS NULL AND id NOT IN (SELECT DISTINCT bookId FROM `Order`);
> ```

Uvezene knjige nemaju kategoriju. Dodijeli je kroz admin panel ili masovno:

```sql
UPDATE `Book` SET categoryId = (SELECT id FROM Category WHERE slug='kultura') WHERE categoryId IS NULL;
```

### Optimizacija slika

Korice u repou su već pre-optimizovane: WebP, maksimalno 800 px širine, ukupno oko 12 MB. **To nije kozmetika nego uslov da aplikacija radi.**

Originalni skenovi bili su 93 MB — Next.js ih optimizuje on-demand preko sharpa, što je 60–90 MB RAM-a i do 2,4 s CPU-a **po slici**. Sa 165 korica na jednoj stranici proces bi probio PM2 memorijski limit, ušao u restart petlju i nakon deset ciklusa se ugasio.

Nakon dodavanja novih originalnih skenova pokreni:

```bash
node scripts/optimize-images.js
mysql -u KORISNIK -p BAZA < migrate-image-paths.sql   # ako baza već ima stare putanje
```

Skripta usput popravlja slike sa oštećenim scan segmentima. Jedna korica (*Obična žena*, Hana Konsa) bila je nepovratno oštećena i nema sliku — treba je ponovo skenirati.

---

## Environment varijable

Kompletna lista sa objašnjenjima je u [`.env.example`](.env.example). Sažetak:

| Varijabla | Obavezna | Napomena |
|---|:---:|---|
| `DATABASE_URL` | da | `mysql://korisnik:lozinka@127.0.0.1:3306/baza` |
| `COOKIE_SECRET` | da | `openssl rand -hex 32`. Bez nje svaki login vraća 500 |
| `NODE_ENV` | da | `production` na serveru — kontroliše `secure` flag na cookieju |
| `PORT` | ne | Default 3000; na produkciji 3006 |
| `HOSTNAME` | ne | `127.0.0.1` — app sluša samo loopback, nginx je ispred |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | ne | Bez njih se email ne šalje, ali narudžbe rade |
| `SMTP_FROM` `ADMIN_EMAIL` | ne | Postavi eksplicitno — fallback koristi drugi domen i završi u spamu |
| `ADMIN_PASSWORD` `ADMIN_USERNAME` | ne | Samo za seed, ukloni nakon toga |

`.env` je u `.gitignore` i nikad se ne commituje. Na serveru postavi `chmod 600 .env`.

---

## Deployment

Cilj: Linux VPS sa Node.js 20+, MariaDB, nginx i PM2.

### Prvo postavljanje

```bash
cd /putanja/do/web/mikulicknjige.com
git clone https://github.com/AdiZeljkovic/mikulicknjige.git app
cd app

cp .env.example .env && nano .env && chmod 600 .env

npm ci
npx prisma generate
npx prisma migrate deploy
mysql -u KORISNIK -p BAZA < books-import.sql
ADMIN_PASSWORD='jaka-lozinka' ADMIN_USERNAME='artrabica' npx prisma db seed

npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup    # ispiše sudo komandu — izvrši je da app preživi reboot
```

### Naredni deployi

```bash
cd /putanja/do/app
./deploy.sh
```

`deploy.sh` radi backup baze, `git pull --ff-only`, `npm ci`, `prisma migrate deploy`, build, PM2 reload i health check. **Ako build ili health check padne, automatski vraća prethodni commit** — stara verzija ostaje živa.

Konfiguracija se pregazi preko `deploy.conf` pored skripte ili environmenta:

```bash
APP_DIR=/home/korisnik/web/mikulicknjige.com/app DB_NAME=moja_baza ./deploy.sh
```

### Build na serveru

Build koristi 2–4 GB RAM-a. Ako server dijeli resurse sa drugim aplikacijama, provjeri swap prije prvog deploya:

```bash
free -h && swapon --show
```

Ako swapa nema:

```bash
fallocate -l 4G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Deploy sa sniženim prioritetom da ne guši ostale servise:

```bash
nice -n 19 ionice -c3 ./deploy.sh
```

### PM2

Fork mode sa jednom instancom je namjeran, ne propust:

- Rate limiter drži brojače u memoriji procesa — sa 4 workera napadač dobija 4× pokušaja
- Prisma otvara connection pool po procesu; više instanci množi konekcije na dijeljenoj bazi
- Stranice su ISR-keširane, pa CPU nije usko grlo

Log rotacija (bez nje logovi rastu neograničeno):

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## Nginx i HestiaCP

Aplikacija sluša na `127.0.0.1:3006`; nginx terminira TLS i proksira.

**HestiaCP regeneriše `/etc/nginx/conf.d/domains/*.conf` iz templatea pri svakom SAVE u panelu.** Ručne izmjene tog fajla nestaju i sajt pada na 502. Zato koristi vlastiti template iz `deploy/hestia/`:

```bash
cp deploy/hestia/NodeApp3006.* /usr/local/hestia/data/templates/web/nginx/
chown root:root /usr/local/hestia/data/templates/web/nginx/NodeApp3006.*
chmod 644 /usr/local/hestia/data/templates/web/nginx/NodeApp3006.*

v-change-web-domain-tpl KORISNIK mikulicknjige.com NodeApp3006 yes
nginx -t && systemctl reload nginx
```

Template pokriva HSTS, gzip, direktno serviranje `/_next/static/` i `/images/` sa diska (bez prolaska kroz Node), proxy timeoute i blokadu pristupa `.env` i `.git`.

Bez HestiaCP dovoljna je standardna proxy konfiguracija:

```nginx
location / {
    proxy_pass http://127.0.0.1:3006;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

> `X-Forwarded-For $remote_addr`, a ne `$proxy_add_x_forwarded_for` — druga varijanta zadržava vrijednost koju je poslao klijent i otvara zaobilaženje rate limita.

---

## Backup

Narudžbe, kontakt poruke i newsletter pretplatnici postoje **samo** u bazi. Knjige se mogu vratiti iz `books-import.sql`, narudžbe kupaca ne mogu.

`~/.my.cnf` (da lozinka ne bude u crontabu):

```ini
[client]
user=KORISNIK
password=LOZINKA
host=127.0.0.1
```

```bash
chmod 600 ~/.my.cnf
```

Dnevni backup:

```bash
17 3 * * * mysqldump --defaults-file=$HOME/.my.cnf --single-transaction --quick \
  --default-character-set=utf8mb4 BAZA | gzip -9 > $HOME/backups/mikulicknjige/$(date +\%F).sql.gz
```

Testiraj restore prije nego zatreba:

```bash
mysql -e "CREATE DATABASE test_restore;"
gunzip < ~/backups/mikulicknjige/*.sql.gz | mysql test_restore
mysql test_restore -e "SELECT COUNT(*) FROM \`Book\`;"
mysql -e "DROP DATABASE test_restore;"
```

---

## Sigurnost

Implementirano:

- **Cijene se čitaju iz baze**, nikad sa klijenta — narudžba za 0 KM nije moguća
- Admin sesija: HMAC-SHA256 potpisan cookie, `httpOnly` + `sameSite=strict` + `secure`
- Dvostruka zaštita admin ruta — middleware i provjera u `app/admin/layout.tsx`
- Rate limiting: login 5/15min, narudžbe 5/h, kontakt 3/h, newsletter 5/h po IP
- Stvarni IP se čita iz zadnjeg unosa `X-Forwarded-For` lanca (onog koji upisuje nginx)
- bcrypt cost 12; `bcrypt.compare` se izvršava i za nepostojećeg korisnika (timing)
- Escape korisničkog unosa u HTML email templateima
- Validacija dužine svih polja prema kolonama baze
- Sigurnosni headeri: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP (report-only)
- Nema `dangerouslySetInnerHTML`, nema raw SQL-a, nema mass assignmenta

Preporuke za produkciju:

- Aplikacijski MySQL nalog treba imati samo `SELECT, INSERT, UPDATE, DELETE` na svojoj bazi — nikad `root`
- Nakon što CSP odstoji sedmicu bez blokada u konzoli, prebaci `Content-Security-Policy-Report-Only` u `Content-Security-Policy` u `next.config.ts`
- Provjeri da u `AdminUser` nema zaostalih naloga: `SELECT username, lastLoginAt FROM AdminUser;`

---

## Održavanje

### Admin panel

`https://mikulicknjige.com/admin/login` — knjige, narudžbe (sa promjenom statusa), poruke, newsletter.

### Dodavanje knjige

Slike idu u `public/images/knjige/` i commituju se u git. U admin formi upiši putanju `/images/knjige/naziv.jpg` — eksterni URL se odbija jer bi srušio render.

### Uptime provjera

PM2 restartuje proces koji umre, ali ne i onaj koji visi. Minimalna provjera svakih 5 minuta:

```bash
*/5 * * * * curl -sf --max-time 15 https://mikulicknjige.com/ > /dev/null || pm2 reload mikulicknjige
```

Za obavijesti izvana preporučuje se vanjski monitor (npr. UptimeRobot) — hvata i slučaj kad je cijeli server nedostupan.

### Dijagnostika

```bash
pm2 status
pm2 logs mikulicknjige --lines 50
ss -tlnp | grep 3006
nginx -t
```

---

## Licenca

Vlasništvo izdavačke kuće Art Rabic. Sav sadržaj — tekstovi, slike, logotip i dizajn — zaštićen je autorskim pravima.
