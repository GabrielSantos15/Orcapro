import { publicRequest } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return Response.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || typeof senha !== "string") {
      return Response.json(
        { error: "Email e senha devem ser strings" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    if (senha.length < 6) {
      return Response.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 },
      );
    }

    const { data, status, ok } = await publicRequest("/api/usuario/login", {
      method: "POST",
      body,
    });

    if (!ok) {
      return Response.json(
        { error: data?.message || data?.error || "Erro ao fazer login" },
        { status },
      );
    }

    const res = Response.json({ nome: data.nome }, { status });

    res.headers.set(
      "Set-Cookie",
      `user_token=${data.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
    );

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: message }, { status: 500 });
  }
}
