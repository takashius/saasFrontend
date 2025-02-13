import React, { useEffect } from 'react'
import { Drawer, Button, Form, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAddAddress, useEditAddress } from '../api/clients'
import { AddressForm } from '../types'

interface AddAddressDrawerProps {
  visible: boolean
  onClose: () => void
  onCreate: (values: any) => void
  clientId: string
  isEdit?: boolean
  initialValues?: AddressForm
}

const AddAddressDrawer: React.FC<AddAddressDrawerProps> = ({ visible, onClose, onCreate, clientId, isEdit = false, initialValues }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate: addAddress, isPending: isAdding } = useAddAddress()
  const { mutate: editAddress, isPending: isEditing } = useEditAddress()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleCreate = (values: any) => {
    const addressData: AddressForm = {
      ...values,
      id: clientId,
      title: 'Default',
    }
    addAddress(addressData, {
      onSuccess: () => {
        onCreate(values)
        onClose()
      },
      onError: (error) => {
        console.error('Error creating address:', error)
      },
    })
  }

  const handleEdit = (values: any) => {
    const addressData: AddressForm = {
      ...values,
      id: clientId,
      idAddress: initialValues?._id,
    }
    editAddress(addressData, {
      onSuccess: () => {
        onCreate(values)
        onClose()
      },
      onError: (error) => {
        console.error('Error editing address:', error)
      },
    })
  }

  return (
    <Drawer
      title={isEdit ? t('AddAddressDrawer.editTitle') : t('AddAddressDrawer.title')}
      width={360}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {t('AddAddressDrawer.cancel')}
          </Button>
          <Button
            onClick={() => {
              form
                .validateFields()
                .then(values => {
                  isEdit ? handleEdit(values) : handleCreate(values)
                })
                .catch(info => {
                  console.log('Validation failed:', info)
                })
            }}
            type="primary"
            loading={isEdit ? isEditing : isAdding}
          >
            {t('submit')}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_drawer"
      >
        <Form.Item
          name="title"
          label={t('AddAddressDrawer.title')}
          rules={[{ required: true, message: t('AddAddressDrawer.validationTitle') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label={t('AddAddressDrawer.city')}
          rules={[{ required: true, message: t('AddAddressDrawer.validationCity') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="line1"
          label={t('AddAddressDrawer.address1')}
          rules={[{ required: true, message: t('AddAddressDrawer.validationAddress1') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="line2"
          label={t('AddAddressDrawer.address2')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="zip"
          label={t('AddAddressDrawer.postalCode')}
          rules={[{ required: true, message: t('AddAddressDrawer.validationPostalCode') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="default"
          label={t('AddAddressDrawer.default')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddAddressDrawer
