import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { LoadingOutlined } from '@ant-design/icons'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

const Department = lazy(() => import('pages/Departments/Router'));
const Home = lazy(() => import('pages/Home'));
const Users = lazy(() => import('pages/Users'));
const Setting = lazy(() => import('pages/Setting'));

const Router = () => {
  const { path } = useRouteMatch();

  return (
    <Suspense fallback={<Spin spinning size="large" indicator={<LoadingOutlined spin />} tip="Loading Halaman" />}>
      <Switch>
        <Route path={`${path}`} exact component={Home} />
        <Route path={`${path}/pengguna`} component={Users} />
        <Route path={`${path}/jurusan`} component={Department} />
        <Route path={`${path}/pengaturan-form`} component={Setting} />
      </Switch>
    </Suspense>
  )
}

export default Router
