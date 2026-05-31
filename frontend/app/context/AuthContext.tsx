// context/AuthContext.tsx
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    
    // Se não tem token e não está em páginas públicas, redireciona para /
    if (!token && !['/', '/login', '/cadastro'].includes(pathname)) {
      router.push('/')
      return
    }

    if (!token) return

    fetch('/api/usuario', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser({ id: data.id, nome: capitalizeString(data.nome), email: data.email }))
      .catch(err => console.error('Erro ao buscar usuário:', err))
  }, [router, pathname])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
