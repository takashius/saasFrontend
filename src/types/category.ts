export interface Category {
  name: string
  description: string
  image: string
  _id?: string
}

export interface CategoryListResponse {
  results: Category[]
  totalCategories: number
  totalPages: number
  currentPage: number
  next: string | null
}
