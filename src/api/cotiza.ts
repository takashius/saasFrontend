import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult
} from '@tanstack/react-query'
import ERDEAxios from './ERDEAxios'
import { Quotation, QuotationDetail } from '../types'

export const useCotizaList = (): UseQueryResult<Quotation[], Error> => {
  return useQuery<Quotation[], Error>({
    queryKey: ['cotizaList'],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<Quotation[]>('/cotiza')
      return response.data as Quotation[]
    }
  })
}

export const useCotizaDetail = (
  id: string
): UseQueryResult<QuotationDetail, Error> => {
  return useQuery<QuotationDetail, Error>({
    queryKey: ['cotizaDetail', id],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<QuotationDetail>(`/cotiza/${id}`)
      return response.data as QuotationDetail
    }
  })
}

const downloadPDF = async ({
  id,
  number,
  type
}: {
  id: string
  number: string
  type: string
}) => {
  try {
    localStorage.setItem('responseType', 'blob')

    let endpoint = ''
    switch (type) {
      case 'factura':
        endpoint = `/cotiza/pdf/${id}`
        break
      case 'forma-libre':
        endpoint = `/cotiza/pdflibre/${id}`
        break
      case 'presupuesto':
        endpoint = `/cotiza/pdf/presupuesto/${id}`
        break
    }
    const response = await ERDEAxios.get(endpoint, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `cotiza_${number}_${type}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error descargando el PDF:', error)
  } finally {
    localStorage.removeItem('responseType')
  }
}

export const useDownloadPDF = (): UseMutationResult<
  void,
  Error,
  { id: string; number: string; type: string },
  unknown
> => {
  return useMutation<
    void,
    Error,
    { id: string; number: string; type: string },
    unknown
  >({
    mutationFn: downloadPDF
  })
}

const createQuotation = async (newQuotation: {
  title: string
  description: string
  number: number
  date: string
  customer: string
}) => {
  const response = await ERDEAxios.post('/cotiza', newQuotation)
  return response.data
}

export const useCreateQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  {
    title: string
    description: string
    number: number
    date: string
    customer: string
  },
  unknown
> => {
  return useMutation<
    QuotationDetail,
    Error,
    {
      title: string
      description: string
      number: number
      date: string
      customer: string
    },
    unknown
  >({
    mutationFn: createQuotation
  })
}

const updateQuotation = async (updatedQuotation: {
  id: string
  title: string
  description: string
  number: number
  date: string
  customer: string
}) => {
  const response = await ERDEAxios.patch(`/cotiza`, updatedQuotation)
  return response.data
}

export const useUpdateQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  {
    id: string
    title: string
    description: string
    number: number
    date: string
    customer: string
  },
  unknown
> => {
  return useMutation<
    QuotationDetail,
    Error,
    {
      id: string
      title: string
      description: string
      number: number
      date: string
      customer: string
    },
    unknown
  >({
    mutationFn: updateQuotation
  })
}

const addProductToQuotation = async (productDetails: {
  id: string
  master: string
  price: number
  amount: number
}) => {
  const response = await ERDEAxios.post('/cotiza/product', productDetails)
  return response.data
}

export const useAddProductToQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  { id: string; master: string; price: number; amount: number },
  unknown
> => {
  return useMutation<
    QuotationDetail,
    Error,
    { id: string; master: string; price: number; amount: number },
    unknown
  >({
    mutationFn: addProductToQuotation
  })
}

const updateProductInQuotation = async (productDetails: {
  idProduct: string
  price: number
  amount: number
  iva: boolean
  id: string
}) => {
  const response = await ERDEAxios.patch('/cotiza/product', productDetails)
  return response.data
}

export const useUpdateProductInQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  {
    idProduct: string
    price: number
    amount: number
    iva: boolean
    id: string
  },
  unknown
> => {
  return useMutation<
    QuotationDetail,
    Error,
    {
      idProduct: string
      price: number
      amount: number
      iva: boolean
      id: string
    },
    unknown
  >({
    mutationFn: updateProductInQuotation
  })
}

const deleteProductFromQuotation = async (productDetails: {
  id: string
  idParent: string
}) => {
  const response = await ERDEAxios.delete('/cotiza/product', {
    data: productDetails
  })
  return response.data
}

export const useDeleteProductFromQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  { id: string; idParent: string },
  unknown
> => {
  return useMutation<
    QuotationDetail,
    Error,
    { id: string; idParent: string },
    unknown
  >({
    mutationFn: deleteProductFromQuotation
  })
}

const updateRate = async (rateDetails: { id: string }) => {
  const response = await ERDEAxios.patch('/cotiza/updateRate', rateDetails)
  return response.data
}

export const useUpdateRate = (): UseMutationResult<
  QuotationDetail,
  Error,
  { id: string },
  unknown
> => {
  return useMutation<QuotationDetail, Error, { id: string }, unknown>({
    mutationFn: updateRate
  })
}

const sendQuotationByEmail = async (id: string) => {
  const response = await ERDEAxios.get(`/cotiza/send/${id}`)
  return response.data
}

export const useSendQuotationByEmail = (): UseMutationResult<
  QuotationDetail,
  Error,
  string,
  unknown
> => {
  return useMutation<QuotationDetail, Error, string, unknown>({
    mutationFn: sendQuotationByEmail
  })
}

const deleteQuotation = async (id: string) => {
  const response = await ERDEAxios.delete(`/cotiza/${id}`)
  return response.data
}

export const useDeleteQuotation = (): UseMutationResult<
  QuotationDetail,
  Error,
  string,
  unknown
> => {
  return useMutation<QuotationDetail, Error, string, unknown>({
    mutationFn: deleteQuotation
  })
}
