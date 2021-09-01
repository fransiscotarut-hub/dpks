import Home from 'pages/Home';
import ProgramStudies from 'pages/ProgramStudies';
import Users from 'pages/Users';
import { Switch, Route, useRouteMatch } from 'react-router-dom'

const Router = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact component={Home} />
      <Route path={`${path}/pengguna`} component={Users} />
      <Route path={`${path}/program-studi`} component={ProgramStudies} />
    </Switch>
  )
}

export default Router
