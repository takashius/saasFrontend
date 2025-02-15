import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { Category, CategoryListResponse } from 'src/types/category'

const fetchSimpleCategories = async (): Promise<Category[]> => {
  const response = await ERDEAxios.get<Category[]>('/categories/simple')
  return response.data
}

export const useCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery<Category[], Error>({
    queryKey: ['category simple'],
    queryFn: fetchSimpleCategories,
    retry: false
  })
}

const fetchCategories = async (
  page: number,
  search: string
): Promise<CategoryListResponse> => {
  const response = await ERDEAxios.get<CategoryListResponse>(
    `/categories/list/${page}/${search}`
  )
  return response.data
}

export const useCategoryList = (
  page: number,
  search: string
): UseQueryResult<CategoryListResponse, Error> => {
  return useQuery<CategoryListResponse, Error>({
    queryKey: ['categoryList', page, search],
    queryFn: () => fetchCategories(page, search),
    retry: false
  })
}

const createCategory = async (productData: Category): Promise<void> => {
  await ERDEAxios.post('/categories', productData)
}

export const useCreateCategory = (): UseMutationResult<
  void,
  Error,
  Category
> => {
  return useMutation<void, Error, Category>({
    mutationFn: createCategory,
    retry: false
  })
}

const editCategory = async (productData: Category): Promise<void> => {
  await ERDEAxios.patch('/categories', productData)
}

export const useEditCategory = (): UseMutationResult<void, Error, Category> => {
  return useMutation<void, Error, Category>({
    mutationFn: editCategory,
    retry: false
  })
}

const deleteCategory = async (id: string) => {
  const response = await ERDEAxios.delete(`/categories/${id}`)
  return response.data
}

export const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: deleteCategory
  })
}
