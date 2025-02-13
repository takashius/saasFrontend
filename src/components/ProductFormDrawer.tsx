import React, { useEffect } from 'react'
import { Drawer, Form, Input, Button, Select, Switch, Skeleton } from 'antd'
import { useAddProductToQuotation, useUpdateProductInQuotation } from '../api/cotiza'
import { useProducts } from '../api/products'
import { useTranslation } from 'react-i18next'

interface ProductFormDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  quotationId: string
  initialValues?: any
}

const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({ visible, onClose, onSubmit, quotationId, initialValues }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const addProductMutation = useAddProductToQuotation()
  const updateProductMutation = useUpdateProductInQuotation()
  const { data: products, isLoading } = useProducts()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
      form.setFieldsValue({ amount: 1 })
    }
  }, [initialValues, form])

  const handleProductChange = (value: string) => {
    const selectedProduct = products?.find(product => product.id === value)
    if (selectedProduct) {
      form.setFieldsValue({
        price: selectedProduct.price,
        iva: selectedProduct.iva
      })
    }
  }

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (initialValues && initialValues._id) {
          updateProductMutation.mutate({ ...values, id: quotationId, idProduct: initialValues._id }, {
            onSuccess: (data) => {
              onSubmit(data)
              onClose()
            }
          })
        } else {
          addProductMutation.mutate({ ...values, id: quotationId }, {
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

  return (
    <Drawer
      title={t('productForm.addProductToQuotation')}
      width={360}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {t('cancelButton')}
          </Button>
          <Button onClick={handleSubmit} type="primary" loading={addProductMutation.isPending || updateProductMutation.isPending}>
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
            name="master"
            label={t('productForm.productLabel')}
            rules={[{ required: true, message: t('productForm.productRequired') }]}
          >
            <Select
              showSearch
              placeholder={t('productForm.productPlaceholder')}
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionText = option?.children ? `${option.children}` : ''
                return optionText.toLowerCase().includes(input.toLowerCase())
              }
              }
              onChange={handleProductChange}
            >
              {products?.map(product => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label={t('productForm.priceLabel')}
            rules={[{ required: true, message: t('productForm.priceRequired') }]}
          >
            <Input type="number" placeholder={t('productForm.pricePlaceholder')} />
          </Form.Item>
          <Form.Item
            name="amount"
            label={t('productForm.amountLabel')}
            rules={[{ required: true, message: t('productForm.amountRequired') }]}
          >
            <Input type="number" placeholder={t('productForm.amountPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="iva"
            label={t('productForm.tax')}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}

export default ProductFormDrawer
