import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../../api/auth'
import { getErrorMessage } from '../../utils/GetMessage'

const Register: React.FC = () => {
  const { t } = useTranslation()
  const registerMutate = useRegister()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (values: any) => {
    registerMutate.mutate(values)
  }

  useEffect(() => {
    if (registerMutate.isSuccess) {
      localStorage.setItem('registerSuccess', 'true')
      navigate('/login')
    }
  }, [registerMutate.isSuccess])

  useEffect(() => {
    if (registerMutate.error) {
      const errorMessage: string = getErrorMessage(registerMutate.error)

      messageApi.open({
        type: 'error',
        content: `${errorMessage}`,
      });
    }
  }, [registerMutate.error, messageApi])


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {contextHolder}
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-300">{t('register.title')}</h2>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: t('register.nameRequired') }]}
          >
            <Input placeholder={t('register.name')} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: t('register.emailRequired') }]}
          >
            <Input placeholder={t('register.email')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('register.passwordRequired') }]}
          >
            <Input.Password placeholder={t('register.password')} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: t('register.confirmPasswordRequired') },
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

          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-300">{t('register.companyDetails')}</h3>

          <Form.Item
            name="companyName"
            rules={[{ required: true, message: t('register.companyNameRequired') }]}
          >
            <Input placeholder={t('register.companyName')} />
          </Form.Item>
          <Form.Item
            name="docId"
            rules={[{ required: true, message: t('register.rifRequired') }]}
          >
            <Input placeholder={t('register.rif')} />
          </Form.Item>

          <Form.Item>
            <div className="flex space-x-2">
              <Button type="primary" htmlType="submit" loading={registerMutate.isPending} className="w-1/2">
                {t('register.register')}
              </Button>
              <div className="w-1/2">
                <Link to="/login" className="flex justify-center">
                  <Button type="default" className="w-full">
                    {t('register.backToLogin')}
                  </Button>
                </Link>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register
