import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { LoadingOutlined } from '@ant-design/icons'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import FourOFourPage from 'components/FourOFourPage';
import useAuth from 'hooks/useAuth';

const Department = lazy(() => import('pages/Departments/Router'));
const Home = lazy(() => import('pages/Home'));
const Users = lazy(() => import('pages/Users'));
const Setting = lazy(() => import('pages/Setting/Router'));
const FieldValues = lazy(() => import('pages/FieldValues'));
const SimulationScores = lazy(() => import('pages/SimulationScores'));

const Router = () => {
  const { path } = useRouteMatch();
  const { user } = useAuth();

  return (
    <Suspense fallback={<Spin spinning size="large" indicator={<LoadingOutlined spin />} tip="Loading Halaman" />}>
      <Switch>
        <Route path={`${path}`} exact component={Home} />
        {['chief', 'program_chief', 'program_team', 'head_team', 'administrator',].includes(user.type) &&
          <Route path={`${path}/dkps`} component={FieldValues} />
        }
        <Route path={`${path}/simulasi-nilai`} component={SimulationScores} />
        {user.type === 'administrator' &&
          <>
            <Route path={`${path}/pengguna`} component={Users} />
            <Route path={`${path}/jurusan`} component={Department} />
            <Route path={`${path}/pengaturan-form`} component={Setting} />
          </>}
        <FourOFourPage />
      </Switch>
    </Suspense>
  )
}

export default Router
