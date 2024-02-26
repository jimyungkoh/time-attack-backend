import "dotenv";
import * as dotenv from "dotenv";
import express from "express";
import loaders from "./loaders";

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT || 5050;

  await loaders.init({ app });

  app.listen(port);
}
