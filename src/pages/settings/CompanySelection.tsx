import React, { useEffect, useState } from 'react'
import { Card, Radio, Button, List, Skeleton, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount, useSelectCompany } from '../../api/auth'
import './CompanySelection.css'

const CompanySelection: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const { data, isLoading } = useAccount()
  const setCompanyMutation = useSelectCompany()

  useEffect(() => {
    if (data?.companys) {
      const defaultCompany = data.companys.find(company => company.selected);
      if (defaultCompany) {
        setSelectedCompany(defaultCompany.company._id);
      }
    }
  }, [data]);

  const handleChange = (e: any) => {
    setSelectedCompany(e.target.value)
  }

  const handleSave = () => {
    setCompanyMutation.mutate({ company: selectedCompany }, {
      onSuccess: () => {
        message.success(t('saveSuccess'))
      },
      onError: () => {
        message.error(t('saveError'))
      }
    })
  }

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
      <Card title={t('CompanySelection.title')} bordered={false}>
        <Radio.Group onChange={handleChange} value={selectedCompany}>
          <List
            itemLayout="horizontal"
            dataSource={data?.companys!}
            renderItem={item => (
              <List.Item>
                <Radio value={item.company._id} className="custom-radio">
                  {item.company.name}
                </Radio>
              </List.Item>
            )}
          />
        </Radio.Group>
        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button type="primary" onClick={handleSave} loading={setCompanyMutation.isPending}>
            {t('CompanySelection.saveButton')}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default CompanySelection
