import { Switch, Route } from 'react-router-dom';
import Sirius from '@edgarjeremy/sirius.adapter'
import { useConnectServer } from './hooks/useConnectServer'
import Login from './pages/Login';
import Dashboard from 'pages/Dashboard';
import LandingPage from 'pages/LandingPage';
import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './App.css';
import 'styles/app.dark.css'

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT } = process.env;
const Adapter = new Sirius(REACT_APP_IP_ADDRESS, REACT_APP_PORT, localStorage);

const App = () => {
  const { ready, error } = useConnectServer(Adapter);

  return (
    ready ?
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
      :
      error ?
        <Result status="500" title="Terjadi Kesalahan" subTitle="Tidak dapat terhubung dengan server" />
        :
        <Result icon={<LoadingOutlined />} title="Loading" subTitle="Sedang menghubungkan dengan server" />
  );
}

export default App;
