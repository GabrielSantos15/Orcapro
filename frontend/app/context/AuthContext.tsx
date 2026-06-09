'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const capitalizeString = (str: string): string => {
    if (!str) return str
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

type User = {
    id: number
    nome: string
    email: string
}

type AuthContextType = {
    user: User | null
    setUser: (user: User | null) => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname.startsWith('/dashboard')) {
            fetch('/api/usuario')
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error('Não autenticado')
                    }
                    return res.json()
                })
                .then(data => {
                    if (data?.id && data?.nome) {
                        setUser({
                            id: data.id,
                            nome: capitalizeString(data.nome),
                            email: data.email
                        })
                    } else {
                        throw new Error('Dados do usuário inválidos')
                    }
                })
                .catch(err => {
                    console.error('Erro na validação:', err)
                    router.push('/login')
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }, [router, pathname])

    if (pathname.startsWith('/dashboard') && isLoading) {
        return null
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
    return context
}