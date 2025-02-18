import { useEffect, useState } from 'react'
import { Form, Input, Button, Upload, Avatar, Card, Row, Col, Tag } from 'antd'
import {
  CrownOutlined,
  AppstoreOutlined,
  ShopOutlined,
  LockOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TagsOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  ApiOutlined,
  TeamOutlined,
  UploadOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useRoles, useUserDetail } from '../api/users'
import { useParams } from 'react-router-dom'

const UserEditForm = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userData } = useUserDetail(id!)
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const moduleIcons: Record<string, React.ReactNode> = {
    SUPER_ADMIN: <CrownOutlined className="text-yellow-500" />,
    PROV_ADMIN: <SafetyOutlined className="text-blue-500" />,
    PUBLIC: <GlobalOutlined className="text-green-500" />,
    CATEGORIES: <AppstoreOutlined />,
    COMPANY: <ShopOutlined />,
    PERMISSION: <LockOutlined />,
    PLAN: <CalendarOutlined />,
    POST: <FileTextOutlined />,
    PRODUCTS: <TagsOutlined />,
    ROLES: <SafetyCertificateOutlined />,
    USER: <UserOutlined />,
  }

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        roles: userData.role.map((r: any) => r._id)
      })
    }
  }, [userData, form])

  const handleSubmit = () => {

  }

  const getModuleIcon = (roleName: string) => {
    if (roleName === 'SUPER_ADMIN') return moduleIcons['SUPER_ADMIN']
    if (roleName === 'PROV_ADMIN') return moduleIcons['PROV_ADMIN']
    if (roleName === 'PUBLIC') return moduleIcons['PUBLIC']
    const parts = roleName.split('_')
    const module = parts.length >= 2 ? parts[1].toUpperCase() : 'DEFAULT'

    return moduleIcons[module] || <ApiOutlined />
  };

  useEffect(() => {
    if (userData) {
      const initialRoles = userData.role.map((r: any) => r._id)
      setSelectedRoles(initialRoles)
      form.setFieldsValue({
        ...userData,
        roles: initialRoles
      })
    }
  }, [userData, form])

  const filteredRoles = roles?.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleSelect = (roleId: string) => {
    const currentRoles = form.getFieldValue('roles') || []
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((id: string) => id !== roleId)
      : [...currentRoles, roleId]

    // Actualizar ambos
    setSelectedRoles(newRoles)
    form.setFieldsValue({ roles: newRoles })
  }

  return (
    <div className="p-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Card title={t('CompanySelection.title')} bordered={false} className='mb-4'>
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <Avatar
                src={userData?.photo}
                size={150}
                className="border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0">
                <Upload
                  showUploadList={false}
                // Implementa tu lógica de upload aquí
                >
                  <Button shape="circle" icon={<UploadOutlined />} />
                </Upload>
              </div>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="name"
                label={t('name')}
                rules={[{ required: true }]}
              >
                <Input className="w-full" />
              </Form.Item>

              <Form.Item
                name="email"
                label={t('email')}
                rules={[{ type: 'email' }]}
              >
                <Input className="w-full" />
              </Form.Item>
              <Form.Item
                name="address"
                label={t('address')}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="lastName"
                label={t('lastName')}
              >
                <Input className="w-full" />
              </Form.Item>
              <Form.Item
                name="phone"
                label={t('phone')}
              >
                <Input className="w-full" />
              </Form.Item>

              <Form.Item
                name="bio"
                label={t('bio')}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <div className="md:col-span-2 text-right">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('updateProfile')}
            </Button>
          </div>
        </Card>
        <Card
          title={t('roleManagement')}
          bordered={false}
          className="mt-4 shadow-lg"
          extra={
            <Input.Search
              placeholder={t('searchRoles')}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          }
        >
          <div className="mb-4">
            <span className="font-semibold text-gray-600">{t('selectedRoles')}:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRoles.map((roleId: string) => {
                const role = roles?.find(r => r._id === roleId)
                return role ? (
                  <Tag
                    key={role._id}
                    color="blue"
                    closable
                    onClose={() => handleRoleSelect(role._id)}
                    className="flex items-center gap-2 py-1"
                  >
                    {getModuleIcon(role.name) || <TeamOutlined />}
                    {role.name}
                  </Tag>
                ) : null
              })}
            </div>
          </div>

          <div className="space-y-4">
            {rolesLoading ? <Button loading></Button> :
              <Row gutter={[16, 16]}>
                {filteredRoles?.map(role => {
                  const moduleIcon = getModuleIcon(role.name);
                  const iconColor = selectedRoles.includes(role._id) ? '#1890ff' : '#8c8c8c';

                  return (
                    <Col
                      key={role._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                    >
                      <Card
                        hoverable={!role.disabled}
                        onClick={() => !role.disabled && handleRoleSelect(role._id)}
                        className={`cursor-pointer transition-all duration-200 ${selectedRoles.includes(role._id)
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : role.disabled
                            ? 'border border-gray-300 cursor-not-allowed bg-gray-100 opacity-50'
                            : 'border hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-2xl" style={{ color: iconColor }}>
                            {moduleIcon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{role.name}</h3>
                            <p className="text-gray-600 text-sm">{role.description}</p>
                            <div className="mt-2">
                              <Tag color={selectedRoles.includes(role._id) ? 'blue' : 'default'}>
                                {selectedRoles.includes(role._id)
                                  ? t('selected')
                                  : t('clickToSelect')}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            }
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default UserEditForm
