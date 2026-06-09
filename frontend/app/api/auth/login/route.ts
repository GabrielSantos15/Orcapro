const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, senha } = body;

        if (!email || !senha) {
            return Response.json(
                { error: "Email e senha são obrigatórios" },
                { status: 400 }
            );
        }

        if (typeof email !== "string" || typeof senha !== "string") {
            return Response.json(
                { error: "Email e senha devem ser strings" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json(
                { error: "Email inválido" },
                { status: 400 }
            );
        }

        if (senha.length < 6) {
            return Response.json(
                { error: "Senha deve ter no mínimo 6 caracteres" },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/api/usuario/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            return Response.json(
                { error: data.message || "Erro ao fazer login" },
                { status: response.status }
            );
        }

        // salva o token no cookie HttpOnly
        const res = Response.json(
            { nome: data.nome },
            { status: 200 }
        );

        res.headers.set(
            "Set-Cookie",
            `user_token=${data.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
        );

        return res;

    } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        return Response.json({ error: message }, { status: 500 });
    }
}