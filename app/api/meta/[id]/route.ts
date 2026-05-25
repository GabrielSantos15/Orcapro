const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:8080";

async function parseResponse(
  response: Response
) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Tipagem corrigida para Promise
) {
  try {
    const authHeader =
      request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = await params; // <-- Await adicionado aqui!

    const response = await fetch(
      `${BACKEND_URL}/api/meta/${id}`,
      {
        method: "PUT",
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
          error: data.message || "Erro ao atualizar Meta"
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

    console.error(">>> Erro PUT Meta:", message);

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Tipagem corrigida para Promise
) {
  try {
    const authHeader =
      request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const { id } = await params; // <-- Await adicionado aqui!

    const response = await fetch(
      `${BACKEND_URL}/api/meta/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: authHeader
        }
      }
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      return Response.json(
        {
          error: data.message || "Erro ao deletar Meta"
        },
        { status: response.status }
      );
    }

    // Mantive a sua resposta com status 200 (se funcionar bem no seu front, tudo certo!)
    return Response.json(
      { message: "Meta deletada com sucesso" },
      { status: 200 }
    );

  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    console.error(">>> Erro DELETE Meta:", message);

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}