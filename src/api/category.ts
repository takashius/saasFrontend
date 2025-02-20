import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { CategoryType, CategoryListResponse } from 'src/types/category'

const fetchSimpleCategories = async (): Promise<CategoryType[]> => {
  const response = await ERDEAxios.get<CategoryType[]>('/categories/simple')
  return response.data
}

export const useCategories = (): UseQueryResult<CategoryType[], Error> => {
  return useQuery<CategoryType[], Error>({
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

const createCategory = async (productData: CategoryType): Promise<void> => {
  await ERDEAxios.post('/categories', productData)
}

export const useCreateCategory = (): UseMutationResult<
  void,
  Error,
  CategoryType
> => {
  return useMutation<void, Error, CategoryType>({
    mutationFn: createCategory,
    retry: false
  })
}

const editCategory = async (productData: CategoryType): Promise<void> => {
  await ERDEAxios.patch('/categories', productData)
}

export const useEditCategory = (): UseMutationResult<
  void,
  Error,
  CategoryType
> => {
  return useMutation<void, Error, CategoryType>({
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
