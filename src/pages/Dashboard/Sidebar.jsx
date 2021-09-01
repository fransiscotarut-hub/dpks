import { useState } from "react";
import { Divider, Layout, Menu, Typography } from "antd"
import {
  UserOutlined,
  HomeOutlined,
  BuildOutlined
} from '@ant-design/icons'
import useAuth from "hooks/useAuth";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
const { Sider } = Layout;

const Sidebar = () => {
  const [collapse, toggeCollapse] = useState(false);
  const { user } = useAuth();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { push } = useHistory();

  document.title = "Dashboard";

  return (
    <Sider onCollapse={toggeCollapse} collapsed={collapse} collapsible>
      {!collapse ?
        <div style={{ padding: 24, paddingBottom: 0, overflow: 'hidden' }}>
          <Typography.Title style={{ textOverflow: 'ellipsis' }} level={5}>{user.name}</Typography.Title>
          <Typography.Text type="secondary">{user.username}</Typography.Text>
        </div>
        :
        <div style={{ padding: 24, paddingBottom: 0, overflow: 'hidden' }}>
          <Avatar />
        </div>
      }
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
        <Menu.Item icon={<BuildOutlined />} key={`${path}/program-studi`}>
          Program Studi
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${path}/pengguna`}>
          Pengguna
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Sidebar
