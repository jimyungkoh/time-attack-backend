import { z } from "zod";

export default z.object({
  body: z.object({
    email: z.string().email("이메일 주소는 유효한 형식이어야 합니다."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  }),
});
