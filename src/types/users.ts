export interface userBase {
  _id: string
  fullName: String
  name: String
  lastName: String
  phone: String
  email: String
  photo: String
  date: string
}

export interface UserListResponse {
  results: userBase[]
  totalUSers: number
  totalPages: number
  currentPage: number
  next: string | null
}

export interface UserForm {
  id?: String
  name: String
  lastName: String
  phone: String
  password: String
  email: String
  photo: any
  role: any
}

export interface Role {
  _id: string
  name: string
  description: string
  disabled: boolean
}

export interface userDetail extends UserForm {
  _id?: string
  photo: string
  banner: string
  bio: string
  address: string
  role: Role[]
}
