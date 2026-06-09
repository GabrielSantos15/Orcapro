import { forwardToBackend } from "@/lib/server/api";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status, ok } = await forwardToBackend(
    `/api/investimento/${id}/resgatar`,
    {
      method: "PUT",
      body,
    },
  );

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao realizar resgate" },
      { status },
    );
  }

  return Response.json(data, { status });
}
