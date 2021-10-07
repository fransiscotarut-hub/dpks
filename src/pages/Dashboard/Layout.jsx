import { useCallback, useState, useEffect } from 'react';
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
  const [loading, toggleLoading] = useState(false);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const logout = useCallback(() => {
    toggleLoading(true);
    auth.remove().then(resp => {
      toggleLoading(false);
      console.log(resp);
      setLogout();
    }).catch(e => {
      toggleLoading(false);
      errorCatch(e);
    })
  }, [auth, setLogout, errorCatch]);  

  return (
    !login ?
    <Redirect to="/" />
    :
    <AntLayout>
      <Header title="DKPS" style={{ background: '#1f1f1f' }} extra={<Button loading={loading} onClick={logout} size="small" icon={<LogoutOutlined />} danger type="primary" >Logout</Button>} />
      <AntLayout>
        <Sidebar />
        <AntLayout>
          <Content className="site-layout" style={{ overflow: 'auto' }}>
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
