import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { Simple } from 'src/types'
import { UserListResponse, UserForm, userDetail, Role } from 'src/types/users'

const fetchSimpleUsers = async (): Promise<Simple[]> => {
  const response = await ERDEAxios.get<Simple[]>('/user/simple')
  return response.data
}

export const useProducts = (): UseQueryResult<Simple[], Error> => {
  return useQuery<Simple[], Error>({
    queryKey: ['user simple'],
    queryFn: fetchSimpleUsers,
    retry: false
  })
}

const fetchUsers = async (
  page: number,
  search: string
): Promise<UserListResponse> => {
  const response = await ERDEAxios.get<UserListResponse>(
    `/user/list/${page}/${search}`
  )
  return response.data
}

export const useUserList = (
  page: number,
  search: string
): UseQueryResult<UserListResponse, Error> => {
  return useQuery<UserListResponse, Error>({
    queryKey: ['userList', page, search],
    queryFn: () => fetchUsers(page, search),
    retry: false
  })
}

const createUser = async (data: UserForm): Promise<void> => {
  await ERDEAxios.post('/products', data)
}

export const useCreateUser = (): UseMutationResult<void, Error, UserForm> => {
  return useMutation<void, Error, UserForm>({
    mutationFn: createUser,
    retry: false
  })
}

const editUser = async (data: UserForm): Promise<void> => {
  await ERDEAxios.patch('/user', data)
}

export const useEditUser = (): UseMutationResult<void, Error, UserForm> => {
  return useMutation<void, Error, UserForm>({
    mutationFn: editUser,
    retry: false
  })
}

const deleteUser = async (id: string) => {
  const response = await ERDEAxios.delete(`/user/${id}`)
  return response.data
}

export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: deleteUser
  })
}

export const useUserDetail = (
  id: string
): UseQueryResult<userDetail, Error> => {
  return useQuery<userDetail, Error>({
    queryKey: ['cotizaDetail', id],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<userDetail>(`/user/${id}`)
      return response.data as userDetail
    }
  })
}

const fetchRoles = async (): Promise<Role[]> => {
  const response = await ERDEAxios.get<Role[]>('/user/roles')
  return response.data
}

export const useRoles = (): UseQueryResult<Role[], Error> => {
  return useQuery<Role[], Error>({
    queryKey: ['roles list'],
    queryFn: fetchRoles,
    retry: false
  })
}
