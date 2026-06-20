import { forwardToBackend } from "@/lib/server/api";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, status, ok } = await forwardToBackend(`/api/orcamento/${id}`, {
    method: "PUT",
    body,
  });

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Erro ao atualizar o orçamento" },
      { status },
    );
  }

  return Response.json(data, { status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status, ok } = await forwardToBackend(`/api/orcamento/${id}`, {
    method: "DELETE",
  });

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Erro ao excluir o orçamento" },
      { status },
    );
  }
  
  return new Response(null, { status });
}