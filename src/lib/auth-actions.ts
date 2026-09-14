"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, getExpectedAuthToken, isValidPassword } from "./auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = (formData.get("password") as string | null) ?? "";

  if (!(await isValidPassword(password))) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const token = await getExpectedAuthToken();
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    // 이 앱은 대부분 자체 HTTPS 없이 로컬/사내망에서 그대로 접속하는 것을 전제로 한다.
    // secure 쿠키는 HTTPS가 아니면 브라우저가 저장을 거부해 로그인이 계속 풀리므로,
    // HTTPS 뒤에 배포했을 때만 ABE_FORCE_SECURE_COOKIE=true로 명시적으로 켠다.
    secure: process.env.ABE_FORCE_SECURE_COOKIE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
