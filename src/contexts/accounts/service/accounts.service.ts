import bcrypt from "bcrypt";
import PrismaService from "../../../database/prisma/prisma.service";
import generateId from "../../../utils/generate-id";

const prismaService = PrismaService.getInstance();

export const findUserByEmail = async (email: string) => {
  return await prismaService.user.findUnique({
    where: { email },
  });
};

export const findUserProfileByNickname = async (nickname: string) => {
  return await prismaService.userProfile.findUnique({
    where: { nickname },
  });
};

export const findUserById = async (id: string) => {
  return await prismaService.user.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          nickname: true,
          introduce: true,
        },
      },
      tweets: {
        select: { title: true },
      },
      _count: {
        select: {
          followers: {
            where: { followingId: id },
          },
          followings: {
            where: { followerId: id },
          },
        },
      },
    },
  });
};

export const createUser = async (
  email: string,
  password: string,
  nickname: string,
  introduce: string
) => {
  const encryptedPasswords = await bcrypt.hash(password, 12);

  return await prismaService.user.create({
    data: {
      id: generateId(),
      email: email as string,
      encryptedPasswords,
      profile: {
        create: {
          nickname,
          introduce,
        },
      },
    },
  });
};

export const updateProfile = async (
  userId: string,
  { nickname, introduce }: { nickname?: string; introduce?: string }
) => {
  return await prismaService.userProfile.update({
    where: { userId },
    data: {
      nickname,
      introduce,
    },
  });
};

export const followUser = async (userId: string, targetUserId: string) => {
  return await prismaService.follow.create({
    data: {
      followerId: userId,
      followingId: targetUserId,
    },
  });
};

export const unFollowUser = async (followerId: string, followingId: string) => {
  return await prismaService.follow.delete({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });
};

export const findUserWithFollowings = async (userId: string) => {
  return await prismaService.user.findUnique({
    where: { id: userId },
    include: {
      followings: true,
    },
  });
};

export const findUserWithFollowers = async (userId: string) => {
  return await prismaService.user.findUnique({
    where: { id: userId },
    include: {
      followers: true,
    },
  });
};

export const findBookMarks = async (userId: string) => {
  return await prismaService.bookmark.findMany({
    where: { userId },
    include: {
      tweet: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};
