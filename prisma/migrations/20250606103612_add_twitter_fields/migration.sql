/*
  Warnings:

  - A unique constraint covering the columns `[twitterHandle]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "twitterAvatarUrl" TEXT,
ADD COLUMN     "twitterBio" TEXT,
ADD COLUMN     "twitterFollowers" INTEGER,
ADD COLUMN     "twitterHandle" TEXT,
ADD COLUMN     "twitterId" TEXT,
ADD COLUMN     "twitterVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "user_twitterHandle_key" ON "user"("twitterHandle");
