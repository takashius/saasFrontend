import { useState, useEffect, useRef } from 'react'
import { Table, Button, Input, Popconfirm, message, List, Card } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AddClientModal from '../components/AddClientModal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useClients, useDeleteClient } from '../api/clients'
import { Client } from 'src/types'

const ClientList = () => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobilePage, setMobilePage] = useState(1)
  const [mobileData, setMobileData] = useState<Client[]>([])
  const loaderRef = useRef(null)
  const deleteClientMutation = useDeleteClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { data, isLoading, error, refetch, isSuccess } = useClients(currentPage, searchText)

  useEffect(() => {
    setCurrentPage(1)
    setMobilePage(1)
    setMobileData([])
    refetch()
  }, [searchText])

  useEffect(() => {
    refetch()
  }, [currentPage])

  useEffect(() => {
    if (isSuccess && data) {
      if (mobileData !== undefined && mobileData.length <= 0) {
        setMobileData(data?.results || [])
      } else {
        setMobileData((prevData) => [...prevData, ...(data?.results || [])])
      }
    }
  }, [isSuccess, data])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    } else {
      console.log('loaderRef.current no está definido')
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    };
  }, [mobilePage, isLoading])

  const columns = [
    {
      title: t('ClientList.title'),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: t('ClientList.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('ClientList.rif'),
      dataIndex: 'rif',
      key: 'rif'
    },
    {
      title: t('ClientList.phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (record: { _id: any }) => (
        <span>
          <Link to={`/client/${record._id}`}> <Button icon={<EditOutlined />} type='primary' /></Link>
          <Popconfirm
            title={t('ClientList.deleteConfirmTitle')}
            description={t('ClientList.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('home.confirmOkText')}
            cancelText={t('home.confirmCancelText')}
          >
            <Button
              icon={<DeleteOutlined />} className="ml-2"
              type='primary'
              loading={loadingId === record._id && deleteClientMutation.isPending}
            />
          </Popconfirm>
        </span>
      )
    }
  ]

  const handleDelete = (clientId: string) => {
    setLoadingId(clientId)
    deleteClientMutation.mutate(clientId, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Eliminado correctamente`,
        })
        refetch()
      },
      onSettled: () => {
        setLoadingId(null)
      }
    })
  }

  const handleCreate = () => {
    setModalVisible(false)
    refetch()
  }

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current)
  }

  const loadMoreData = () => {
    if (!isLoading && data?.results && data.results.length > 0) {
      const nextPage = currentPage + 1
      setMobilePage(nextPage)
      setCurrentPage(nextPage)
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <Input
          placeholder={t('ClientList.searchPlaceholder')}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className="w-full md:w-1/2 lg:w-1/3 mb-2 md:mb-0"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className={`w-full md:w-auto`}>
          {t('ClientList.addClient')}
        </Button>
      </div>
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={data?.results || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            total: data?.totalCustomers || 0,
            current: currentPage,
            pageSize: 20,
            showSizeChanger: false
          }}
          onChange={handleTableChange}
        />
      </div>
      <div className="block md:hidden">
        {mobileData.length > 0 &&
          <>
            <List
              dataSource={mobileData}
              renderItem={item => (
                <Card className="mb-2">
                  <p><strong>{t('home.title')}: </strong>{item.title}</p>
                  <p><strong>{t('register.name')}: </strong>{item.name} {item.lastname}</p>
                  <p><strong>{t('register.rif')}: </strong>{item.rif}</p>
                  <div className='mt-4'>
                    <Link to={`/client/${item._id}`}> <Button type='primary' icon={<EditOutlined />} /> </Link>
                    <Popconfirm
                      title={t('ClientList.deleteConfirmTitle')}
                      description={t('ClientList.deleteConfirmDescription')}
                      onConfirm={() => handleDelete(item._id)}
                      okText={t('home.confirmOkText')}
                      cancelText={t('home.confirmCancelText')}
                    >
                      <Button
                        icon={<DeleteOutlined />} className="ml-2"
                        type='primary'
                        loading={loadingId === item._id && deleteClientMutation.isPending}
                      />
                    </Popconfirm>
                  </div>
                </Card>
              )}
            />
          </>
        }
        <div ref={loaderRef} className="text-center mt-4">
          {isLoading && <Button loading></Button>}
        </div>
      </div>
      <AddClientModal visible={modalVisible} onCreate={handleCreate} onCancel={() => setModalVisible(false)} />
    </div>
  )
}

export default ClientList
