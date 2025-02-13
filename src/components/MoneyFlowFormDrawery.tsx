import React, { useState, useEffect } from 'react'
import { Drawer, Form, Input, Button, Select, Skeleton } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useCreateMoneyFlow, useUpdateMoneyFlow, useMoneyFlowCategories, useCreateMoneyFlowCategory } from '../api/moneyFlow'
import { useTranslation } from 'react-i18next'

interface MoneyFlowFormDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  quotationId: string
  initialValues?: any
}

const MoneyFlowFormDrawer: React.FC<MoneyFlowFormDrawerProps> = ({ visible, onClose, onSubmit, quotationId, initialValues }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const createMoneyFlowMutation = useCreateMoneyFlow()
  const updateMoneyFlowMutation = useUpdateMoneyFlow()
  const { data: categories, isLoading, refetch } = useMoneyFlowCategories()
  const createCategoryMutation = useCreateMoneyFlowCategory()
  const [newCategory, setNewCategory] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category._id // Asegurarnos de que se seleccione el ID de la categoría
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ amount: 0 })
    }
  }, [initialValues, form])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (initialValues && initialValues._id) {
          updateMoneyFlowMutation.mutate({ ...values, cotiza: quotationId, id: initialValues._id }, {
            onSuccess: (data) => {
              onSubmit(data)
              onClose()
            }
          })
        } else {
          createMoneyFlowMutation.mutate({ ...values, cotiza: quotationId }, {
            onSuccess: (data) => {
              onSubmit(data)
              onClose()
            }
          })
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCreateCategory = () => {
    if (newCategory) {
      createCategoryMutation.mutate({ name: newCategory }, {
        onSuccess: () => {
          setNewCategory(null)
          refetch()
          form.setFieldsValue({ category: '' })
        }
      })
    }
  }

  return (
    <Drawer
      title={t('moneyFlowForm.addMoneyFlow')}
      width={360}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {t('cancelButton')}
          </Button>
          <Button onClick={handleSubmit} type="primary" loading={createMoneyFlowMutation.isPending || updateMoneyFlowMutation.isPending}>
            {t('submit')}
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label={t('moneyFlowForm.titleLabel')}
            rules={[{ required: true, message: t('moneyFlowForm.titleRequired') }]}
          >
            <Input placeholder={t('moneyFlowForm.titlePlaceholder')} />
          </Form.Item>
          <Form.Item
            name="amount"
            label={t('moneyFlowForm.amountLabel')}
            rules={[{ required: true, message: t('moneyFlowForm.amountRequired') }]}
          >
            <Input type="number" placeholder={t('moneyFlowForm.amountPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('moneyFlowForm.typeLabel')}
            rules={[{ required: true, message: t('moneyFlowForm.typeRequired') }]}
          >
            <Select placeholder={t('moneyFlowForm.typePlaceholder')}>
              <Select.Option value="income">{t('moneyFlowForm.typeIncome')}</Select.Option>
              <Select.Option value="expense">{t('moneyFlowForm.typeExpense')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label={t('moneyFlowForm.categoryLabel')}
            rules={[{ required: true, message: t('moneyFlowForm.categoryRequired') }]}
          >
            <Select
              placeholder={t('moneyFlowForm.categoryPlaceholder')}
              dropdownRender={menu => (
                <>
                  {menu}
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8, gap: 8 }}>
                    <Input
                      style={{ flex: 'auto' }}
                      value={newCategory!}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder={t('moneyFlowForm.categoryNewPlaceholder')}
                    />
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={createCategoryMutation.isPending}
                      onClick={handleCreateCategory}
                    />

                  </div>
                </>
              )}
            >
              {categories?.map(category => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}

export default MoneyFlowFormDrawer
