import React, { useState } from 'react'
import { Card, Table, Button, Descriptions, Skeleton, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useClientDetail, useDeleteAddress } from '../api/clients'
import AddClientModal from '../components/AddClientModal'
import AddAddressDrawer from '../components/AddAddressDrawer'

const ClientDetail: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: client, isLoading, error, refetch } = useClientDetail(id!)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addressDrawerVisible, setAddressDrawerVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [isAddressEdit, setIsAddressEdit] = useState<boolean>(false)
  const deleteAddressMutation = useDeleteAddress()
  const [messageApi, contextHolder] = message.useMessage()

  const columns = [
    {
      title: t('ClientDetail.addressTitle'),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: t('ClientDetail.city'),
      dataIndex: 'city',
      key: 'city'
    },
    {
      title: t('ClientDetail.line1'),
      dataIndex: 'line1',
      key: 'line1'
    },
    {
      title: t('ClientDetail.zip'),
      dataIndex: 'zip',
      key: 'zip'
    },
    {
      title: t('ClientDetail.default'),
      dataIndex: 'default',
      key: 'default',
      render: (defaultAddr: boolean) => (defaultAddr ? t('ClientDetail.yes') : t('ClientDetail.no'))
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (record: any) => (
        <Button.Group>
          <Button icon={<EditOutlined />} onClick={() => handleEditAddress(record)} type='primary' />
          <Popconfirm
            title={t('ClientDetail.deleteConfirmTitle')}
            description={t('ClientDetail.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('quotationDetails.confirmOkText')}
            cancelText={t('quotationDetails.confirmCancelText')}
          >
            <Button icon={<DeleteOutlined />}
              className="ml-2"
              type='primary'
              loading={deleteAddressMutation.isPending && deleteAddressMutation.variables?.id === record._id} />
          </Popconfirm>
        </Button.Group>
      )
    }
  ]

  const handleEdit = (record: any) => {
    setEditingClient(record)
    setEditModalVisible(true)
  }

  const handleEditAddress = (record: any) => {
    setIsAddressEdit(true)
    setEditingAddress(record)
    setAddressDrawerVisible(true)
  }

  const handleDelete = (addressId: string) => {
    deleteAddressMutation.mutate({ idParent: id!, id: addressId }, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Direccion Borrada correctamente`,
        })
        refetch()
      }
    })
  }

  const handleUpdate = () => {
    messageApi.open({
      type: 'success',
      content: `Cliente actualizado correctamente`,
    })
    refetch()
    setEditModalVisible(false)
  }

  const showDrawer = () => {
    setIsAddressEdit(false)
    setEditingAddress(null)
    setAddressDrawerVisible(true)
  }

  const handleDrawerClose = () => {
    setAddressDrawerVisible(false)
  }

  const handleAddressCreate = () => {
    messageApi.open({
      type: 'success',
      content: `Direccion actualizada correctamente`,
    })
    refetch()
    setAddressDrawerVisible(false)
  }

  if (isLoading) {
    return (
      <div className="md:p-4">
        <Card className="mb-4">
          <Skeleton active title={false} paragraph={{ rows: 7 }} />
        </Card>
        <Card>
          <Skeleton active title={false} paragraph={{ rows: 8 }} />
        </Card>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!client) {
    return <div>No data found</div>
  }

  return (
    <div className="p-4">
      {contextHolder}
      <Card
        title={
          <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center md:gap-x-4">
            <span>{`${client.title}`}</span>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(client)}
            >
              {t('ClientDetail.edit')}
            </Button>
          </div>
        }
        bordered={false}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('ClientDetail.name')}>{client.name} {client.lastname}</Descriptions.Item>
          <Descriptions.Item label={t('ClientDetail.email')}>{client.email}</Descriptions.Item>
          <Descriptions.Item label={t('ClientDetail.rif')}>{client.rif}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title={
          <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center md:gap-x-4">
            <span>{t('ClientDetail.addressesTitle')}</span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showDrawer}
            >
              {t('ClientDetail.addAddressButton')}
            </Button>
          </div>
        }
        bordered={false}
        className="mt-4"
      >
        <Table columns={columns} dataSource={client.addresses} rowKey="_id" scroll={{ x: '100%' }} className="overflow-x-auto" />
      </Card>
      <AddClientModal
        visible={editModalVisible}
        onCreate={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
        isEdit={true}
        initialValues={editingClient}
      />
      <AddAddressDrawer
        visible={addressDrawerVisible}
        onClose={handleDrawerClose}
        onCreate={handleAddressCreate}
        clientId={id!}
        isEdit={isAddressEdit}
        initialValues={editingAddress}
      />
    </div>
  )
}

export default ClientDetail
