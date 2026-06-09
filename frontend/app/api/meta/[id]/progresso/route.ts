import { forwardToBackend } from "@/lib/server/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json();
  const { id } = await params;
  const { data, status, ok } = await forwardToBackend(
    `/api/meta/${id}/progresso`,
    { method: "PATCH", body },
  );

  if (!ok) {
    if (!ok) {
      return Response.json(
        {
          error:
            data.error || data.message || "Erro ao adicionar progresso na meta",
        },
        { status },
      );
    }
  }

  return Response.json(data, { status });
}
