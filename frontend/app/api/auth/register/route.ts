import { publicRequest } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha } = body;

    if (!nome || !email || !senha) {
      return Response.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (typeof nome !== "string" || typeof email !== "string" || typeof senha !== "string") {
      return Response.json(
        { error: "Nome, email e senha devem ser strings" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    if (senha.length < 6) {
      return Response.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Cadastro
    const register = await publicRequest("/api/usuario", {
      method: "POST",
      body,
    });

    if (!register.ok) {
      return Response.json(
        {
          error:
            register.data?.message ||
            register.data?.error ||
            "Erro ao fazer cadastro",
        },
        { status: register.status }
      );
    }

    // 2. Login automático após cadastro
    const login = await publicRequest("/api/usuario/login", {
      method: "POST",
      body: { email, senha },
    });

    if (!login.ok) {
      return Response.json(
        {
          error:
            login.data?.message ||
            login.data?.error ||
            "Erro ao fazer login",
        },
        { status: login.status }
      );
    }

    const res = Response.json(
      { nome: login.data.nome },
      { status: 200 }
    );

    res.headers.set(
      "Set-Cookie",
      `user_token=${login.data.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";

    return Response.json({ error: message }, { status: 500 });
  }
}