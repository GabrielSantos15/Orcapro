const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { error: "Token não informado" },
                { status: 401 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/api/categoria`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": authHeader
            }
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            return Response.json(
                { error: data.message || "Erro ao buscar usuário" },
                { status: response.status }
            );
        }

        return Response.json(data, { status: 200 });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        console.error(">>> Erro no BFF:", message);
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { error: "Token não informado" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/categoria`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": authHeader
            },
            body: JSON.stringify(body)
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            return Response.json(
                { error: data.message || "Erro ao criar categoria" },
                { status: response.status }
            );
        }

        return Response.json(data, { status: 201 });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        console.error(">>> Erro no BFF:", message);
        return Response.json({ error: message }, { status: 500 });
    }
}