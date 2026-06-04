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

// Valida JWT localmente
const isValidJWT = (token: string): boolean => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
    
    // Verifica se já expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.warn('Token expirado')
      return false
    }
    
    return true
  } catch (e) {
    console.error('Token JWT inválido:', e)
    return false
  }
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
    const token = localStorage.getItem('user_token')
    // Se está em rota protegida e não tem token, redireciona sem renderizar
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        router.push('/login')
        return 
      }

      // Valida JWT localmente
      if (!isValidJWT(token)) {
        localStorage.removeItem('user_token')
        router.push('/login')
        return 
      }

      // Valida no backend
      fetch('/api/usuario', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            throw new Error('Token expirado ou inválido no backend')
          }
          return res.json()
        })
        .then(data => {
          if (data?.id && data?.nome) {
            setUser({ id: data.id, nome: capitalizeString(data.nome), email: data.email })
            setIsLoading(false)
          } else {
            throw new Error('Dados do usuário inválidos')
          }
        })
        .catch(err => {
          console.error('Erro na validação do token:', err)
          localStorage.removeItem('user_token')
          router.push('/login')
        })
        .finally(() => {
          setIsLoading(false) 
        })
    } else {
      // Páginas públicas, sem validação
      setIsLoading(false)
    }
  }, [router, pathname])

  // Em rotas protegidas, não renderiza enquanto valida
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
