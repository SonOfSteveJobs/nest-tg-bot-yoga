-- AlterTable
ALTER TABLE "users" ALTER COLUMN "has_blocked_bot" DROP NOT NULL,
ALTER COLUMN "is_admin" DROP NOT NULL;
