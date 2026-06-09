import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
    const { data, status, ok } = await forwardToBackend("/api/conta");

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao buscar contas" },
            { status }
        );
    }

    return Response.json(data, { status });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { data, status, ok } = await forwardToBackend("/api/conta", {
        method: "POST",
        body,
    });

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao criar conta" },
            { status }
        );
    }

    return Response.json(data, { status });
}