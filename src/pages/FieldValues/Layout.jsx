import { useCallback, useEffect, useState, useMemo } from 'react'
import { Typography, Menu, Result, Space, Select } from "antd"
import { useHistory, useLocation } from 'react-router-dom';
import { parse } from 'query-string'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';
import DocumentTable from './DocumentTable';
import { InfoCircleFilled } from '@ant-design/icons';

const Layout = () => {
  const [forms, setForms] = useState([]);
  const [loading, toggleLoading] = useState(true);
  const [documentType, setDocumentType] = useState('D3');
  const { search, pathname } = useLocation();
  const { push } = useHistory();
  const { models: { Document } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const { form } = useMemo(() => parse(search), [search]);

  
  const getDocuments = useCallback(() => {
    toggleLoading(true);
    Document.collection({
      attributes: ['name', 'type'],
      where: {
        type: documentType
      }
    }).then(resp => {
      setForms(resp.rows);
      toggleLoading(false);
    }).catch(errorCatch);
  }, [Document, errorCatch, documentType]);
  
  useEffect(() => {
    getDocuments();
    document.title = "Dashboard - DKPS"
  }, [getDocuments]);

  console.log(form)

  return (
    <div>
      <Space align="top">
        <Typography.Title level={5}>DKPS</Typography.Title>
        <Select placeholder="Pilih Diploma" size="small" value={documentType} onChange={setDocumentType}>
          <Select.Option value="D3">Diploma 3</Select.Option>
          <Select.Option value="D4">Diploma 4</Select.Option>
        </Select>
      </Space>
      <Menu theme="dark" defaultSelectedKeys={[form]} selectedKeys={[form]} onClick={ev => push({ pathname, search: `form=${ev.key}` })} mode="horizontal">
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
