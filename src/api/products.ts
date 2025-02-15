import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { Product, ProductListResponse } from 'src/types'

const fetchSimpleProducts = async (): Promise<Product[]> => {
  const response = await ERDEAxios.get<Product[]>('/products/simple')
  return response.data
}

export const useProducts = (): UseQueryResult<Product[], Error> => {
  return useQuery<Product[], Error>({
    queryKey: ['products simple'],
    queryFn: fetchSimpleProducts,
    retry: false
  })
}

const fetchProducts = async (
  page: number,
  search: string
): Promise<ProductListResponse> => {
  const response = await ERDEAxios.get<ProductListResponse>(
    `/products/list/${page}/${search}`
  )
  return response.data
}

export const useProductList = (
  page: number,
  search: string
): UseQueryResult<ProductListResponse, Error> => {
  return useQuery<ProductListResponse, Error>({
    queryKey: ['productList', page, search],
    queryFn: () => fetchProducts(page, search),
    retry: false
  })
}

const createProduct = async (productData: Product): Promise<void> => {
  await ERDEAxios.post('/products', productData)
}

export const useCreateProduct = (): UseMutationResult<void, Error, Product> => {
  return useMutation<void, Error, Product>({
    mutationFn: createProduct,
    retry: false
  })
}

const editProduct = async (productData: Product): Promise<void> => {
  await ERDEAxios.patch('/products', productData)
}

export const useEditProduct = (): UseMutationResult<void, Error, Product> => {
  return useMutation<void, Error, Product>({
    mutationFn: editProduct,
    retry: false
  })
}

const deleteProduct = async (id: string) => {
  const response = await ERDEAxios.delete(`/products/${id}`)
  return response.data
}

export const useDeleteProduct = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: deleteProduct
  })
}
