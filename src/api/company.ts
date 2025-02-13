import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { Company } from 'src/types'

const fetchConfig = async (): Promise<Company> => {
  const response = await ERDEAxios.get<Company>(`/company/myCompany`)
  return response.data
}

export const useGetCompany = (
  retry: boolean
): UseQueryResult<Company, Error> => {
  return useQuery<Company, Error>({
    queryKey: ['myCompany'],
    retry,
    queryFn: () => fetchConfig()
  })
}

export const useSetConfig = (): UseMutationResult<Company, Error, Company> => {
  const mutation = useMutation<Company, Error, Company>({
    mutationFn: (data: Company) => {
      return ERDEAxios.patch('/company/config', data)
    }
  })

  return mutation
}
