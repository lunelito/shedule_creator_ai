"use client";

import { signIn } from "next-auth/react";
import { z } from "zod";

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
  success?: boolean;
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function logIn(formData: FormData): Promise<LoginType> {
  try {
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const formatted = result.error.format();
      return {
        errors: {
          email: formatted.email?._errors,
          password: formatted.password?._errors,
        },
      };
    }

    console.log("👉 Próba logowania z:", {
      email: result.data.email,
      password: result.data.password,
    });

    const res = await signIn("credentials", {
      redirect: false,
      email: result.data.email,
      password: result.data.password,
    });

    if (!res || res.error) {
      let message = "Nie udało się zalogować użytkownika";
      console.log(res)

      if (res?.error === "CredentialsSignin") {
        message = "Nieprawidłowy email lub hasło";
      } else if (res?.error?.includes("potwierdzony")) {
        message = "Musisz potwierdzić swój adres email przed zalogowaniem";
      }

      return {
        errors: {
          _form: [message],
        },
      };
    }

    return {
      success: true,
      errors: { _form: ["Zalogowano pomyślnie!"] },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: { _form: [err.message] },
      };
    }
    return {
      errors: { _form: ["Something went wrong..."] },
    };
  }
}
