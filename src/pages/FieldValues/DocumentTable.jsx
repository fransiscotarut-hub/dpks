import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Table } from 'antd'
import { parse } from 'query-string'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';
import { useLocation } from 'react-router';
import AddValue from './AddValue';

const DocumentTable = () => {
  const [columns, setColumns] = useState([]);
  const [modal, toggleModal] = useState(false);
  const { models: { DocumentField, Document } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { search } = useLocation();
  const { form } = useMemo(() => parse(search), [search]);
  const [document, setDocument] = useState(undefined);

  window.document.title = `Dashboard - ${document?.name} | DKPS`

  const getDocument = useCallback(() => {
    Document.single(form).then(resp => {
      setDocument(resp);
    }).catch(errorCatch);
  }, [errorCatch, Document, form]);

  const getColumns = useCallback(() => {
    DocumentField.collection({
      attributes: ['name'],
      where: {
        document_id: form
      }
    }).then(resp => {
      setColumns(resp.rows);
    }).catch(e => {
      errorCatch(e);
    })
  }, [DocumentField, errorCatch, form]);

  useEffect(() => {
    getColumns();
    getDocument();
  }, [getColumns, getDocument]);

  return (
    <div style={{ marginTop: 12 }}>
      <Button onClick={() => toggleModal(true)}>Tambah data {document?.name}</Button>
      <AddValue visible={modal} onCancel={() => toggleModal(false)}
      />
      <Table
        style={{ marginTop: 12 }}
        columns={columns.map(col => (
          {
            title: col.name,
            key: `${col.id}`,
            dataIndex: `${col.id}`
          }
        ))}
        dataSource={[]}
        bordered
        rowKey={item => `${item.id}`}
      />
    </div>
  )
}

export default DocumentTable
