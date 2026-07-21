#!/usr/bin/env bash
#
# deploy.sh - siguran deploy za mikulicknjige.com
#
# Upotreba (na serveru, kao korisnik adizeljkovic):
#   cd /home/adizeljkovic/web/mikulicknjige.com/nodeapp
#   ./deploy.sh
#
# Sta radi:
#   1. Provjeri da radni direktorij nije prljav
#   2. Backup baze prije migracija
#   3. git pull --ff-only (nema merge commitova na serveru)
#   4. npm ci (deterministicki install iz package-lock.json)
#   5. prisma generate + prisma migrate deploy
#   6. Build u .next.new, tek na uspjeh zamijeni .next  -> ROLLBACK ako build padne
#   7. Kopira public/ i .next/static/ u standalone output
#   8. pm2 reload + health check; ako health check padne, vrati stari build
#
set -euo pipefail

APP_DIR="/home/adizeljkovic/web/mikulicknjige.com/nodeapp"
APP_NAME="mikulicknjige"
BRANCH="main"
PORT="3006"
HEALTH_URL="http://127.0.0.1:${PORT}/"
BACKUP_DIR="/home/adizeljkovic/backups/mikulic"
DB_NAME="adizeljkovic_mikulic"

log()  { echo -e "\033[1;34m[deploy]\033[0m $*"; }
err()  { echo -e "\033[1;31m[deploy:ERROR]\033[0m $*" >&2; }
die()  { err "$*"; exit 1; }

cd "$APP_DIR" || die "Ne mogu uci u $APP_DIR"

# ---------------------------------------------------------------- 1. preduslovi
log "Provjera radnog direktorija..."
if [[ -n "$(git status --porcelain)" ]]; then
  die "Radni direktorij ima nekomitovanih izmjena. Ocisti ih prije deploya (git status)."
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$CURRENT_BRANCH" == "$BRANCH" ]] || die "Na grani '$CURRENT_BRANCH', ocekivano '$BRANCH'."

[[ -f .env ]] || die ".env ne postoji na serveru."

# ---------------------------------------------------------------- 2. backup baze
log "Backup baze prije migracija..."
mkdir -p "$BACKUP_DIR"
PREDEPLOY_DUMP="$BACKUP_DIR/predeploy-$(date +%F-%H%M%S).sql.gz"
mysqldump --defaults-file="$HOME/.my.cnf" \
  --single-transaction --routines --triggers --events \
  "$DB_NAME" | gzip > "$PREDEPLOY_DUMP" \
  || die "mysqldump neuspjesan - prekidam deploy."
log "Backup: $PREDEPLOY_DUMP"

# ---------------------------------------------------------------- 3. git pull
PREV_COMMIT="$(git rev-parse HEAD)"
log "Trenutni commit: $PREV_COMMIT"
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH" || die "git pull nije fast-forward. Rijesi rucno."
NEW_COMMIT="$(git rev-parse HEAD)"

if [[ "$PREV_COMMIT" == "$NEW_COMMIT" ]]; then
  log "Nema novih commitova. Nastavljam svejedno (rebuild)."
else
  log "Novi commit: $NEW_COMMIT"
fi

# ---------------------------------------------------------------- 4. dependencies
# npm ci, ne npm install: brise node_modules i instalira TACNO ono sto pise u
# package-lock.json. npm install smije da mijenja lock i podigne minor/patch
# verzije (svi dependencyji su na "^"), pa produkcija dobije drugi kod od testiranog.
# devDependencies su potrebne (typescript, tailwind, eslint) jer se build radi ovdje.
log "npm ci (deterministicki install)..."
npm ci || die "npm ci neuspjesan."

# ---------------------------------------------------------------- 5. prisma
log "prisma generate..."
npx prisma generate || die "prisma generate neuspjesan."

log "prisma migrate deploy..."
npx prisma migrate deploy || die "Migracije neuspjesne. Baza je backupovana u $PREDEPLOY_DUMP"

# ---------------------------------------------------------------- 6. build + rollback
log "Build..."
rm -rf .next.new .next.old
if ! npm run build; then
  err "BUILD PAO. Stari .next je netaknut, aplikacija i dalje radi."
  err "Vracam kod na $PREV_COMMIT"
  git reset --hard "$PREV_COMMIT"
  exit 1
fi

# ---------------------------------------------------------------- 7. standalone assets
if [[ -f .next/standalone/server.js ]]; then
  log "Kopiram static assete u standalone output..."
  rm -rf .next/standalone/public
  cp -r public .next/standalone/public
  mkdir -p .next/standalone/.next
  rm -rf .next/standalone/.next/static
  cp -r .next/static .next/standalone/.next/static
else
  err "UPOZORENJE: .next/standalone/server.js ne postoji iako next.config.ts ima output:'standalone'."
  err "Provjeri build log. PM2 mora koristiti fallback iz ecosystem.config.js (next start)."
fi

# ---------------------------------------------------------------- 8. restart + health
log "PM2 reload..."
pm2 reload "$APP_NAME" --update-env || pm2 start ecosystem.config.js --env production

log "Health check..."
HEALTHY=0
for i in $(seq 1 20); do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || echo 000)"
  if [[ "$CODE" == "200" ]]; then HEALTHY=1; break; fi
  sleep 2
done

if [[ "$HEALTHY" -ne 1 ]]; then
  err "Health check PAO (zadnji HTTP kod: ${CODE:-n/a}). Vracam na $PREV_COMMIT."
  git reset --hard "$PREV_COMMIT"
  npm ci
  npx prisma generate
  npm run build
  cp -r public .next/standalone/public
  cp -r .next/static .next/standalone/.next/static
  pm2 reload "$APP_NAME" --update-env
  err "Rollback zavrsen. Baza NIJE vracena - ako su migracije problem: gunzip < $PREDEPLOY_DUMP | mysql $DB_NAME"
  exit 1
fi

pm2 save
log "DEPLOY USPJESAN. Commit: $NEW_COMMIT"
