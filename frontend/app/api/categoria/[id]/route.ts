import { forwardToBackend } from "@/lib/server/api";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status, ok } = await forwardToBackend(`/api/categoria/${id}`, {
    method: "DELETE",
  });

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao deletar categoria" },
      { status }
    );
  }

  return Response.json(
    { message: "Categoria deletada com sucesso" },
    { status }
  );
}