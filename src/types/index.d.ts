export interface Created {
  user: string
  date: string
}

export interface CreatedExtend {
  user: User
  date: string
}

export interface Customer {
  _id: string
  name: string
  lastname: string
}

export interface Quotation {
  created: Created
  _id: string
  title: string
  description: string
  status: string
  number: number
  sequence: number
  amount: number
  date: string
  company: string
  customer: Customer
  rate: number
  discount: number
  typeDiscount: string
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

export interface Address {
  title: string
  city: string
  line1: string
  line2?: string
  zip: string
  default: boolean
  _id: string
}

export interface Product {
  master: string
  name: string
  description: string
  price: number
  amount: number
  iva: boolean
  _id: string
}

export interface CustomerDetail {
  _id: string
  title: string
  name: string
  lastname: string
  rif: string
  email: string
  phone: string
  addresses: Address[]
}

export interface QuotationDetail {
  created: {
    user: User
    date: string
  }
  _id: string
  title: string
  description: string
  status: string
  number: number
  sequence: number
  amount: number
  date: string
  company: Company
  customer: CustomerDetail
  rate: number
  discount: number
  typeDiscount: string
  products: Product[]
  totalIva: number
  total: number
}

export interface Client {
  created: CreatedExtend
  _id: string
  title: string
  name: string
  lastname: string
  rif: string
  email: string
  company: string
  addresses: Address[]
  active: boolean
}

export interface ClientForm {
  title: string
  name: string
  lastname: string
  rif: string
  email: string
  phone: string
  address: {
    title: string
    city: string
    line1: string
    line2?: string
    zip: string
  }
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

export interface ClientListResponse {
  results: Client[]
  totalCustomers: number
  totalPages: number
  currentPage: number
  next: string | null
}

export interface EditClientForm {
  id: string
  title: string
  name: string
  lastname: string
  rif: string
  email: string
  phone: string
}

export interface AddressForm {
  id: string
  _id?: string
  idAddress?: string
  title: string
  city: string
  line1: string
  line2: string
  zip: string
  default?: boolean
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

// Tipos necesarios para moneyFlow
export interface MoneyFlow {
  created: CreatedExtend
  _id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: MoneyFlowCategory
  company: string
}

export interface MoneyFlowCategory {
  _id?: string
  name: string
}

export interface NewMoneyFlow {
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  cotiza: string
}

export interface UpdateMoneyFlow extends NewMoneyFlow {
  id: string
}
