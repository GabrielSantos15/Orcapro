import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;

    const token = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!token) {

      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/categoria/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {

      const errorText = await response.text();

      return NextResponse.json(
        {
          error:
            errorText ||
            "Erro ao deletar categoria",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Categoria deletada com sucesso",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "Erro no DELETE de categoria:",
      error
    );

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      {
        status: 500,
      }
    );
  }
}