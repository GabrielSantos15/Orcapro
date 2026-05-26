const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

async function parseResponse(response: Response) {
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
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/conta/${id}`, {
      method: "DELETE",
      headers: {
        authorization: authHeader,
      },
    });

    if (!response.ok) {
      const data = await parseResponse(response);

      return Response.json(
        {
          error: data.message || "Erro ao deletar conta",
        },
        {
          status: response.status,
        }
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido";

    console.error(">>> Erro DELETE conta:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/conta/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await parseResponse(response);

      return Response.json(
        {
          error: data.message || "Erro ao atualizar conta",
        },
        {
          status: response.status,
        }
      );
    }

    const updatedConta = await parseResponse(response);

    return Response.json(updatedConta, {
      status: 200,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido";

    console.error(">>> Erro PUT conta:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Token não informado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/conta/${id}`, {
      method: "GET",
      headers: {
        authorization: authHeader,
      },
    });

    if (!response.ok) {
      const data = await parseResponse(response);

      return Response.json(
        {
          error: data.message || "Erro ao buscar conta",
        },
        {
          status: response.status,
        }
      );
    }

    const conta = await parseResponse(response);

    return Response.json(conta, {
      status: 200,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido";

    console.error(">>> Erro GET conta:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
