-- Oberflaechensprache je Nutzer (fuer die eingeloggten Bereiche Profil/staff).
--
-- Bewusst reines DDL statt `prisma migrate dev`: die Migrations-Historie dieses
-- Projekts hat Drift (prisma/migrations fehlt), `migrate dev` wuerde einen
-- kompletten DB-Reset verlangen. Ausfuehren mit:
--
--   npx prisma db execute --file ./prisma/add_user_language.sql --schema ./prisma/schema.prisma
--
-- Danach `npx prisma generate`. Laeuft direkt ueber DATABASE_URL und fasst die
-- _prisma_migrations-Historie nicht an.
--
-- IF NOT EXISTS macht das Skript wiederholbar — zweimaliges Ausfuehren schadet nicht.

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'de';
