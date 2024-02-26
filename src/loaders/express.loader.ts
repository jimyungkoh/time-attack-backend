import bodyParser from "body-parser";
import routers from "../contexts";
import authMiddleware from "../middlewares/auth.middleware";
import errorMiddleware from "../middlewares/error.middleware";
import { ExpressApp } from "../types/Express.type";

export default async ({ app }: ExpressApp) => {
  app.use(bodyParser.json());
  // TODO: Auth Middlewares
  app.use(authMiddleware);
  // TODO: Routers
  app.use(routers);
  // TODO: Exception Handler
  app.use(errorMiddleware);
};
