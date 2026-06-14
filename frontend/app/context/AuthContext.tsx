'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const capitalizeString = (str: string): string => {
    if (!str) return str

    return str
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(' ')
}

type User = {
    id: number
    nome: string
    email: string
    avatarSeed: string 
}

type AuthContextType = {
    user: User | null
    setUser: (user: User | null) => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/usuario')
            .then(async res => {
                if (!res.ok) {
                    throw new Error('Erro ao carregar usuário')
                }

                return res.json()
            })
            .then(data => {
                const nomeFormatado = capitalizeString(data.nome);
                
                //  Busca a seed salva no navegador
                const savedSeed = localStorage.getItem('avatar_seed');
                
                setUser({
                    id: data.id,
                    nome: nomeFormatado,
                    email: data.email,
                    // Define o avatar: usa o salvo, senão usa o nome, senão "usuario"
                    avatarSeed: savedSeed || nomeFormatado || 'usuario',
                })
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth deve ser usado dentro de AuthProvider'
        )
    }

    return context
}