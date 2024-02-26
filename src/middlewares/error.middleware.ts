import { NextFunction, Request, Response } from "express";
import { BadRequestError, HttpError } from "../errors/http.error";

export default async function (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(err instanceof HttpError)) err = new BadRequestError(err.message);

  const { statusCode, message } = err as HttpError;

  res.status(statusCode as number).json(message);

  next();
}
