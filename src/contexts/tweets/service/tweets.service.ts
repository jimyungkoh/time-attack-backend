import { User } from "@prisma/client";
import PrismaService from "../../../database/prisma/prisma.service";
import generateId from "../../../utils/generate-id";

const prismaService = PrismaService.getInstance();

export const findTweets = async () => {
  return await prismaService.tweet.findMany({ include: { comments: true } });
};

export const findTweetById = async (tweetId: string) => {
  return await prismaService.tweet.findUnique({ where: { id: tweetId } });
};

export const createTweet = async (
  user: User,
  title: string,
  content: string
) => {
  return await prismaService.tweet.create({
    data: {
      id: generateId(),
      title,
      content,
      authorId: user.id,
    },
  });
};

export const updateTweet = async (
  tweetId: string,
  title: string,
  content: string
) => {
  return await prismaService.tweet.update({
    where: {
      id: tweetId,
    },
    data: {
      title,
      content,
    },
  });
};

export const deleteTweet = async (tweetId: string) => {
  return await prismaService.tweet.delete({
    where: {
      id: tweetId,
    },
  });
};

export const findCommentById = async (commentId: string) => {
  return await prismaService.comment.findUnique({ where: { id: commentId } });
};

export const createComment = async (
  tweetId: string,
  userId: string,
  content: string
) => {
  return await prismaService.comment.create({
    data: {
      id: generateId(),
      content,
      tweetId,
      commenterId: userId,
    },
  });
};

export const updateComment = async (commentId: string, content: string) => {
  return await prismaService.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
  });
};

export const deleteComment = async (commentId: string) => {
  return await prismaService.comment.delete({
    where: { id: commentId },
  });
};

export const addBookmark = async (tweetId: string, userId: string) => {
  const bookMark = await prismaService.bookmark.create({
    data: {
      userId,
      tweetId,
    },
  });

  return bookMark;
};

export const findBookMarkById = async (tweetId: string, userId: string) => {
  const bookMark = await prismaService.bookmark.findUnique({
    where: { tweetId_userId: { tweetId, userId } },
  });

  return bookMark;
};

export const deleteBookMarkById = async (tweetId: string, userId: string) => {
  const result = await prismaService.bookmark.delete({
    where: { tweetId_userId: { tweetId, userId } },
  });

  return result;
};
