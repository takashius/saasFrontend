import React, { useEffect } from 'react'
import { Modal, Form, Input, Switch, message, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateProduct, useEditProduct } from '../../api/products'
import { useCategories } from '../../api/category'
import { Product } from '../../types'

interface AddProductModalProps {
  visible: boolean
  onCreate: (values: any) => void
  onEdit: (values: any) => void
  onCancel: () => void
  isEdit?: boolean
  initialValues?: Product
}

const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onCreate, onEdit, onCancel, isEdit = false, initialValues }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: editProduct, isPending: isEditing } = useEditProduct()
  const { data: categories, isLoading } = useCategories()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category._id
      })
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleCreate = (values: any) => {
    createProduct(values, {
      onSuccess: () => {
        onCreate(values)
        onCancel()
        form.resetFields()
      },
      onError: (error: any) => {
        message.error(`${error}`)
      },
    })
  }

  const handleEdit = (values: any) => {
    const productData = {
      ...values,
      _id: initialValues?._id,
    }
    editProduct(productData, {
      onSuccess: () => {
        onEdit(values)
        onCancel()
        form.resetFields()
      },
      onError: (error: any) => {
        message.error(`${error}`)
      },
    })
  }

  return (
    <Modal
      visible={visible}
      title={isEdit ? t('AddProductModal.editProduct') : t('AddProductModal.addProduct')}
      okText={isEdit ? t('update') : t('create')}
      cancelText={t('cancel')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            isEdit ? handleEdit(values) : handleCreate(values)
          })
          .catch(info => {
            console.log('Validation failed:', info)
          })
      }}
      confirmLoading={isEdit ? isEditing : isCreating}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="name"
          label={t('AddProductModal.name')}
          rules={[{ required: true, message: t('AddProductModal.validationName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('AddProductModal.description')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label={t('AddProductModal.price')}
          rules={[{ required: true, message: t('AddProductModal.validationPrice') }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label={t('AddProductModal.categoryLabel')}
          name="category"
          rules={[{ required: true, message: t('AddProductModal.categoryRequired') }]}
        >
          <Select
            showSearch
            placeholder={t('AddProductModal.categoryPlaceholder')}
            loading={isLoading}
            optionFilterProp="children"
            filterOption={(input, option) => {
              const optionText = option?.children ? `${option.children}` : ''
              return optionText.toLowerCase().includes(input.toLowerCase())
            }
            }
          >
            {categories?.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="iva"
          label={t('AddProductModal.iva')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddProductModal
