const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:8080";

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = await params; 

    const response = await fetch(
      `${BACKEND_URL}/api/meta/${id}/progresso`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader
        },
        body: JSON.stringify(body)
      }
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      return Response.json(
        {
          error: data.message || "Erro ao adicionar progresso na meta"
        },
        { status: response.status }
      );
    }

    return Response.json(data);

  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    console.error(">>> Erro PATCH Progresso Meta:", message);

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}