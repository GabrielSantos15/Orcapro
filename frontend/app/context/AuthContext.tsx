'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    const router = useRouter()

    useEffect(() => {
        fetch('/api/usuario')
            .then(async res => {
                // Se o token expirou ou não tem permissão 
                if (res.status === 401 || res.status === 403) {
                    throw new Error('UNAUTHORIZED')
                }

                if (!res.ok) {
                    throw new Error('Erro ao carregar usuário')
                }

                return res.json()
            })
            .then(data => {
                const nomeFormatado = capitalizeString(data.nome);
                const savedSeed = localStorage.getItem('avatar_seed');

                setUser({
                    id: data.id,
                    nome: nomeFormatado,
                    email: data.email,
                    avatarSeed: savedSeed || nomeFormatado || 'usuario',
                })
            })
            .catch(async (error) => {
                setUser(null)

                // Se o erro foi de falta de autorização, vai para login
                if (error.message === 'UNAUTHORIZED') {
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { })
                    router.push('/')
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [router])

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