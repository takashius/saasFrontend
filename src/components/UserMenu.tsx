import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLogout } from '../api/auth'

const UserMenu = () => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        logout()
        navigate('/login')
      },
      onError: (error) => {
        logout()
        navigate('/login')
        console.error('Error al hacer logout:', error)
      }
    })
  }

  return (
    <Menu>
      <Menu.Item key="1">
        <Link to="/settings/profile">{t('menu.profile')}</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        {t('menu.logout')}
      </Menu.Item>
    </Menu>
  )
}

export default UserMenu