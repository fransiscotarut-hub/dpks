import { Switch, Route } from 'react-router-dom';
import Sirius from '@edgarjeremy/sirius.adapter'
import { useConnectServer } from './hooks/useConnectServer'
import 'antd/dist/antd.dark.css'
import './App.css';
import Login from './pages/Login';
import Dashboard from 'pages/Dashboard';
import LandingPage from 'pages/LandingPage';

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
    <div>error</div>
    :
    <div>loading</div>
  );
}

export default App;
