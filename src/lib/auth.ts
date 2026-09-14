export const AUTH_COOKIE_NAME = "abe_auth";

// 별도의 회원 시스템 없이 선생님 한 명만 사용하는 도구이므로,
// 계정 대신 공유 비밀번호 하나로 접근을 제한한다.
// 운영 환경에서는 반드시 .env.local에 ABE_ADMIN_PASSWORD를 설정해서 기본값을 덮어써야 한다.
function getAdminPassword(): string {
  return process.env.ABE_ADMIN_PASSWORD || "ableenglish";
}

// Edge/Node 런타임 모두에서 동작하도록 Web Crypto(SubtleCrypto)만 사용한다.
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 길이가 같은 두 문자열을 값 노출 없이 상수 시간에 비교한다.
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// 쿠키에는 비밀번호 원문 대신 해시값만 저장한다.
export async function getExpectedAuthToken(): Promise<string> {
  return sha256Hex(getAdminPassword());
}

export async function isValidPassword(password: string): Promise<boolean> {
  const [input, expected] = await Promise.all([
    sha256Hex(password),
    getExpectedAuthToken(),
  ]);
  return timingSafeEqualStr(input, expected);
}

export async function isValidAuthToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedAuthToken();
  return timingSafeEqualStr(token, expected);
}
