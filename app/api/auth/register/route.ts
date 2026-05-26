const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export async function POST(request: Request) {
    const body = await request.json()
    const { nome, email, senha } = body
    
    if (!nome || !email || !senha) {
        return Response.json(
            { error: 'Email e senha são obrigatórios' },
            { status: 400 }
        )
    }
    
    if (typeof email !== 'string' || typeof senha !== 'string') {
        return Response.json(
            { error: 'Email e senha devem ser strings' },
            { status: 400 }
        )
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return Response.json(
            { error: 'Email inválido' },
            { status: 400 }
        )
    }
    
    if (senha.length < 6) {
        return Response.json(
            { error: 'Senha deve ter no mínimo 6 caracteres' },
            { status: 400 }
        )
    }
    
    const response = await fetch(`${BACKEND_URL}/api/usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nome.toUpperCase(), email, senha })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
        return Response.json(
            { error: data.message || 'Erro ao fazer login' },
            { status: response.status }
        )
    }
    
    return Response.json(data)
}