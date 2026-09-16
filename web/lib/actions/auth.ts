"use server";

import { redirect } from "next/navigation";
import {
  adminCredentials,
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/auth";

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const expected = adminCredentials();

  const emailOk = email === expected.email;
  const passOk = verifyPassword(password, expected.password);

  if (!emailOk || !passOk || !expected.email || !expected.password) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
