import Home from 'pages/Home';
import Users from 'pages/Users';
import { Switch, Route, useRouteMatch } from 'react-router-dom'

const Router = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact component={Home} />
      <Route path={`${path}/pengguna`} component={Users} />
    </Switch>
  )
}

export default Router
