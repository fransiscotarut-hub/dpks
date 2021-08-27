import { Layout as AntLayout, Avatar, Breadcrumb } from 'antd';
import Title from 'antd/lib/typography/Title';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import Router from './Router';
const { Header, Footer, Content } = AntLayout;

const Layout = () => {
  return (
    <AntLayout>
      <Header style={{ padding: '10' }}>
        <Avatar style={{ float: 'right' }} icon={<UserOutlined />} />
        <Title style={{ color: 'white', margin: '18px 24px 16px 0' }} level={4}>DPKS</Title>
      </Header>
      <AntLayout>
        <Sidebar />
        <AntLayout style={{ overflow: 'auto' }}>
          <Content className="site-layout">
            <Breadcrumb style={{ margin: 15 }}>
              <Breadcrumb.Item>
                <DashboardOutlined />
                <span>Dashboard</span>
              </Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 15 }}>
              <Router />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>TagConn</Footer>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
