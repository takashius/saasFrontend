import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  user: any
  token: string | null
  login: (userData: any) => void
  logout: () => void
  getUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const token = localStorage.getItem('Token') ?? null

  const login = (userData: any) => {
    setUser(userData)
    localStorage.setItem('Token', userData.token)
    localStorage.setItem('UserData', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('Token')
    localStorage.removeItem('UserData')
  }

  const getUser = (): any => {
    const userData = localStorage.getItem('UserData')
    if (userData) {
      return JSON.parse(userData)
    }
    return null
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
