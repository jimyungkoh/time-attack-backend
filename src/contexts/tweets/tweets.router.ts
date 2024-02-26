import { User } from "@prisma/client";
import { Router } from "express";
import { ForbiddenError, NotFoundError } from "../../errors/http.error";
import validate from "../../middlewares/validate.middleware";
import wrapAsync from "../../utils/wrap-async";
import {
  default as createTweetSchema,
  default as editTweetSchema,
} from "./schemas/edit-tweet.schema";
import tweetCommentSchema from "./schemas/tweet-comment.schema copy";
import tweetsService from "./service";

const tweetsRouter = Router();
// [GET] /tweets
tweetsRouter.get("/tweets", async (req, res, next) => {
  const tweets = await tweetsService.findTweets();
  return res.json(tweets);
});

// [POST] /tweets
tweetsRouter.post(
  "/tweets",
  validate(createTweetSchema),
  wrapAsync(async (req, res, next) => {
    const user = req.user;

    const tweet = await tweetsService.createTweet(
      user as User,
      req.body.title,
      req.body.content
    );

    res.status(201).json(tweet);
  })
);

// [PATCH, DELETE]/tweets/:tweetId
tweetsRouter.patch(
  "/tweets/:tweetId",
  validate(editTweetSchema),
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const foundTweet = await tweetsService.findTweetById(tweetId);

    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (foundTweet.authorId != req.user?.id)
      throw new ForbiddenError("트윗 작성자만 수정이 가능합니다.");

    const { title, content } = req.body;
    const result = await tweetsService.updateTweet(tweetId, title, content);

    res.json(result);
  })
);

tweetsRouter.delete(
  "/tweets/:tweetId",
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const foundTweet = await tweetsService.findTweetById(tweetId);

    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (foundTweet.authorId != req.user?.id)
      throw new ForbiddenError("트윗 작성자만 삭제가 가능합니다.");

    const result = await tweetsService.deleteTweet(tweetId);

    res.json(!!result);
  })
);

// [POST] /tweets/:tweetId/comments
tweetsRouter.post(
  "/tweets/:tweetId/comments",
  validate(tweetCommentSchema),
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const user = req.user;

    const foundTweet = await tweetsService.findTweetById(tweetId);
    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const comment = await tweetsService.createComment(
      tweetId,
      user.id,
      req.body.content
    );

    res.status(201).json(comment);
  })
);

// [PATCH, DELETE] /tweets/:tweetId/comments/:commentId
tweetsRouter.patch(
  "/tweets/:tweetId/comments/:commentId",
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const user = req.user;

    const foundTweet = await tweetsService.findTweetById(tweetId);
    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const commentId = req.params.commentId;
    const foundComment = await tweetsService.findCommentById(commentId);

    if (foundComment?.commenterId != user.id)
      throw new ForbiddenError("댓글 작성자만 수정이 가능합니다.");

    const comment = await tweetsService.updateComment(
      commentId,
      req.body.content
    );

    res.json(comment);
  })
);
tweetsRouter.delete(
  "/tweets/:tweetId/comments/:commentId",
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const user = req.user;

    const foundTweet = await tweetsService.findTweetById(tweetId);
    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const commentId = req.params.commentId;
    const foundComment = await tweetsService.findCommentById(commentId);

    if (foundComment?.commenterId != user.id)
      throw new ForbiddenError("댓글 작성자만 삭제가 가능합니다.");

    const result = await tweetsService.deleteComment(commentId);

    res.json(!!result);
  })
);

// [PUT] /tweets/:tweetId/bookmarks
tweetsRouter.put(
  "/tweets/:tweetId/bookmarks",
  wrapAsync(async (req, res, next) => {
    const tweetId = req.params.tweetId;
    const user = req.user;

    const foundTweet = await tweetsService.findTweetById(tweetId);
    if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
    else if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

    const result = await tweetsService.addBookmark(tweetId, user.id);

    res.json(result);
  })
);

// [DELETE] /tweets/:tweetId/bookmarks
tweetsRouter.delete("/tweets/:tweetId/bookmarks", async (req, res, next) => {
  const tweetId = req.params.tweetId;
  const user = req.user;

  const foundTweet = await tweetsService.findTweetById(tweetId);
  if (!foundTweet) throw new NotFoundError("없는 트윗입니다.");
  else if (!user) throw new ForbiddenError("로그인 후 이용해주세요.");

  const foundBookMark = await tweetsService.findBookMarkById(tweetId, user.id);

  if (!foundBookMark) throw new NotFoundError("북마크가 존재하지 않습니다.");

  const result = await tweetsService.deleteBookMarkById(tweetId, user.id);

  res.json(!!result);
});

export default tweetsRouter;
