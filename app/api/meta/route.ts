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

export async function GET(
  request: Request
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

    const response = await fetch(
      `${BACKEND_URL}/api/meta`,
      {
        method: "GET",
        headers: {
          authorization: authHeader
        }
      }
    );

    const data =
      await parseResponse(response);

    if (!response.ok) {

      return Response.json(
        {
          error:
            data.message ||
            "Erro ao buscar meta"
        },
        {
          status: response.status
        }
      );
    }

    return Response.json(data);

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    console.error(
      ">>> Erro GET Metas:",
      message
    );

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
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

    const body =
      await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/meta`, // <-- CORRIGIDO PARA SINGULAR
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          authorization: authHeader
        },
        body: JSON.stringify(body)
      }
    );

    const data =
      await parseResponse(response);

    if (!response.ok) {

      return Response.json(
        {
          error:
            data.message ||
            "Erro ao criar Meta"
        },
        {
          status: response.status
        }
      );
    }

    return Response.json(
      data,
      { status: 201 }
    );

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido";

    console.error(
      ">>> Erro POST metas:",
      message
    );

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}