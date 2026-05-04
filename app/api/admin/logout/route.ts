export async function POST() {
  const headers = new Headers();
  headers.set("Set-Cookie", "admin-auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  headers.set("Location", "/admin/login");
  return new Response(null, { status: 302, headers });
}
