"use server";

import { z } from "zod";

const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Nazwa organizacji musi mieć co najmniej 2 znaki")
    .max(255, "Nazwa organizacji może mieć maksymalnie 255 znaków")
    .regex(
      /^[A-Za-zÀ-ž0-9\s\-\_]+$/,
      "Nazwa organizacji może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia"
    )
    .regex(
      /[A-Za-zÀ-ž]/,
      "Nazwa organizacji musi zawierać przynajmniej jedną literę"
    ),
  timezone: z
    .string()
    .max(64, "Strefa czasowa może mieć maksymalnie 64 znaki")
    .optional()
    .default("UTC"),
  created_by: z.int(),
  icon: z.string().min(1, "Zaznacz ikonę"),
});

type AddOrganizationType = {
  success?: boolean;
  errors: {
    name?: string[];
    timezone?: string[];
    created_by?: string[];
    icon?: string[];
    _form?: string[];
  };
};

export async function addOrganization(
  formState: AddOrganizationType,
  formData: FormData
): Promise<AddOrganizationType> {
  const result = organizationSchema.safeParse({
    name: formData.get("organization"),
    timezone: formData.get("timezone"),
    created_by: parseInt(formData.get("created_by") as string, 10),
    icon: formData.get("icon"),
  });

  if (!result.success) {
    const formatted = result.error.format();
    return {
      errors: {
        name: formatted.name?._errors,
        timezone: formatted.timezone?._errors,
        created_by: formatted.created_by?._errors,
        icon: formatted.icon?._errors,
      },
    };
  }

  try {
    const apiUrl = new URL(
      "/api/organizations",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).toString();

    console.log(result.data.icon);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: result.data.name,
        timezone: result.data.timezone,
        created_by: result.data.created_by,
        icon: result.data.icon,
      }),
    });

    let responseData;

    try {
      responseData = await res.json();
    } catch {
      responseData = { error: await res.text() };
    }

    if (!res.ok) {
      return {
        errors: {
          _form: [responseData.error || "Nie udało się stworzyć organizacji"],
        },
      };
    }

    return {
      success: true,
      errors: { _form: ["Organizacja stworzona pomyślnie"] },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ["Coś poszło nie tak..."] } };
    }
  }
}
