/*
  Warnings:

  - The `chat_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "chat_id",
ADD COLUMN     "chat_id" INTEGER NOT NULL DEFAULT 0;
