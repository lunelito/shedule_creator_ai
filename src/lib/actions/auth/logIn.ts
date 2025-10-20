"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const loginSchema = z.object({
  email: z
    .string()
    .min(5, "Email jest za krótki")
    .max(100, "Email jest za długi")
    .email("Nieprawidłowy adres email"),

  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(64, "Hasło może mieć maksymalnie 64 znaki")
    .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną dużą literę")
    .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
    .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
    .regex(/[\W_]/, "Hasło musi zawierać co najmniej jeden znak specjalny"),
});

type LoginType = {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
export async function logIn(
  formState: LoginType,
  formData: FormData
): Promise<LoginType> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const formatted = result.error.format();
    return {
      errors: {
        email: formatted.email?._errors || [],
        password: formatted.password?._errors || [],
      },
    };
  }

  try {
    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return {
        errors: {
          _form: ["Invalid email or password"],
        },
      };
    }

    return { 
      errors: {},
      success: true 
    };

  } catch (err: unknown) {
    return {
      errors: {
        _form: ["Something went wrong..."],
      },
    };
  }
}