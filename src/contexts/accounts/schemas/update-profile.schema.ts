import { z } from "zod";

export default z.object({
  body: z.object({
    nickname: z.string().nullable(),
    introduce: z.string().nullable(),
  }),
});
