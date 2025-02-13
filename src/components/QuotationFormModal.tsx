import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateQuotation, useUpdateQuotation } from '../api/cotiza'
import { useCustomers } from '../api/clients'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

interface QuotationFormModalProps {
  visible: boolean
  onCancel: () => void
  onOk: (values: any) => void
  initialValues?: any
}

const QuotationFormModal: React.FC<QuotationFormModalProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const createQuotationMutation = useCreateQuotation()
  const updateQuotationMutation = useUpdateQuotation()
  const { data: customers, isLoading } = useCustomers()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: moment(initialValues.date, 'DD/MM/YYYY').isValid() ? moment(initialValues.date, 'DD/MM/YYYY') : null,
        customer: initialValues.customer._id
      })
    }
  }, [initialValues, form])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          date: values.date.format('DD/MM/YYYY')
        }
        if (initialValues && initialValues._id) {
          updateQuotationMutation.mutate({ ...formattedValues, id: initialValues._id }, {
            onSuccess: (data) => {
              onOk(data)
            }
          })
        } else {
          createQuotationMutation.mutate(formattedValues, {
            onSuccess: (data) => {
              onOk(data)
              form.resetFields()
              navigate(`/quotation/${data._id}`)
            }
          })
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title={t('quotationFormModal.title')}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={createQuotationMutation.isPending || updateQuotationMutation.isPending}
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Form layout="vertical" form={form} initialValues={initialValues}>
          <Form.Item
            label={t('quotationFormModal.titleLabel')}
            name="title"
            rules={[{ required: true, message: t('quotationFormModal.titleRequired') }]}
          >
            <Input placeholder={t('quotationFormModal.titlePlaceholder')} />
          </Form.Item>
          <Form.Item
            label={t('quotationFormModal.descriptionLabel')}
            name="description"
          >
            <Input.TextArea placeholder={t('quotationFormModal.descriptionPlaceholder')} />
          </Form.Item>
          <Form.Item
            label={t('quotationFormModal.numberLabel')}
            name="number"
          >
            <Input type="number" placeholder={t('quotationFormModal.numberPlaceholder')} />
          </Form.Item>
          <Form.Item
            label={t('quotationFormModal.dateLabel')}
            name="date"
            rules={[{ required: true, message: t('quotationFormModal.dateRequired') }]}
            style={{ width: '100%' }}
          >
            <DatePicker style={{ width: '100%' }} placeholder={t('quotationFormModal.datePlaceholder')} />
          </Form.Item>
          <Form.Item
            label={t('quotationFormModal.customerLabel')}
            name="customer"
            rules={[{ required: true, message: t('quotationFormModal.customerRequired') }]}
          >
            <Select
              showSearch
              placeholder={t('quotationFormModal.customerPlaceholder')}
              loading={isLoading}
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionText = option?.children ? `${option.children}` : ''
                return optionText.toLowerCase().includes(input.toLowerCase())
              }
              }
            >
              {customers?.map(customer => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default QuotationFormModal
