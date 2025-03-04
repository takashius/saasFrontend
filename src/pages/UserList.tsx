import { useState, useEffect, useRef } from 'react'
import { Table, Button, Input, Popconfirm, message, List, Card } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AddCategoryModal from '../components/modals/AddCategoryModal'
import { useTranslation } from 'react-i18next'
import { useDeleteUser, useUserList } from '../api/users'
import { userBase } from '../types/users'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UserList = () => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobilePage, setMobilePage] = useState(1)
  const [mobileData, setMobileData] = useState<userBase[]>([])
  const loaderRef = useRef(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [initialValues, setInitialValues] = useState<any>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { data, isLoading, isSuccess, error, refetch } = useUserList(currentPage, searchText)
  const deleteUserMutation = useDeleteUser()
  const { hasRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasRole(["PROV_ADMIN", "ROLE_USER_LIST"])) {
      navigate('/')
    }
  }, [])

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
      title: t('register.name'),
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: t('register.email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('GeneralSettings.phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: t('ProductList.actions'),
      key: 'actions',
      render: (record: any) => (
        <Button.Group>
          {hasRole(["PROV_ADMIN", "ROLE_USER_EDIT"]) && (
            <Link to={`/users/${record._id}`}> <Button icon={<EditOutlined />} type='primary' /> </Link>
          )}
          {hasRole(["PROV_ADMIN", "ROLE_USER_DELETE"]) && (
            <Popconfirm
              title={t('Category.deleteConfirmTitle')}
              description={t('Category.deleteConfirmDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('confirmOkText')}
              cancelText={t('confirmCancelText')}
            >
              <Button
                icon={<DeleteOutlined />} className="ml-2"
                type='primary'
                loading={loadingId === record._id && deleteUserMutation.isPending}
              />
            </Popconfirm>
          )}
        </Button.Group>
      )
    }
  ]

  const handleEdit = (record: any) => {
    setIsEdit(true)
    setInitialValues(record)
    setModalVisible(true)
  }

  const handleDelete = (productId: string) => {
    setLoadingId(productId)
    deleteUserMutation.mutate(productId, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: t("deleteSuccess"),
        })
        refetch()
      },
      onSettled: () => {
        setLoadingId(null)
      }
    })
  }

  const handleCreate = () => {
    messageApi.open({
      type: 'success',
      content: t("Category.createSuccess"),
    })
    setModalVisible(false)
    refetch()
  }

  const handleEditSuccess = () => {
    messageApi.open({
      type: 'success',
      content: t("Category.updateSuccess"),
    })
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
          placeholder={t('Category.searchPlaceholder')}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className="w-full md:w-1/2 lg:w-1/3 mb-2 md:mb-0"
        />
        {hasRole(["PROV_ADMIN", "ROLE_USER_CREATE"]) && (
          <Button type="primary" icon={<PlusOutlined />} className={`w-full md:w-auto`} onClick={() => {
            setModalVisible(true);
            setIsEdit(false);
            setInitialValues(null)
          }}>
            {t('Category.addButton')}
          </Button>
        )}
      </div>
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={data?.results || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            total: data?.totalUSers || 0,
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
                  <p><strong>{t('register.name')}: </strong>{item.fullName}</p>
                  {(item.phone != undefined && item.phone) &&
                    <p><strong>{t('register.phone')}: </strong>{item.phone}</p>
                  }
                  <div className='mt-4'>
                    {hasRole(["PROV_ADMIN", "ROLE_USER_EDIT"]) && (
                      <Button icon={<EditOutlined />} type='primary' onClick={() => handleEdit(item)} />
                    )}
                    {hasRole(["PROV_ADMIN", "ROLE_USER_DELETE"]) && (
                      <Popconfirm
                        title={t('Category.deleteConfirmTitle')}
                        description={t('Category.deleteConfirmDescription')}
                        onConfirm={() => handleDelete(item._id!)}
                        okText={t('home.confirmOkText')}
                        cancelText={t('home.confirmCancelText')}
                      >
                        <Button
                          icon={<DeleteOutlined />} className="ml-2"
                          type='primary'
                          loading={loadingId === item._id && deleteUserMutation.isPending}
                        />
                      </Popconfirm>
                    )}
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
      <AddCategoryModal
        visible={modalVisible}
        onCreate={handleCreate}
        onEdit={handleEditSuccess}
        onCancel={() => setModalVisible(false)}
        isEdit={isEdit}
        initialValues={initialValues}
      />
    </div>
  )
}

export default UserList
