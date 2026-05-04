export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return Response.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    const response = Response.json({ success: true });
    const headers = new Headers(response.headers);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    headers.set("Set-Cookie", `admin-auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`);
    return new Response(response.body, { status: 200, headers });
  } catch (e) {
    console.error("[POST /api/admin/login]", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
