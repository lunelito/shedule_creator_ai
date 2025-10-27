"use server";

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
        email: formatted.email?._errors,
        password: formatted.password?._errors,
      },
    };
  }

  try {
    const csrfRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: String(result.data.email),
          password: String(result.data.password),
          csrfToken,
        }),
      }
    );

    if (!res?.ok) {
      return {
        errors: {
          _form: ["Nie udało się zarejestrować użytkownika"],
        },
      };
    } else {
      return {
        success: true,
        errors: { _form: ["Konto stworzone pomyślnie"] },
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }
}
