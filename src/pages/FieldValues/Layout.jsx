import { useCallback, useEffect, useState, useMemo } from 'react'
import { Typography, Menu, Result } from "antd"
import { useHistory, useLocation } from 'react-router-dom';
import { parse } from 'query-string'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';
import DocumentTable from './DocumentTable';
import { InfoCircleFilled } from '@ant-design/icons';

const Layout = () => {
  const [forms, setForms] = useState([]);
  const [loading, toggleLoading] = useState(true);
  const { search, pathname } = useLocation();
  const { push } = useHistory();
  const { models: { Document } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const { form } = useMemo(() => parse(search), [search]);

  const getDocuments = useCallback(() => {
    toggleLoading(true);
    Document.collection({
      attributes: ['name'],
    }).then(resp => {
      setForms(resp.rows);
      toggleLoading(false);
    }).catch(errorCatch);
  }, [Document, errorCatch]);

  useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  console.log(form)

  return (
    <div>
      <Typography.Title level={5}>DKPS</Typography.Title>
      <Menu defaultSelectedKeys={[form]} selectedKeys={[form]} onClick={ev => push({ pathname, search: `form=${ev.key}` })} mode="horizontal">
        {
          loading ?
            <Menu.Item key="loading">Loading DKPS</Menu.Item>
            :
            forms.map(form => (
              <Menu.Item key={`${form.id}`}>{form.name}</Menu.Item>
            ))
        }
      </Menu>
      {
        typeof form !== 'undefined' ?
        <DocumentTable />
        :
        <Result icon={<InfoCircleFilled />} status="info" title="Pilih Form DKPS" />
      }
    </div>
  )
}

export default Layout
