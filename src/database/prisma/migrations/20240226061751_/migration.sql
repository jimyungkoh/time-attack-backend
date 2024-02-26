/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tweetId,commenterId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_tweetId_commenterId_key" ON "Comment"("tweetId", "commenterId");
