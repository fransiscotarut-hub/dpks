import { Switch, Route, useRouteMatch } from "react-router-dom"
import FormFields from "pages/FormFields";
import Setting from ".";
import FourOFourPage from "components/FourOFourPage";

const Router = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact component={Setting} />
      <Route path={`${path}/:id`} exact component={FormFields} />
      <FourOFourPage />
    </Switch>
  )
}

export default Router
