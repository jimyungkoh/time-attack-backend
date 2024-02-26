import bodyParser from "body-parser";
import { ExpressApp } from "../types/Express.type";

export default async ({ app }: ExpressApp) => {
  app.use(bodyParser.json());
  // TODO: Auth Middlewares
  app.use();
  // TODO: Routers
  app.use();
  // TODO: Exception Handler
  app.use();
};
