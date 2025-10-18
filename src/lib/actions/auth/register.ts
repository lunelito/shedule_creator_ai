"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Imię musi mieć co najmniej 2 znaki")
      .max(30, "Imię może mieć maksymalnie 30 znaków")
      .regex(/^[A-Za-zÀ-ž\s]+$/, "Imię może zawierać tylko litery i spacje"),

    lastName: z
      .string()
      .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
      .max(40, "Nazwisko może mieć maksymalnie 40 znaków")
      .regex(
        /^[A-Za-zÀ-ž\s-]+$/,
        "Nazwisko może zawierać tylko litery, myślnik i spacje"
      ),

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

    repeatPassword: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .max(64, "Hasło może mieć maksymalnie 64 znaki")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną dużą literę")
      .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
      .regex(/[\W_]/, "Hasło musi zawierać co najmniej jeden znak specjalny"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła muszą być takie same",
    path: ["repeatPassword"],
  });

type RegisterType = {
  errors: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    repeatPassword?: string[];
    _form?: string[];
  };
};

export async function register(
  formState: RegisterType,
  formData: FormData
): Promise<RegisterType> {
  const result = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
  });

  if (!result.success) {
    const formatted = result.error.format();

    return {
      errors: {
        firstName: formatted.firstName?._errors,
        lastName: formatted.lastName?._errors,
        email: formatted.email?._errors,
        password: formatted.password?._errors,
        repeatPassword: formatted.repeatPassword?._errors,
      },
    };
  }

  try {
    // call api
    // set use context of user data or in session
    // catch errors from api also
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

  // if all good
  console.log("REGISTER")
  // just for test, it will redirect to login, change the form
  redirect("/");
}
