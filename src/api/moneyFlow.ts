import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import {
  MoneyFlow,
  MoneyFlowCategory,
  NewMoneyFlow,
  UpdateMoneyFlow
} from '../types'

export const useMoneyFlowByCotiza = (
  idCotiza: string
): UseQueryResult<MoneyFlow[], Error> => {
  return useQuery<MoneyFlow[], Error>({
    queryKey: ['moneyFlowList', idCotiza],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<MoneyFlow[]>(
        `/moneyFlow/cotiza/${idCotiza}`
      )
      return response.data as MoneyFlow[]
    }
  })
}

export const useMoneyFlowCategories = (): UseQueryResult<
  MoneyFlowCategory[],
  Error
> => {
  return useQuery<MoneyFlowCategory[], Error>({
    queryKey: ['moneyFlowCategories'],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<MoneyFlowCategory[]>(
        `/moneyFlow/categories`
      )
      return response.data as MoneyFlowCategory[]
    }
  })
}

export const useCreateMoneyFlowCategory = (): UseMutationResult<
  MoneyFlowCategory,
  Error,
  { name: string }
> => {
  return useMutation<MoneyFlowCategory, Error, { name: string }>({
    mutationFn: async ({ name }) => {
      const response = await ERDEAxios.post<MoneyFlowCategory>(
        '/moneyFlow/category',
        { name }
      )
      return response.data as MoneyFlowCategory
    }
  })
}

export const useCreateMoneyFlow = (): UseMutationResult<
  MoneyFlow,
  Error,
  NewMoneyFlow
> => {
  return useMutation<MoneyFlow, Error, NewMoneyFlow>({
    mutationFn: async (newMoneyFlow: NewMoneyFlow) => {
      const response = await ERDEAxios.post<MoneyFlow>(
        '/moneyFlow',
        newMoneyFlow
      )
      return response.data as MoneyFlow
    }
  })
}

export const useUpdateMoneyFlow = (): UseMutationResult<
  MoneyFlow,
  Error,
  UpdateMoneyFlow
> => {
  return useMutation<MoneyFlow, Error, UpdateMoneyFlow>({
    mutationFn: async (updateMoneyFlow: UpdateMoneyFlow) => {
      const response = await ERDEAxios.patch<MoneyFlow>(
        '/moneyFlow',
        updateMoneyFlow
      )
      return response.data as MoneyFlow
    }
  })
}

export const useDeleteMoneyFlow = (): UseMutationResult<
  void,
  Error,
  string
> => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await ERDEAxios.delete(`/moneyFlow/${id}`)
    }
  })
}
