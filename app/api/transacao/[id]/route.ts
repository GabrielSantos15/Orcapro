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

export async function DELETE(
  request: Request,
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
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

    const { id } = await params;

    const response = await fetch(
      `${BACKEND_URL}/api/transacao/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: authHeader
        }
      }
    );

    if (!response.ok) {

      const data =
        await parseResponse(response);

      return Response.json(
        {
          error:
            data.message ||
            "Erro ao deletar transação"
        },
        {
          status: response.status
        }
      );
    }

    return new Response(null, {
      status: 204
    });

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    console.error(
      ">>> Erro DELETE transacao:",
      message
    );

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}