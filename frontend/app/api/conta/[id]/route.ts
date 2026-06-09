import { forwardToBackend } from "@/lib/server/api";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { data, status, ok } = await forwardToBackend(`/api/conta/${id}`, {
        method: "DELETE",
    });

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao deletar conta" },
            { status }
        );
    }

    return new Response(null, { status: 204 });
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { data, status, ok } = await forwardToBackend(`/api/conta/${id}`, {
        method: "PUT",
        body,
    });

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao atualizar conta" },
            { status }
        );
    }

    return Response.json(data, { status });
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { data, status, ok } = await forwardToBackend(`/api/conta/${id}`);

    if (!ok) {
        return Response.json(
            { error: data.error || data.message || "Erro ao buscar conta" },
            { status }
        );
    }

    return Response.json(data, { status });
}