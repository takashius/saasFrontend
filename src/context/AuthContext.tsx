import React, { createContext, useContext, useState, ReactNode } from 'react'
import { RoleSimple } from '../types/users'

interface AuthContextType {
  user: any
  token: string | null
  login: (userData: any) => void
  logout: () => void
  getUser: () => void
  getRoles: () => void
  hasRole: (roleNames: string[]) => boolean
  updatePhoto: (photoUrl: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const token = localStorage.getItem('Token') ?? null

  const login = (userData: any) => {
    setUser(userData)
    const { token, role, ...userDataWithoutTokenAndRole } = userData
    localStorage.setItem('Token', token)
    localStorage.setItem('Roles', JSON.stringify(role))
    localStorage.setItem('UserData', JSON.stringify(userDataWithoutTokenAndRole))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('Token')
    localStorage.removeItem('UserData')
    localStorage.removeItem('Roles')
  }

  const getUser = (): any => {
    const userData = localStorage.getItem('UserData')
    if (userData) {
      return JSON.parse(userData)
    }
    return null
  }

  const getRoles = (): any => {
    const userRoles = localStorage.getItem('Roles')
    if (userRoles) {
      return JSON.parse(userRoles)
    }
    return null
  }

  const hasRole = (roleNames: string[]) => {
    const userRoles = getRoles()
    roleNames.push('SUPER_ADMIN')
    return userRoles.some((role: RoleSimple) => roleNames.includes(role.name))
  };

  const updatePhoto = (photoUrl: string) => {
    const updatedUser = { ...user, photo: photoUrl };
    setUser(updatedUser);
    localStorage.setItem('UserData', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getUser, getRoles, hasRole, updatePhoto }}>
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
