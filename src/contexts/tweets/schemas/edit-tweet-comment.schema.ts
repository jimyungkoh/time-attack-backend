import { z } from "zod";

export default z.object({
  body: z.object({
    content: z
      .string({
        invalid_type_error: "댓글 내용은 문자열이어야 합니다.",
      })
      .nullable(),
  }),
});
