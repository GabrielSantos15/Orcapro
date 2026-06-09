import { forwardToBackend } from "@/lib/server/api";

export async function GET() {
    const { data, status, ok } = await forwardToBackend("/api/usuario");

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao buscar usuário" },
            { status }
        );
    }

    return Response.json(data, { status });
}