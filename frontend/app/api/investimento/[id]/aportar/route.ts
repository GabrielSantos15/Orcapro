const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ error: "Token não informado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/investimento/${id}/aportar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await parseResponse(response);
      return Response.json(
        { error: data.message || "Erro ao realizar aporte" },
        { status: response.status }
      );
    }

    const updatedInvestimento = await parseResponse(response);
    return Response.json(updatedInvestimento, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error(">>> Erro POST aporte:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}