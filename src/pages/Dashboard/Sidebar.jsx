import { useState } from "react";
import { Divider, Layout, Menu, Tooltip, Typography } from "antd"
import {
  UserOutlined,
  HomeOutlined,
  BuildOutlined,
  SettingOutlined,
  FormOutlined,
  SnippetsOutlined
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

  return (
    <Sider onCollapse={toggeCollapse} collapsed={collapse} collapsible>
      {!collapse ?
        <div style={{ padding: 24, paddingBottom: 0, overflow: 'hidden' }}>
          <Typography.Title style={{ textOverflow: 'ellipsis' }} level={5}>{user.name}</Typography.Title>
          <Typography.Text type="secondary">{user.username}</Typography.Text>
        </div>
        :
        <div style={{ padding: 24, paddingBottom: 0, overflow: 'hidden' }}>
          <Tooltip placement="right" title={`${user.name}`}>
            <Avatar style={{ background: '#177ddc' }}>
              {`${user.username}`.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </div>
      }
      <Divider />
      <Menu
        mode="inline"
        theme="dark"
        onClick={event => push(`${event.key}`)}
        defaultSelectedKeys={[pathname]}
        selectedKeys={[pathname]}
      >
        <Menu.Item icon={<HomeOutlined />} key={`${path}`}>
          Halaman Utama
        </Menu.Item>
        {['chief', 'program_chief', 'program_team', 'head_team', 'administrator',].includes(user.type) &&
          <Menu.Item icon={<FormOutlined />} key={`${path}/dkps`}>
            DKPS
          </Menu.Item>}
        <Menu.Item icon={<SnippetsOutlined />} key={`${path}/simulasi-nilai`}>
          Simulasi Nilai
        </Menu.Item>
        {user.type === 'administrator' &&
          <>
            <Menu.Item icon={<BuildOutlined />} key={`${path}/jurusan`}>
              Jurusan
            </Menu.Item>
            <Menu.Item icon={<UserOutlined />} key={`${path}/pengguna`}>
              Pengguna
            </Menu.Item>
            <Menu.Item icon={<SettingOutlined />} key={`${path}/pengaturan-form`}>
              Pengaturan
            </Menu.Item>
          </>
        }
      </Menu>
    </Sider>
  )
}

export default Sidebar
