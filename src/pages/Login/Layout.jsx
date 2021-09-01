import { Typography, Form, Input, Button, message, Divider } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";
import useErrorCatcher from "hooks/useErrorCatcher";
import { useCallback, useState } from "react"
import { Redirect } from "react-router-dom";

const { Item } = Form;

const Layout = () => {
  const [loading, toggleLoading] = useState(false);
  const { auth, setLogin, login: loggedIn } = useAuth();
  const { errorCatch } = useErrorCatcher();
  document.title = "Login"

  const login = useCallback(({ username, password }) => {
    toggleLoading(true);
    auth.set({ username, password }).then(resp => {
      toggleLoading(false);
      setLogin(resp);
    }).catch(e => {
      toggleLoading(false);
      if ('response' in e) {
        e.response.status === 401 && message.error(`Username atau password anda salah`);
      } else {
        errorCatch(e);
      }
    })
  }, [errorCatch, auth, setLogin]);

  return (
    loggedIn ?
      <Redirect to="/dashboard" />
      :
      <div style={{ maxWidth: 615, margin: 'auto', padding: 15, height: '100%' }}>
        <Typography.Title level={4}>Login</Typography.Title>
        <Typography.Text type="secondary">Sistem Akreditasi</Typography.Text>
        <Divider />
        <Form onFinish={login} layout="vertical">
          <Item name="username" required={true} rules={[{ required: true, message: "Masukkan username" }]} label="Username">
            <Input disabled={loading} placeholder="Username" />
          </Item>
          <Item name="password" required={true} rules={[{ required: true, message: "Masukkan password" }]} label="Password">
            <Input.Password disabled={loading} placeholder="Password" />
          </Item>
          <Item>
            <Button loading={loading} htmlType="submit" type="primary" icon={<LoginOutlined />} block>Login</Button>
          </Item>
        </Form>
      </div>
  )
}

export default Layout
