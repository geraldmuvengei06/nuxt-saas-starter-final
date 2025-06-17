-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'USER';
