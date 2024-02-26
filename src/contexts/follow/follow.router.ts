import { Router } from "express";
import { ForbiddenError, NotFoundError } from "../../errors/http.error";
import wrapAsync from "../../utils/wrap-async";
import accountsService from "../accounts/service";

const followRouter = Router();

// [POST] /followings/:userId
followRouter.post(
  "/followings/:userId",
  wrapAsync(async (req, res, next) => {
    const targetUser = await accountsService.findUserById(req.params.userId);

    if (!targetUser) throw new NotFoundError("존재하지 않는 회원입니다.");
    const user = req.user;

    if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const result = await accountsService.followUser(user.id, targetUser.id);

    res.json(result);
  })
);

// [DELETE] /followings/:userId
followRouter.delete(
  "/followings/:userId",
  wrapAsync(async (req, res, next) => {
    const targetUser = await accountsService.findUserById(req.params.userId);

    if (!targetUser) throw new NotFoundError("존재하지 않는 회원입니다.");
    const user = req.user;

    if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const result = await accountsService.followUser(user.id, targetUser.id);

    res.json(result);
  })
);

// [DELETE] /followers/:userId
followRouter.delete(
  "/followers/:userId",
  wrapAsync(async (req, res, next) => {
    const targetUser = await accountsService.findUserById(req.params.userId);

    if (!targetUser) throw new NotFoundError("존재하지 않는 회원입니다.");
    const user = req.user;

    if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const result = await accountsService.unFollowUser(user.id, targetUser.id);

    res.json(!!result);
  })
);

export default followRouter;
