import '../App.css';
import { Layout, Avatar, Menu, Breadcrumb } from 'antd';
import Title from 'antd/lib/typography/Title';
import { UserOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import {
  MailOutlined,
} from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;



function Dashboard() {
  return (
    <div className="App">
      <Layout>
        <Header style={{ padding: '10' }}>
          <Avatar style={{ float: 'right' }} icon={<UserOutlined />} />
          <Title style={{ color: 'white' }} level={3}>DPKS</Title>
        </Header>
        <Layout>
          <Sider>
            <Menu
              defaultSelectedKeys={['Dashboard']}
              mode="inline"
            >
              <Menu.Item key='Dashboard'>
                Dashboard
              </Menu.Item>
              <SubMenu key="sub1" icon={<MailOutlined />} title="Menu">
                <Menu.ItemGroup key='AboutUs' title='Sub Menu'>
                  <Menu.Item key='Menu1'>
                    Menu 1
                  </Menu.Item >
                  <Menu.Item key='Menu2'>
                    Menu 2
                  </Menu.Item>
                  <Menu.Item key='Menu3'>
                    Menu 3
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>

            </Menu>
          </Sider>

          <Layout>
            <Content className="site-layout" style={{ padding: '0 50px', }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 580 }}>
                Content
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;
