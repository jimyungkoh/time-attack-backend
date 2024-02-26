import { Router } from "express";
import accountsRouter from "./accounts/accounts.router";
import followRouter from "./follow/follow.router";
import tweetsRouter from "./tweets/tweets.router";

const routers = Router();

routers.get("/health-check", (req, res, next) => {
  res.send("OK");
});

routers.use(tweetsRouter);
routers.use(followRouter);
routers.use(accountsRouter);

export default routers;
