export interface Created {
  user: string
  date: string
}

export interface CreatedExtend {
  user: User
  date: string
}

export interface User {
  _id: string
  name: string
  lastname: string
}

export interface Company {
  _id: string
  name: string
  email: string
  phone: string
  rif: string
  address: string
  logo: string
  logoAlpha: string
}

export interface Product {
  category: any
  master: string
  name: string
  description: string
  price: number
  amount: number
  iva: boolean
  _id: string
}

export interface Account {
  address?: string | undefined
  bio: string | undefined
  _id?: string
  name: string | undefined
  lastName: string | undefined
  photo?: string
  banner?: string
  phone: string | undefined
  email?: string
  date?: string
  companys?: CompanyAccount[]
  role?: Role[]
}

export interface LoginResponse {
  _id: string
  name: string
  lastName: string
  photo: string
  email: string
  date: string
  token: string
}

export interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  iva: boolean
}

export interface ProductListResponse {
  results: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
  next: string | null
}

export interface Company {
  _id?: string
  id?: string
  name?: string
  description?: string
  email?: string
  phone?: string
  rif?: string
  address?: string
  banner?: string
  currencySymbol?: string
  currencyRate?: string
  iva?: number
  logo?: string
  logoAlpha?: string
  configMail?: ConfigMail
  colors?: Colors
  configPdf?: ConfigPDF
  pdf?: ConfigPDF
  correlatives?: Correlative
}

export interface ConfigMail {
  colors: Colors
  textBody: string
}

export interface Colors {
  id?: string
  background: string
  primary: string
  secundary: string
  title: string
}

export interface ConfigPDF {
  id?: string
  logo: Logo
  logoAlpha: Logo
}

export interface Correlative {
  manageInvoiceCorrelative: boolean
  invoice: number
}

export interface Simple {
  id: string
  name: string
}
