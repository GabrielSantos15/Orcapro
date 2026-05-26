const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

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
      `${BACKEND_URL}/api/investimento`,
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
            "Erro ao buscar investimentos"
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
      ">>> Erro GET investimento:",
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
      `${BACKEND_URL}/api/investimento`,
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
            "Erro ao criar investimento"
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
      ">>> Erro POST investimento:",
      message
    );

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}