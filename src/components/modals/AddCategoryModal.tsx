import React, { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateCategory, useEditCategory } from '../../api/category'
import { CategoryType } from 'src/types/category'

interface AddCategoryModalProps {
  visible: boolean
  onCreate: (values: any) => void
  onEdit: (values: any) => void
  onCancel: () => void
  isEdit?: boolean
  initialValues?: CategoryType
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onCreate, onEdit, onCancel, isEdit = false, initialValues }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: editCategory, isPending: isEditing } = useEditCategory()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleCreate = (values: any) => {
    createCategory(values, {
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
    const categoryData = {
      ...values,
      _id: initialValues?._id,
    }
    editCategory(categoryData, {
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
      title={isEdit ? t('Category.editCategory') : t('Category.addButton')}
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
      </Form>
    </Modal>
  )
}

export default AddCategoryModal
