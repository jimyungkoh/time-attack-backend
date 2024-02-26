import { NextFunction, Request, Response } from "express";
import PrismaService from "../database/prisma/prisma.service";
import { BadRequestError, UnauthorizedError } from "../errors/http.error";
import jwtManager from "../utils/jwt.manager";
import wrapAsync from "../utils/wrap-async";

const prismaService = PrismaService.getInstance();
const publicPaths = [
  "/accounts/users/sign-up",
  "/accounts/users/log-in",
  "/accounts/users/*",
];

export default wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.user = null;

    for (const path of publicPaths) {
      if (req.url === "/tweets" && req.method === "GET") return next();
      if (path === req.url || (req.url.match(path) && req.method === "GET"))
        return next();
    }

    const accessToken = req.headers.authorization?.split("Bearer ")[1];
    if (!accessToken) throw new UnauthorizedError("로그인 후 이용해주세요");

    const { sub: email } = jwtManager.verify(accessToken);

    const user = await prismaService.user.findUnique({
      where: { email: email as string },
    });

    if (!user) throw new BadRequestError("삭제된 유저입니다.");

    req.user = user;
    next();
  }
);
