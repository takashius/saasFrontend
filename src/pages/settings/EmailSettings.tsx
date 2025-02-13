import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Upload, Tooltip, Row, Col, Skeleton, message } from 'antd'
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { ChromePicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import { useGetCompany, useSetConfig } from '../../api/company'
import { useUploadImage } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'

const EmailSettings: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [banner, setBanner] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [primaryColor, setPrimaryColor] = useState<string>('#000000')
  const [secondaryColor, setSecondaryColor] = useState<string>('#000000')
  const [titleColor, setTitleColor] = useState<string>('#000000')
  const { data: config, isLoading, refetch } = useGetCompany(true)
  const configMutation = useSetConfig()
  const uploadImageMutation = useUploadImage()
  const { getUser } = useAuth()
  const user: any = getUser()

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        backgroundColor: config.configMail?.colors.background,
        primaryColor: config.configMail?.colors.primary,
        secondaryColor: config.configMail?.colors.secundary,
        titleColor: config.configMail?.colors.title,
        messageBody: config.configMail?.textBody,

        banner: config.banner
      })
      setBanner(config.banner!)
      setBackgroundColor(config.configMail?.colors.background!)
      setPrimaryColor(config.configMail?.colors.primary!)
      setSecondaryColor(config.configMail?.colors.secundary!)
      setTitleColor(config.configMail?.colors.title!)
    }
  }, [config, form])

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        const data = {
          id: user.company,
          configMail: {
            colors: {
              primary: primaryColor,
              secundary: secondaryColor,
              background: backgroundColor,
              title: titleColor,
            },
            textBody: values.messageBody
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

  const handleBannerChange = (info: any) => {
    uploadImageMutation.mutate({
      image: info.file,
      imageType: 'banner'
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
        name="email_settings"
        onFinish={handleSave}
      >
        <Card title={t('EmailSettings.bannerTitle')} bordered={false} className="mb-4">
          <Form.Item
            name="banner"
            label={t('EmailSettings.banner')}
          >
            <Upload
              name="banner"
              listType="picture"
              className="upload-list-inline"
              showUploadList={false}
              beforeUpload={() => { return false }}
              onChange={handleBannerChange}
            >
              <Button icon={<UploadOutlined />} loading={uploadImageMutation.isPending}>{t('EmailSettings.uploadButton')}</Button>
            </Upload>
            {banner && <img src={banner} alt="banner" style={{ marginTop: '10px', maxWidth: '200px' }} />}
          </Form.Item>
        </Card>

        <Card title={t('EmailSettings.colorSettingsTitle')} bordered={false} className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="backgroundColor"
                label={t('EmailSettings.backgroundColor')}
              >
                <ChromePicker
                  color={backgroundColor}
                  onChangeComplete={(color) => setBackgroundColor(color.hex)}
                />
              </Form.Item>
              <Form.Item
                name="primaryColor"
                label={t('EmailSettings.primaryColor')}
              >
                <ChromePicker
                  color={primaryColor}
                  onChangeComplete={(color) => setPrimaryColor(color.hex)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="secondaryColor"
                label={t('EmailSettings.secondaryColor')}
              >
                <ChromePicker
                  color={secondaryColor}
                  onChangeComplete={(color) => setSecondaryColor(color.hex)}
                />
              </Form.Item>
              <Form.Item
                name="titleColor"
                label={t('EmailSettings.titleColor')}
              >
                <ChromePicker
                  color={titleColor}
                  onChangeComplete={(color) => setTitleColor(color.hex)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('EmailSettings.messageBodyTitle')} bordered={false}>
          <Form.Item
            name="messageBody"
            label={
              <span>
                {t('EmailSettings.messageBody')}
                <Tooltip title={t('EmailSettings.tooltip')}>
                  <InfoCircleOutlined style={{ marginLeft: '8px' }} />
                </Tooltip>
              </span>
            }
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: '16px' }}>
            <Button type="primary" htmlType="submit" loading={configMutation.isPending}>
              {t('EmailSettings.saveButton')}
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}

export default EmailSettings
