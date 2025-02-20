export interface CategoryType {
  name: string
  description: string
  image: string
  _id?: string
  id?: string
}

export interface CategoryListResponse {
  results: CategoryType[]
  totalCategories: number
  totalPages: number
  currentPage: number
  next: string | null
}
