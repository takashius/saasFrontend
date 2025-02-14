import { useRef } from 'react'
import { Card, Col, Row, Table, List, Avatar, Statistic } from 'antd'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  UserOutlined,
  ShoppingCartOutlined,
  MoneyCollectOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const data = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
}

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
}

const pieData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
}

const Dashboard = () => {
  const barChartRef = useRef(null)
  const lineChartRef = useRef(null)
  const pieChartRef = useRef(null)

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: 24, marginRight: 16 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>1,234</div>
                <div>Usuarios Registrados</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartOutlined style={{ fontSize: 24, marginRight: 16 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>567</div>
                <div>Ventas Totales</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MoneyCollectOutlined style={{ fontSize: 24, marginRight: 16 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>$12,345</div>
                <div>Gastos</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DollarOutlined style={{ fontSize: 24, marginRight: 16 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>$45,678</div>
                <div>Ganancias</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Bar Chart">
            <div style={{ height: 300 }}>
              <Bar
                ref={barChartRef}
                data={barData}
                options={{ maintainAspectRatio: false }}
                id="barChart"
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Line Chart">
            <div style={{ height: 300 }}>
              <Line
                ref={lineChartRef}
                data={lineData}
                options={{ maintainAspectRatio: false }}
                id="lineChart"
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Pie Chart">
            <div style={{ height: 300 }}>
              <Pie
                ref={pieChartRef}
                data={pieData}
                options={{ maintainAspectRatio: false }}
                id="pieChart"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabla */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Table">
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Lista de Usuarios">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={`${item.age} years old, lives at ${item.address}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="All Time Sales">
            <div style={{ height: 220 }}>
              <Statistic
                title="All Time Sales"
                value={295700}
                precision={0}
                prefix="$"
                suffix="k"
                style={{ marginBottom: 16 }}
              />
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: '#52c41a' }}>+2.7%</span> vs previous period
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontWeight: 'bold' }}>Metronic</span> ● <span style={{ fontWeight: 'bold' }}>Bundle</span> ● <span style={{ fontWeight: 'bold' }}>MetronicNest</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>⏰ Online Store</span>
                  <span>$172k <ArrowUpOutlined style={{ color: '#52c41a' }} /> 3.9%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>⏰ Facebook</span>
                  <span>$85k <ArrowDownOutlined style={{ color: '#ff4d4f' }} /> 0.7%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>⏰ Instagram</span>
                  <span>$36k <ArrowUpOutlined style={{ color: '#52c41a' }} /> 8.2%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Lista Principal">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={`${item.age} years old, lives at ${item.address}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Lista Secundaria">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.age} years old`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;