import bcrypt from "bcrypt";
import { Router } from "express";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/http.error";
import validate from "../../middlewares/validate.middleware";
import jwtManager from "../../utils/jwt.manager";
import wrapAsync from "../../utils/wrap-async";
import logInSchema from "./schemas/log-in.schema";
import signUpSchema from "./schemas/sign-up.schema";
import updateProfileSchema from "./schemas/update-profile.schema";
import accountsService from "./service";

const accountsRouter = Router();

// [POST] /accounts/users/sign-up
accountsRouter.post(
  "/accounts/users/sign-up",
  validate(signUpSchema),
  wrapAsync(async (req, res, next) => {
    const { email, password, nickname, introduce } = req.body;

    const foundUser = await accountsService.findUserByEmail(email);

    if (foundUser) throw new ConflictError("중복 아이디입니다.");

    const duplicateProfile = await accountsService.findUserProfileByNickname(
      nickname
    );

    if (duplicateProfile) throw new ConflictError("중복 닉네임입니다.");

    const user = await accountsService.createUser(
      email,
      password,
      nickname,
      introduce
    );

    return res.json({
      userId: user.id,
      jwtToken: jwtManager.sign(user),
    });
  })
);

// [POST] /accounts/users/log-in
accountsRouter.post(
  "/accounts/users/log-in",
  validate(logInSchema),
  wrapAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const foundUser = await accountsService.findUserByEmail(email);

    if (!foundUser || !bcrypt.compare(password, foundUser?.encryptedPasswords))
      throw new UnauthorizedError("아이디 또는 패스워드가 일치하지 않습니다.");

    return res.json({
      userId: foundUser.id,
      jwtToken: jwtManager.sign(foundUser),
    });
  })
);

// [PUT] /accounts/users
accountsRouter.put(
  "/accounts/users",
  validate(updateProfileSchema),
  wrapAsync(async (req, res, next) => {
    if (!req.user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const { nickname, introduce } = req.body;

    const duplicateProfile = await accountsService.findUserProfileByNickname(
      nickname
    );

    if (duplicateProfile) throw new ConflictError("중복 닉네임입니다.");

    const result = await accountsService.updateProfile(req.user.id, {
      nickname,
      introduce,
    });

    return result;
  })
);

// [GET] /accounts/users/:userId
accountsRouter.get(
  "/accounts/users/:userId",
  wrapAsync(async (req, res, next) => {
    const foundUser = await accountsService.findUserById(req.params.userId);

    if (!foundUser) throw new NotFoundError("존재하지 않는 유저입니다.");

    res.json(foundUser);
  })
);

// [GET] /accounts/users/:userId/followings
accountsRouter.get(
  "/users/:userId/followings",
  wrapAsync(async (req, res, next) => {
    const foundUserWithFollowings =
      await accountsService.findUserWithFollowings(req.params.userId);

    if (!foundUserWithFollowings)
      throw new NotFoundError("존재하지 않는 유저입니다.");

    res.json(foundUserWithFollowings.followings);
  })
);

// [GET] /accounts/users/:userId/followers
accountsRouter.get(
  "/users/:userId/followers",
  wrapAsync(async (req, res, next) => {
    const foundUserWithFollowers = await accountsService.findUserWithFollowers(
      req.params.userId
    );

    if (!foundUserWithFollowers)
      throw new NotFoundError("존재하지 않는 유저입니다.");

    res.json(foundUserWithFollowers.followers);
  })
);

// [GET] /bookmarks
accountsRouter.get(
  "/bookmarks",
  wrapAsync(async (req, res, next) => {
    if (!req.user) throw new UnauthorizedError("로그인 후 이용해주세요.");
    const bookmarks = await accountsService.findBookMarks(req.user.id);

    res.json(bookmarks);
  })
);

export default accountsRouter;
