import { User } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

export type ExpressApp = {
  app: express.Application;
};
