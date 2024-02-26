import { z } from "zod";

export default z.object({
  body: z.object({
    title: z.string({ invalid_type_error: "트윗 제목은 문자열이어야 합니다." }),
    content: z.string({
      invalid_type_error: "트윗 내용은 문자열이어야 합니다.",
    }),
  }),
});
