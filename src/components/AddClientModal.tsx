import React, { useEffect } from 'react'
import { Modal, Form, Input, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateClient, useEditClient } from '../api/clients'
import { ClientForm } from '../types'

interface AddClientModalProps {
  visible: boolean
  onCreate: (values: any) => void
  onCancel: () => void
  isEdit?: boolean
  initialValues?: any
}

const AddClientModal: React.FC<AddClientModalProps> = ({ visible, onCreate, onCancel, isEdit = false, initialValues }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate: createClient, isPending: isCreating } = useCreateClient()
  const { mutate: editClient, isPending: isEditing } = useEditClient()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        address1: initialValues.address?.line1,
        address2: initialValues.address?.line2,
        city: initialValues.address?.city,
        postalCode: initialValues.address?.zip
      })
    }
  }, [initialValues, form])

  const handleCreate = (values: any) => {
    const clientData: ClientForm = {
      ...values,
      address: {
        title: 'Default',
        city: values.city,
        line1: values.address1,
        line2: values.address2,
        zip: values.postalCode,
      },
    }
    createClient(clientData, {
      onSuccess: () => {
        form.resetFields()
        onCreate(values)
        onCancel()
      },
      onError: (error) => {
        console.error('Error creating client:', error)
      },
    })
  }

  const handleEdit = (values: any) => {
    const clientData = {
      id: initialValues._id,
      ...values
    }
    editClient(clientData, {
      onSuccess: () => {
        form.resetFields()
        onCreate(values)
        onCancel()
      },
      onError: (error) => {
        console.error('Error editing client:', error)
      },
    })
  }

  return (
    <Modal
      visible={visible}
      title={isEdit ? t('AddClientModal.editClient') : t('AddClientModal.addClient')}
      okText={isEdit ? t('AddClientModal.update') : t('AddClientModal.create')}
      cancelText={t('AddClientModal.cancel')}
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
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label={t('AddClientModal.title')}
              rules={[{ required: true, message: t('AddClientModal.validationTitle') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label={t('AddClientModal.email')}
              rules={[{ required: true, message: t('AddClientModal.validationEmail') }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t('AddClientModal.name')}
              rules={[{ required: true, message: t('AddClientModal.validationName') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastname"
              label={t('AddClientModal.lastname')}
              rules={[{ required: true, message: t('AddClientModal.validationLastname') }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rif"
              label={t('AddClientModal.rif')}
              rules={[{ required: true, message: t('AddClientModal.validationRif') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={t('AddClientModal.phone')}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {!isEdit && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="address1"
                  label={t('AddClientModal.address1')}
                  rules={[{ required: true, message: t('AddClientModal.validationAddress1') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address2"
                  label={t('AddClientModal.address2')}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label={t('AddClientModal.city')}
                  rules={[{ required: true, message: t('AddClientModal.validationCity') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="postalCode"
                  label={t('AddClientModal.postalCode')}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default AddClientModal
