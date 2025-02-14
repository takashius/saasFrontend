import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Upload, Tooltip, Row, Col, Skeleton, message } from 'antd'
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useUploadImageProfile, useAccount, useUpdateProfile } from '../../api/auth'

const ProfileSettings: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [uploadType, setUploadType] = useState<string>('photo')
  const [userId, setUserId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const { data, isLoading, refetch } = useAccount()
  const updateMutation = useUpdateProfile()
  const uploadImageMutation = useUploadImageProfile()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
      setBanner(data.banner ?? null)
      setPhoto(data.photo ?? null)
      setUserId(data?._id ?? '');
    }
  }, [data, form])

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        console.log(values)
        const userData: any = {
          _id: userId,
          name: values.name,
          lastName: values.lastname,
          phone: values.phone,
          bio: values.bio,
          address: values.address,
        }
        if (values.password) {
          userData.password = values.password
        }
        updateMutation.mutate(userData, {
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
    setUploadType('banner')
    uploadImageMutation.mutate({
      image: info.file,
      imageType: 'banner'
    })
  }

  const handlePhotoChange = (info: any) => {
    setUploadType('photo')
    uploadImageMutation.mutate({
      image: info.file,
      imageType: 'photo'
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
        name="profile_settings"
        onFinish={handleSave}
      >
        <Card title={t('ProfileSettings.base')} bordered={false} className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="name"
                label={t('register.name')}
                rules={[{ required: true, message: t('register.nameRequired') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label={t('AddClientModal.phone')}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="lastname"
                label={t('AddClientModal.lastname')}
                rules={[{ required: true, message: t('AddClientModal.validationLastname') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={t('AddClientModal.email')}

              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('ProfileSettings.imageTitle')} bordered={false} className="mb-4">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="photo"
                label={t('ProfileSettings.photo')}
              >
                <Upload
                  name="photo"
                  listType="picture"
                  className="upload-list-inline"
                  showUploadList={false}
                  beforeUpload={() => { return false }}
                  onChange={handlePhotoChange}
                >
                  <Button icon={<UploadOutlined />} loading={uploadImageMutation.isPending && uploadType === 'photo'}>{t('EmailSettings.uploadButton')}</Button>
                </Upload>
                {photo && <img src={photo} alt="banner" style={{ marginTop: '10px', maxWidth: '200px' }} />}
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  <Button icon={<UploadOutlined />} loading={uploadImageMutation.isPending && uploadType === 'banner'}>{t('EmailSettings.uploadButton')}</Button>
                </Upload>
                {banner && <img src={banner} alt="banner" style={{ marginTop: '10px', maxWidth: '200px' }} />}
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('ProfileSettings.password')} bordered={false} className="mb-4">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="password"
              >
                <Input.Password placeholder={t('register.password')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error(t('register.passwordMismatch')))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={t('register.confirmPassword')} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title={t('ProfileSettings.profile')} bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="bio"
                label={
                  <span>
                    {t('ProfileSettings.bio')}
                    <Tooltip title={t('EmailSettings.tooltip')}>
                      <InfoCircleOutlined style={{ marginLeft: '8px' }} />
                    </Tooltip>
                  </span>
                }
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={12}>

              <Form.Item
                name="address"
                label={
                  <span>
                    {t('ProfileSettings.address')}
                    <Tooltip title={t('EmailSettings.tooltip')}>
                      <InfoCircleOutlined style={{ marginLeft: '8px' }} />
                    </Tooltip>
                  </span>
                }
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginTop: '16px' }}>
            <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
              {t('EmailSettings.saveButton')}
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}

export default ProfileSettings
