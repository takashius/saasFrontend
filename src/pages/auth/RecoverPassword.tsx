import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoveryOne } from '../../api/auth'

const RecoverPassword: React.FC = () => {
  const { t } = useTranslation()
  const recoveryQuery = useRecoveryOne()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (values: any) => {
    recoveryQuery.mutate(values.email)
    localStorage.setItem('email', values.email)
  }

  useEffect(() => {
    if (recoveryQuery.isSuccess) {
      navigate('/recover-password/step2')
    }
  }, [recoveryQuery.isSuccess])

  useEffect(() => {
    if (recoveryQuery.error) {
      messageApi.open({
        type: 'error',
        content: `${recoveryQuery.error}`,
      })
    }
  }, [recoveryQuery.error, messageApi])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {contextHolder}
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-300">{t('recoverPassword.title')}</h2>
        <Form
          name="recover_password"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: t('recoverPassword.emailRequired') }]}
          >
            <Input placeholder={t('recoverPassword.email')} />
          </Form.Item>
          <Form.Item>
            <div className="flex space-x-2">
              <Button type="primary" htmlType="submit" className="w-1/2" loading={recoveryQuery.isPending}>
                {t('recoverPassword.recover')}
              </Button>
              <div className="w-1/2">
                <Link to="/login" className="flex justify-center">
                  <Button type="default" className="w-full">
                    {t('recoverPassword.backToLogin')}
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

export default RecoverPassword
