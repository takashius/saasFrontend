import { useParams } from 'react-router-dom'
import {
  Table,
  Button,
  Descriptions,
  Card,
  Skeleton,
  Row,
  Col,
  Popconfirm,
  message,
  Tabs,
  Statistic
} from 'antd'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { MoneyFlow, Product } from '../types'
import { useState } from 'react'
import FloatingMenu from '../components/FloatingMenu'
import ProductFormDrawer from '../components/ProductFormDrawer'
import MoneyFlowFormDrawer from '../components/MoneyFlowFormDrawery'
import QuotationFormModal from '../components/QuotationFormModal'
import { useTranslation } from 'react-i18next'
import {
  useCotizaDetail,
  useDeleteProductFromQuotation,
  useUpdateRate,
  useSendQuotationByEmail,
  useDownloadPDF
} from '../api/cotiza'
import { useMoneyFlowByCotiza, useDeleteMoneyFlow } from '../api/moneyFlow'

const calculateIncomeExpensesSummaryAndChartData = (moneyFlow: MoneyFlow[]) => {
  if (!moneyFlow) return {
    summary: { totalIncome: 0, totalExpenses: 0, netProfit: 0 },
    chartData: { labels: [], datasets: [] }
  };

  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeByDate: { [key: string]: number } = {};
  const expensesByDate: { [key: string]: number } = {};

  moneyFlow.forEach((item) => {
    const date = item.created.date.split('T')[0]; // Obtener solo la fecha
    if (item.type === 'income') {
      totalIncome += item.amount;
      if (!incomeByDate[date]) incomeByDate[date] = 0;
      incomeByDate[date] += item.amount;
    } else if (item.type === 'expense') {
      totalExpenses += item.amount;
      if (!expensesByDate[date]) expensesByDate[date] = 0;
      expensesByDate[date] += item.amount;
    }
  });

  const netProfit = totalIncome - totalExpenses;

  // Obtener todas las fechas únicas ordenadas
  const labels = Array.from(new Set([...Object.keys(incomeByDate), ...Object.keys(expensesByDate)])).sort();

  const incomeData = labels.map(date => incomeByDate[date] || 0);
  const expensesData = labels.map(date => -expensesByDate[date] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        data: incomeData,
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Egresos',
        data: expensesData,
        borderColor: 'red',
        fill: false,
      },
    ],
  };

  return {
    incomeExpensesSummary: {
      totalIncome,
      totalExpenses,
      netProfit,
    },
    chartData,
  };
};

const QuotationDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { data: quotation, error, isLoading, refetch } = useCotizaDetail(id!)
  const { data: moneyFlow, error: errorFlow, isLoading: isLoadingFlow, refetch: refetchFlow } = useMoneyFlowByCotiza(id!)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingFlow, setEditingFlow] = useState<MoneyFlow | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [drawerFlowVisible, setDrawerFlowVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [messageApi, contextHolder] = message.useMessage()
  const { t } = useTranslation()
  const deleteProductMutation = useDeleteProductFromQuotation()
  const deleteFlowMutation = useDeleteMoneyFlow()
  const updateRateMutation = useUpdateRate()
  const sendQuotationByEmailMutation = useSendQuotationByEmail()
  const downloadMutation = useDownloadPDF()
  const { TabPane } = Tabs
  const { incomeExpensesSummary, chartData } = calculateIncomeExpensesSummaryAndChartData(moneyFlow!)

  const columnsIncomeExpenses = [
    {
      title: t('incomeExpenses.description'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('incomeExpenses.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: MoneyFlow) => (
        <span style={{ color: record.type === 'expense' ? 'red' : 'green' }}>
          {record.type === 'expense' ? `-$${amount.toFixed(2)}` : `$${amount.toFixed(2)}`}
        </span>
      ),
    },
    {
      title: t('incomeExpenses.date'),
      dataIndex: 'created',
      key: 'created.date',
      render: (created: { date: string }) => new Date(created.date).toLocaleDateString(),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (record: MoneyFlow) => (
        <Button.Group>
          <Button type='primary' icon={<EditOutlined />} onClick={() => openEditFlowDrawer(record)} />
          <Popconfirm
            title={t('incomeExpenses.deleteConfirmTitle')}
            description={t('incomeExpenses.deleteConfirmDescription')}
            onConfirm={() => handleDeleteIncomeExpense(record._id)}
            okText={t('incomeExpenses.confirmOkText')}
            cancelText={t('incomeExpenses.confirmCancelText')}
          >
            <Button type='primary' icon={<DeleteOutlined />} />
          </Popconfirm>
        </Button.Group>
      ),
    },
  ]

  const columns = [
    {
      title: t('quotationDetails.productTableTitle'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('productForm.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t('productForm.quantity'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: t('productForm.totalPrice'),
      key: 'totalPrice',
      render: (_: any, product: Product) => `$${(product.price * product.amount).toFixed(2)}`,
    },
    {
      title: t('productForm.tax'),
      dataIndex: 'iva',
      key: 'iva',
      render: (iva: boolean) => (iva ? 'Sí' : 'No'),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (record: Product) => (
        <Button.Group>
          <Button type='primary' icon={<EditOutlined />} onClick={() => openEditProductDrawer(record)} />
          <Popconfirm
            title={t('quotationDetails.deleteConfirmTitle')}
            description={t('quotationDetails.deleteConfirmDescription')}
            onConfirm={() => handleDeleteProduct(record._id)}
            okText={t('quotationDetails.confirmOkText')}
            cancelText={t('quotationDetails.confirmCancelText')}
          >
            <Button type='primary' icon={<DeleteOutlined />} loading={deleteProductMutation.isPending && deleteProductMutation.variables?.id === record._id} />
          </Popconfirm>
        </Button.Group>
      ),
    }
  ]

  const handleUpdateRate = () => {
    updateRateMutation.mutate({ id: id! }, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Tasa actualizada correctamente`,
        })
        refetch()
      }
    })
  }

  const handleSendEmail = () => {
    sendQuotationByEmailMutation.mutate(id!, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Correo enviado correctamente`,
        })
      }
    })
  }

  const handleDownloadPDF = (id: string, number: string, type: string) => {
    downloadMutation.mutate({ id, number, type }, {
      onSettled: () => {
        messageApi.open({
          type: 'success',
          content: `PDF Generado correctamente`,
        })
      }
    })
  }

  const handleMenuClick = (key: string) => {
    if (key === 'edit') {
      setModalVisible(true)
    } else if (key === 'update-rate') {
      handleUpdateRate()
    } else if (key === 'send-email') {
      handleSendEmail()
    } else if (key === 'generate-pdf') {
      handleDownloadPDF(id!, `${quotation?.number}`, 'factura')
    } else if (key === 'pdf-forma-libre') {
      handleDownloadPDF(id!, `${quotation?.number}`, 'forma-libre')
    } else if (key === 'budget') {
      handleDownloadPDF(id!, `${quotation?.number}`, 'presupuesto')
    }
  }

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate({ id: productId, idParent: id! }, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Producto Borrado correctamente`,
        })
        refetch()
      }
    })
  }

  const showDrawer = () => {
    setEditingProduct(null)
    setDrawerVisible(true)
  }

  const showDrawerFlow = () => {
    setEditingFlow(null)
    setDrawerFlowVisible(true)
  }

  const openEditProductDrawer = (product: Product) => {
    setEditingProduct(product)
    setDrawerVisible(true)
  }

  const openEditFlowDrawer = (moneyFlow: MoneyFlow) => {
    setEditingFlow(moneyFlow)
    setDrawerFlowVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
    setEditingProduct(null)
  }

  const closeDrawerFlow = () => {
    setDrawerFlowVisible(false)
    setEditingFlow(null)
  }

  const handleFormSubmit = () => {
    messageApi.open({
      type: 'success',
      content: `Producto agregado correctamente`,
    })
    refetch()
    closeDrawer()
  }

  const handleFormFlowSubmit = () => {
    messageApi.open({
      type: 'success',
      content: `Movimiento de dinero agregado correctamente`,
    })
    refetchFlow()
    closeDrawerFlow()
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const onUpdated = () => {
    messageApi.open({
      type: 'success',
      content: `Cotizacion editada correctamente`,
    })
    setModalVisible(false)
    refetch()
  }

  const handleDeleteIncomeExpense = (id: string) => {
    refetchFlow()
    deleteFlowMutation.mutate(id, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: `Ingreso/Egreso eliminado correctamente`,
        })
        refetchFlow()
      }
    })
  }

  if (isLoading || isLoadingFlow) {
    return (
      <div className="md:p-4">
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Card>
              <Skeleton active title={false} paragraph={{ rows: 12 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Skeleton active title={false} paragraph={{ rows: 12 }} />
            </Card>
          </Col>
        </Row>
        <Card>
          <Skeleton active title={false} paragraph={{ rows: 10 }} />
        </Card>
      </div>
    )
  }

  if (error || errorFlow) {
    return <div>Error: {error ? error.message : (errorFlow ? errorFlow.message : '')}</div>
  }

  if (!quotation) {
    return <div>No data found</div>
  }

  return (
    <div className="md:p-4">
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card title={quotation.title} bordered={false}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={t('quotationDetails.invoiceNumber')}>{quotation.number}</Descriptions.Item>
            <Descriptions.Item label={t('quotationDetails.date')}>{quotation.date}</Descriptions.Item>
            <Descriptions.Item label={t('quotationDetails.subtotal')}>{`$${quotation.amount.toFixed(2)}`}</Descriptions.Item>
            <Descriptions.Item label={t('quotationDetails.tax')}>{`$${quotation.totalIva.toFixed(2)}`}</Descriptions.Item>
            <Descriptions.Item label={t('quotationDetails.total')}>{`$${quotation.total.toFixed(2)}`}</Descriptions.Item>
            <Descriptions.Item label={t('quotationDetails.exchangeRate')}>{quotation.rate}</Descriptions.Item>
          </Descriptions>
        </Card>
        {activeTab === '1' ? (
          <Card title={`${quotation.customer.name} ${quotation.customer.lastname}`} bordered={false}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label={t('quotationDetails.customerTitle')}>{quotation.customer.title}</Descriptions.Item>
              <Descriptions.Item label={t('quotationDetails.email')}>{quotation.customer.email}</Descriptions.Item>
              <Descriptions.Item label={t('quotationDetails.phone')}>{quotation.customer.phone}</Descriptions.Item>
              <Descriptions.Item label={t('quotationDetails.taxId')}>{quotation.customer.rif}</Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <Card title="Gráfica de Ingresos y Egresos" bordered={false}>
            <Line data={chartData} />
          </Card>
        )}
      </div>

      <div className="md:p-4">
        {contextHolder}
        <Tabs defaultActiveKey="1" onChange={setActiveTab}>
          <TabPane tab={t('quotationDetails.products')} key="1">
            <Card title={
              <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center md:gap-x-4">
                <span>{t('quotationDetails.productTableTitle')}</span>
                <Button
                  type="primary"
                  onClick={showDrawer}
                >
                  {t('quotationDetails.addProductButton')}
                </Button>
              </div>
            } bordered={false}>
              <Table columns={columns} dataSource={quotation.products} rowKey="_id" scroll={{ x: '100%' }} className="overflow-x-auto" />
            </Card>
          </TabPane>
          <TabPane tab={t('quotationDetails.incomeExpenses')} key="2">
            {activeTab === '2' && (
              <>
                {/* Resumen de ingresos y egresos */}
                <Row gutter={16} className="mb-4">
                  <Col span={8}>
                    <Statistic title="Ingresos Totales" value={incomeExpensesSummary?.totalIncome} precision={2} valueStyle={{ color: 'green' }} prefix="$" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Egresos Totales" value={incomeExpensesSummary?.totalExpenses} precision={2} valueStyle={{ color: 'red' }} prefix="$" />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Ganancia Neta"
                      value={incomeExpensesSummary?.netProfit}
                      precision={2}
                      valueStyle={{
                        color: incomeExpensesSummary?.netProfit && incomeExpensesSummary?.netProfit > 0 ? 'green' : 'red'
                      }}
                      prefix="$"
                    />
                  </Col>
                </Row>

                {/* Gráfica de ingresos y egresos */}


                {/* Tabla de ingresos y egresos */}
                <Card title={
                  <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center md:gap-x-4">
                    <span>{t('incomeExpenses.tableTitle')}</span>
                    <Button
                      type="primary"
                      onClick={showDrawerFlow}
                    >
                      {t('incomeExpenses.addButton')}
                    </Button>
                  </div>
                } bordered={false}>
                  <Table columns={columnsIncomeExpenses} dataSource={moneyFlow} rowKey="_id" scroll={{ x: '100%' }} className="overflow-x-auto" />
                </Card>
              </>
            )}
          </TabPane>
        </Tabs>

        {/* Existing Modals, Drawers, and FloatingMenu */}
      </div>

      <ProductFormDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
        quotationId={id!}
        initialValues={editingProduct}
      />

      <MoneyFlowFormDrawer
        visible={drawerFlowVisible}
        onClose={closeDrawerFlow}
        onSubmit={handleFormFlowSubmit}
        quotationId={id!}
        initialValues={editingFlow}
      />

      <QuotationFormModal
        visible={modalVisible}
        onCancel={closeModal}
        onOk={onUpdated}
        initialValues={quotation}
      />
      <FloatingMenu
        onMenuClick={handleMenuClick}
        loading={updateRateMutation.isPending || sendQuotationByEmailMutation.isPending || downloadMutation.isPending}
      />
    </div>
  )
}

export default QuotationDetails
