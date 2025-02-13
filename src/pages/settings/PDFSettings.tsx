import React, { useEffect, useState } from 'react'
import { Card, Form, InputNumber, Button, Upload, Row, Col, Skeleton, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useGetCompany, useSetConfig } from '../../api/company'
import { useAuth } from '../../context/AuthContext'
import { useUploadImage } from '../../api/auth'

const PDFSettings: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [watermark, setWatermark] = useState<string | null>(null)
  const { getUser } = useAuth()
  const user: any = getUser()
  const { data: config, isLoading, refetch } = useGetCompany(true)
  const configMutation = useSetConfig()
  const uploadImageMutation = useUploadImage()

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        logoWidth: config.configPdf?.logo.width,
        logoXPosition: config.configPdf?.logo.x,
        logoYPosition: config.configPdf?.logo.y,
        watermarkWidth: config.configPdf?.logoAlpha.width,
        watermarkXPosition: config.configPdf?.logoAlpha.x,
        watermarkYPosition: config.configPdf?.logoAlpha.y,
        logoAlpha: config.logo
      })
      setWatermark(config.logoAlpha)
    }
  }, [config, form])

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        const data = {
          id: user.company,
          pdf: {
            logo: {
              width: values.logoWidth,
              x: values.logoXPosition,
              y: values.logoYPosition
            },
            logoAlpha: {
              width: values.watermarkWidth,
              x: values.watermarkXPosition,
              y: values.watermarkYPosition
            }
          }
        }
        configMutation.mutate(data, {
          onSuccess: () => {
            message.success(t('saveSuccess'))
          },
          onError: () => {
            message.error(t('saveError'))
          }
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const handleWatermarkChange = (info: any) => {
    uploadImageMutation.mutate({
      image: info.file,
      imageType: 'logoAlpha'
    })
  }

  useEffect(() => {
    if (uploadImageMutation.isSuccess) {
      refetch()
    }
  }, [uploadImageMutation.isSuccess])

  if (isLoading) {
    return (
      <div className="md:p-4">
        <Card className="mb-4">
          <Skeleton active title={false} paragraph={{ rows: 16 }} />
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Form
        form={form}
        layout="vertical"
        name="pdf_settings"
        onFinish={handleSave}
      >
        <Card title={t('PDFSettings.logoTitle')} bordered={false} className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="logoWidth"
                label={t('PDFSettings.width')}
                rules={[{ required: true, message: t('PDFSettings.validationWidth') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="logoXPosition"
                label={t('PDFSettings.xPosition')}
                rules={[{ required: true, message: t('PDFSettings.validationXPosition') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="logoYPosition"
                label={t('PDFSettings.yPosition')}
                rules={[{ required: true, message: t('PDFSettings.validationYPosition') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('PDFSettings.watermarkTitle')} bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="watermarkWidth"
                label={t('PDFSettings.width')}
                rules={[{ required: true, message: t('PDFSettings.validationWidth') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="watermarkXPosition"
                label={t('PDFSettings.xPosition')}
                rules={[{ required: true, message: t('PDFSettings.validationXPosition') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="watermarkYPosition"
                label={t('PDFSettings.yPosition')}
                rules={[{ required: true, message: t('PDFSettings.validationYPosition') }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="watermarkLogo"
            label={t('PDFSettings.logo')}
          >
            <Upload
              name="logo"
              listType="picture"
              className="upload-list-inline"
              showUploadList={false}
              beforeUpload={() => { return false }}
              onChange={handleWatermarkChange}
            >
              <Button icon={<UploadOutlined />} loading={uploadImageMutation.isPending}>{t('PDFSettings.uploadButton')}</Button>
            </Upload>
            {watermark && <img src={watermark} alt="watermark" style={{ marginTop: '10px', maxWidth: '200px' }} />}
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: '10px' }}>
            <Button type="primary" htmlType="submit" loading={configMutation.isPending} >
              {t('PDFSettings.saveButton')}
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}

export default PDFSettings
