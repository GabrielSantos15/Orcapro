export async function POST() {
  const res = Response.json({ success: true });

  res.headers.set(
    "Set-Cookie",
    "user_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );

  return res;
}