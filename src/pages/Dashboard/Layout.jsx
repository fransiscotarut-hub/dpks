import { useCallback } from 'react';
import { Layout as AntLayout, Breadcrumb, PageHeader as Header, Button } from 'antd';
import { LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import Router from './Router';
import useAuth from 'hooks/useAuth';
import useErrorCatcher from 'hooks/useErrorCatcher';
import { Redirect } from 'react-router';
const { Footer, Content } = AntLayout;

const Layout = () => {
  const { auth, setLogout, login } = useAuth();
  const {errorCatch} = useErrorCatcher();

  const logout = useCallback(() => {
    auth.remove().then(resp => {
      console.log(resp);
      setLogout();
    }).catch(errorCatch)
  }, [auth, setLogout, errorCatch]);  

  return (
    !login ?
    <Redirect to="/" />
    :
    <AntLayout>
      <Header title="DKPS" style={{ background: '#1f1f1f' }} extra={<Button onClick={logout} size="small" icon={<LogoutOutlined />} danger type="primary" >Logout</Button>} />
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
