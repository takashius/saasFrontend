import React, { useState } from 'react'
import { Menu, Dropdown, Button } from 'antd'
import { EditOutlined, FilePdfOutlined, MailOutlined, DollarOutlined, MenuOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface FloatingMenuProps {
  onMenuClick: (key: string) => void
  loading: boolean
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onMenuClick, loading }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const { t } = useTranslation()

  const handleMenuClick = ({ key }: { key: string }) => {
    setMenuVisible(false)
    onMenuClick(key)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        {t('floatingMenu.edit')}
      </Menu.Item>
      <Menu.Item key="generate-pdf" icon={<FilePdfOutlined />}>
        {t('floatingMenu.generatePdf')}
      </Menu.Item>
      <Menu.Item key="pdf-forma-libre" icon={<FilePdfOutlined />}>
        {t('floatingMenu.pdfFormat')}
      </Menu.Item>
      <Menu.Item key="budget" icon={<FilePdfOutlined />}>
        {t('floatingMenu.budget')}
      </Menu.Item>
      <Menu.Item key="update-rate" icon={<DollarOutlined />}>
        {t('floatingMenu.updateRate')}
      </Menu.Item>
      <Menu.Item key="send-email" icon={<MailOutlined />}>
        {t('floatingMenu.sendEmail')}
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button
        type="primary"
        shape="circle"
        icon={<MenuOutlined />}
        size="large"
        onClick={() => setMenuVisible(!menuVisible)}
        className="fixed top-20 right-5"
        loading={loading}
      />
    </Dropdown>
  )
}

export default FloatingMenu
