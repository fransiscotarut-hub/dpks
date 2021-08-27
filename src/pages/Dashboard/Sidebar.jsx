import { Divider, Layout, Menu, Typography } from "antd"
import SubMenu from 'antd/lib/menu/SubMenu';
import {
  MailOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons'
import useAuth from "hooks/useAuth";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
const { Sider } = Layout;

const Sidebar = () => {
  const { user } = useAuth();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { push } = useHistory();

  document.title = "Dashboard";

  return (
    <Sider collapsible>
      <div style={{ padding: 24, paddingBottom: 0, overflow: 'hidden' }}>
        <Typography.Title style={{ textOverflow: 'ellipsis' }} level={5}>{user.name}</Typography.Title>
        <Typography.Text type="secondary">{user.username}</Typography.Text>
      </div>
      <Divider />
      <Menu
        mode="inline"
        defaultOpenKeys={['sub1']}
        theme="dark"
        onClick={event => push(`${event.key}`)}
        defaultSelectedKeys={[pathname]}
      >
        <Menu.Item icon={<HomeOutlined />} key={`${path}`}>
          Halaman Utama
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${path}/pengguna`}>
          Pengguna
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
  )
}

export default Sidebar
