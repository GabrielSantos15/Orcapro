'use server'

import { cookies } from "next/headers"

export async function setThemeCookie(theme: string) {
  const cookieStore = await cookies()
  cookieStore.set('orcapro-theme', theme, {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: 'lax',
  })
}