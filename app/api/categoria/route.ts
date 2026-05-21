const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

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