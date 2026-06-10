import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
    const { data, status, ok } = await forwardToBackend("/api/categoria");

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao buscar categorias" },
            { status }
        );
    }

    return Response.json(data, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, status, ok } = await forwardToBackend("/api/categoria", {
      method: "POST",
      body,
    });

    if (!ok) {
      return Response.json(
        { error: data?.error || data?.message || "Erro ao criar categoria" },
        { status }
      );
    }

    return Response.json(data, { status });

  } catch (error) {
    return Response.json(
      { error: "Corpo da requisição inválido ou ausente." },
      { status: 400 }
    );
  }
}