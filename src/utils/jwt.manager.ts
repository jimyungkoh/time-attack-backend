import { User } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

const sign = (user: User) => {
  return jwt.sign({ id: user.email }, JWT_SECRET, {
    subject: user.email,
    expiresIn: "2h",
  });
};

const verify = (accessToken: string) => jwt.verify(accessToken, JWT_SECRET);

const jwtManager = {
  sign,
  verify,
};

export default jwtManager;
