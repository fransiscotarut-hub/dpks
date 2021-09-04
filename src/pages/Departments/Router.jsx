import ProgramStudies from "pages/ProgramStudies";
import { Switch, Route, useRouteMatch } from "react-router-dom"
import Department from ".";

const Router = () => {
  const {path} = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={Department} />
      <Route path={`${path}/:id`} exact component={ProgramStudies} />
    </Switch>
  )
}

export default Router
