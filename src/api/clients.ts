import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import {
  AddressForm,
  Client,
  ClientForm,
  ClientListResponse,
  EditClientForm
} from '../types'

interface Customer {
  id: string
  title: string
}

const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await ERDEAxios.get<Customer[]>('/customer/simple')
  return response.data
}

export const useCustomers = (): UseQueryResult<Customer[], Error> => {
  return useQuery<Customer[], Error>({
    queryKey: ['customerSimple'],
    queryFn: fetchCustomers,
    retry: false
  })
}

const fetchClients = async (
  page: number,
  search: string
): Promise<ClientListResponse> => {
  const response = await ERDEAxios.get<ClientListResponse>(
    `/customer/list/${page}/${search}`
  )
  return response.data
}

export const useClients = (
  page: number,
  search: string
): UseQueryResult<ClientListResponse, Error> => {
  return useQuery<ClientListResponse, Error>({
    queryKey: ['clientList', page, search],
    queryFn: () => fetchClients(page, search),
    retry: false
  })
}

const createClient = async (clientData: ClientForm): Promise<void> => {
  await ERDEAxios.post('/customer', clientData)
}

export const useCreateClient = (): UseMutationResult<
  void,
  Error,
  ClientForm
> => {
  return useMutation<void, Error, ClientForm>({
    mutationFn: createClient,
    retry: false
  })
}

const deleteClient = async (id: string) => {
  const response = await ERDEAxios.delete(`/customer/${id}`)
  return response.data
}

export const useDeleteClient = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: deleteClient
  })
}

const fetchClientDetail = async (id: string): Promise<Client> => {
  const response = await ERDEAxios.get<Client>(`/customer/${id}`)
  return response.data
}

export const useClientDetail = (id: string): UseQueryResult<Client, Error> => {
  return useQuery<Client, Error>({
    queryKey: ['clientDetail', id],
    queryFn: () => fetchClientDetail(id),
    retry: false
  })
}

const editClient = async (clientData: EditClientForm): Promise<void> => {
  await ERDEAxios.patch('/customer', clientData)
}

export const useEditClient = (): UseMutationResult<
  void,
  Error,
  EditClientForm
> => {
  return useMutation<void, Error, EditClientForm>({
    mutationFn: editClient,
    retry: false
  })
}

const addAddress = async (addressData: AddressForm): Promise<void> => {
  await ERDEAxios.post('/customer/address', addressData)
}

export const useAddAddress = (): UseMutationResult<
  void,
  Error,
  AddressForm
> => {
  return useMutation<void, Error, AddressForm>({
    mutationFn: addAddress,
    retry: false
  })
}

const editAddress = async (addressData: AddressForm): Promise<void> => {
  await ERDEAxios.patch('/customer/address', addressData)
}

export const useEditAddress = (): UseMutationResult<
  void,
  Error,
  AddressForm
> => {
  return useMutation<void, Error, AddressForm>({
    mutationFn: editAddress,
    retry: false
  })
}

const deleteAddress = async (data: { id: string; idParent: string }) => {
  const response = await ERDEAxios.delete(`/customer/address`, {
    data: data
  })
  return response.data
}

export const useDeleteAddress = (): UseMutationResult<
  void,
  Error,
  { id: string; idParent: string }
> => {
  return useMutation<void, Error, { id: string; idParent: string }>({
    mutationFn: deleteAddress
  })
}
