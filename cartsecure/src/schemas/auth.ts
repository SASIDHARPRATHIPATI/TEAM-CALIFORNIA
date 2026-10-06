import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email().max(254),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/\d/, "Must contain a digit"),
    name: z.string().min(2).max(80),
    role: z.enum(["CUSTOMER", "SELLER"]).default("CUSTOMER"),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().email().max(254),
    password: z.string().min(1).max(128),
  })
  .strict();

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;