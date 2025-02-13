import React, { useState, useEffect } from 'react'
import { Card, Form, Input, InputNumber, Select, Switch, Upload, Row, Col, Skeleton, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useGetCompany, useSetConfig } from '../../api/company'
import { useAuth } from '../../context/AuthContext'
import { useUploadImage } from '../../api/auth'

const { Option } = Select;

const GeneralSettings: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [logo, setLogo] = useState<string | null>(null)
  const { data: config, isLoading, refetch } = useGetCompany(true)
  const configMutation = useSetConfig()
  const { getUser } = useAuth()
  const user: any = getUser()
  const uploadImageMutation = useUploadImage()

  const [webColor, setWebColor] = useState<string>(localStorage.getItem('webColor') || 'blue')
  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(
    localStorage.getItem('isHeaderFixed') === 'true'
  );

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        address: config.address,
        description: config.description,
        phone: config.phone,
        rif: config.rif,
        currencySymbol: config.currencySymbol,
        currencyRate: config.currencyRate,
        autoCorrelatives: config.correlatives?.manageInvoiceCorrelative,
        iva: config.iva,
        logo: config.logo,
      });
      setLogo(config.logo)
    }
  }, [config, form])

  const saveWebPreferences = () => {
    localStorage.setItem('webColor', webColor)
    localStorage.setItem('isHeaderFixed', isHeaderFixed.toString())
    message.success(t('WebSettings.saveSuccess'))
    window.location.reload()
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        values.id = user.company;
        configMutation.mutate(values, {
          onSuccess: () => {
            message.success(t('saveSuccess'))
          },
          onError: () => {
            message.error(t('saveError'))
          },
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      });
  };

  const handleLogoChange = (info: any) => {
    uploadImageMutation.mutate({
      image: info.file,
      imageType: 'logo',
    });
  };

  useEffect(() => {
    if (uploadImageMutation.isSuccess) {
      refetch();
    }
  }, [uploadImageMutation.isSuccess])

  if (isLoading) {
    return (
      <div className="md:p-4">
        <Card className="mb-4">
          <Skeleton active title={false} paragraph={{ rows: 16 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card title={t('GeneralSettings.title')} bordered={false}>
        <Form form={form} layout="vertical" name="general_settings_form" onFinish={handleSave}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="address"
                label={t('GeneralSettings.address')}
                rules={[{ required: true, message: t('GeneralSettings.validationAddress') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={t('GeneralSettings.description')}
                rules={[{ required: true, message: t('GeneralSettings.validationDescription') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label={t('GeneralSettings.phone')}
                rules={[{ required: true, message: t('GeneralSettings.validationPhone') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="rif"
                label={t('GeneralSettings.rif')}
                rules={[{ required: true, message: t('GeneralSettings.validationRif') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="currencySymbol"
                label={t('GeneralSettings.currency')}
                rules={[{ required: true, message: t('GeneralSettings.validationCurrency') }]}
              >
                <Select>
                  <Option value="bs">Bs</Option>
                  <Option value="€">€</Option>
                  <Option value="$">$</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="currencyRate"
                label={t('GeneralSettings.rate')}
                rules={[{ required: true, message: t('GeneralSettings.validationRate') }]}
              >
                <Select placeholder={t('GeneralSettings.ratePlaceholder')}>
                  <Option value="usd">$</Option>
                  <Option value="euro">€</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="autoCorrelatives"
                label={t('GeneralSettings.autoCorrelatives')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="iva"
                label={t('GeneralSettings.iva')}
                rules={[{ required: true, message: t('GeneralSettings.validationIva') }]}
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="logo" label={t('GeneralSettings.logo')}>
                <Upload
                  name="logo"
                  listType="picture"
                  className="upload-list-inline"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleLogoChange}
                >
                  <Button icon={<UploadOutlined />} type='primary' loading={uploadImageMutation.isPending}>
                    {t('GeneralSettings.uploadButton')}
                  </Button>
                </Upload>
                {logo && <img src={logo} alt="logo" style={{ marginTop: '10px', maxWidth: '200px' }} />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={configMutation.isPending} className={`mt-8`}>
                  {t('GeneralSettings.saveButton')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Nuevo Card para las preferencias web */}
      <Card title={t('WebSettings.title')} bordered={false} className="mt-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t('WebSettings.color')}>
              <Select
                value={webColor}
                onChange={(value) => setWebColor(value)}
              >
                <Option value="blue">{t('WebSettings.colors.blue')}</Option>
                <Option value="indigo">{t('WebSettings.colors.indigo')}</Option>
                <Option value="purple">{t('WebSettings.colors.purple')}</Option>
                <Option value="pink">{t('WebSettings.colors.pink')}</Option>
                <Option value="red">{t('WebSettings.colors.red')}</Option>
                <Option value="orange">{t('WebSettings.colors.orange')}</Option>
                <Option value="yellow">{t('WebSettings.colors.yellow')}</Option>
                <Option value="green">{t('WebSettings.colors.green')}</Option>
                <Option value="teal">{t('WebSettings.colors.teal')}</Option>
                <Option value="cyan">{t('WebSettings.colors.cyan')}</Option>
                <Option value="gray">{t('WebSettings.colors.gray')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t('WebSettings.fixedHeader')} valuePropName="checked">
              <Switch
                checked={isHeaderFixed}
                onChange={(checked) => setIsHeaderFixed(checked)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button type="primary" onClick={saveWebPreferences}>
              {t('WebSettings.saveButton')}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GeneralSettings;