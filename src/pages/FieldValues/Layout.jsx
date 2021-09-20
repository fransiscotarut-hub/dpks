import {useCallback, useEffect, useState, useMemo} from 'react'
import { Typography, Menu } from "antd"
import { useHistory, useLocation } from 'react-router';
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [forms, setForms] = useState([]);
  const [loading, toggleLoading] = useState(true);
  const {search} = useLocation();
  const {push} = useHistory();
  const {models: {Document}} = useModels();
  const {errorCatch} = useErrorCatcher();

  const {form} = useMemo(() => search, [search]);

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

  return (
    <div>
      <Typography.Title level={5}>DKPS</Typography.Title>
      <Menu onClick={ev => console.log(ev)} mode="horizontal">
        {
          loading ?
          <Menu.Item>Loading DKPS</Menu.Item>
          :
          forms.map(form => (
            <Menu.Item key={`${form.id}`}>{form.name}</Menu.Item>
          ))
        }
      </Menu>
    </div>
  )
}

export default Layout
