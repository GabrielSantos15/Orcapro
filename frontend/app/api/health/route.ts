import { publicRequest } from "@/lib/server/api";

export async function GET(request: Request) {
  const { data, status, ok } = await publicRequest("/api/health");

  if (!ok) {
    return Response.json(
      { error: data?.error || data?.message || "Falha ao verificar o status do servidor" },
      { status }
    );
  }

  return Response.json(data,{status});
}