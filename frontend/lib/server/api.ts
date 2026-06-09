import { getToken } from "./auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function forwardToBackend(
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {}
) {
  try {
    const token = await getToken();

    if (!token) {
      return {
        data: { error: "Não autenticado" },
        status: 401,
      };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers,
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, fetchOptions);
    const data = await parseResponse(response);

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error(`>>> Erro ao chamar ${endpoint}:`, message);
    return {
      data: { error: message },
      status: 500,
    };
  }
}
