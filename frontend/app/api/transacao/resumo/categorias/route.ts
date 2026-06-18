import { forwardToBackend } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const dataInicio = searchParams.get("dataInicio");
  const dataFim = searchParams.get("dataFim");

  if (!dataInicio || !dataFim) {
    return Response.json(
      { error: "Os parâmetros 'dataInicio' e 'dataFim' são obrigatórios para gerar o resumo." },
      { status: 400 }
    );
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/transacao/resumo/categorias?${queryString}`;

  const { data, status, ok } = await forwardToBackend(endpoint);

  if (!ok) {
    return Response.json(
      { error: data.error || data.message || "Erro ao buscar resumo por categorias" },
      { status }
    );
  }

  return Response.json(data);
}