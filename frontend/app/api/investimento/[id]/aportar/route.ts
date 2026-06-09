import { forwardToBackend } from "@/lib/server/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status, ok } = await forwardToBackend(
    `/api/investimento/${id}/aportar`,
    {
      method: "POST",
      body,
    },
  );

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao realizar aporte" },
      { status },
    );
  }

  return Response.json(data, { status });
}
