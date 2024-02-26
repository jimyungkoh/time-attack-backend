/*
  Warnings:

  - The primary key for the `Bookmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `twittId` on the `Bookmarks` table. All the data in the column will be lost.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `twittId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Twitts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tweetId` to the `Bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweetId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_twittId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_twittId_fkey";

-- DropForeignKey
ALTER TABLE "Twitts" DROP CONSTRAINT "Twitts_authorId_fkey";

-- AlterTable
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_pkey",
DROP COLUMN "twittId",
ADD COLUMN     "tweetId" TEXT NOT NULL,
ADD CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("tweetId", "userId");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "twittId",
ADD COLUMN     "tweetId" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("tweetId", "commenterId");

-- DropTable
DROP TABLE "Twitts";

-- CreateTable
CREATE TABLE "Tweets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Tweets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tweets" ADD CONSTRAINT "Tweets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
