import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, message, Popconfirm, Space, Table, Tooltip } from 'antd'
import { parse } from 'query-string'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';
import { useLocation } from 'react-router';
import AddValue from './AddValue';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

const DocumentTable = () => {
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState({ rows: [], count: 0 });
  const [value, setValue] = useState(undefined);
  const [loading, toggleLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [modal, toggleModal] = useState(false);
  const { models: { DocumentField, Document, FieldValue } } = useModels();
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
      attributes: ['properties'],
      where: {
        document_id: form
      }
    }).then(resp => {
      setColumns(resp.rows);
    }).catch(e => {
      errorCatch(e);
    })
  }, [DocumentField, errorCatch, form]);

  const getValues = useCallback(() => {
    const offset = (page - 1) * limit;
    toggleLoading(true);
    FieldValue.collection({
      attributes: ['value'],
      where: {
        document_field_id: form
      },
      limit, offset
    }).then(resp => {
      toggleLoading(false);
      setValues(resp);
    }).catch(errorCatch);
  }, [FieldValue, form, errorCatch, limit, page]);

  const createValue = useCallback((val, cb) => {
    FieldValue.create({ value: val, document_field_id: form }).then(resp => {
      console.log(resp);
      getValues();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [FieldValue, form, errorCatch, getValues]);

  const updateValue = useCallback((val, cb) => {
    value.update({ value: val }).then(resp => {
      console.log(resp);
      message.success(`Data nilai berhasil diubah`);
      cb();
      toggleModal(false);
      getValues();
    }).catch(errorCatch);
  }, [value, getValues, errorCatch]);

  const deleteValue = useCallback(value => {
    value.delete().then(resp => {
      console.log(resp);
      message.success(`Data nilai berhasil dihapus`);
      getValues();
    }).catch(errorCatch);
  }, [getValues, errorCatch]);

  useEffect(() => {
    getColumns();
    getDocument();
    getValues();
  }, [getColumns, getDocument, getValues]);

  return (
    <div style={{ marginTop: 12 }}>
      <Button onClick={() => toggleModal(true)}>Tambah data {document?.name}</Button>
      <AddValue value={value} onSubmit={typeof value !== 'undefined' ? updateValue : createValue} visible={modal} onCancel={() => {
        toggleModal(false);
        setValue(undefined);
      }}
      />
      <Table
        style={{ marginTop: 12 }}
        columns={columns.length > 0 ?
          [...columns[0].properties.map(prop => (
            {
              title: prop.field,
              key: `${prop.field}${prop.type}`,
              render: (row) => row.value[prop.field] ?? '-'
            }
          )), {
            title: 'Edit | Hapus',
            key: 'action',
            render: (row) => (
              <Space>
                <Tooltip title={"Edit"}>
                  <Button onClick={() => {
                    toggleModal(true);
                    setValue(row);
                  }} icon={<EditOutlined />} size="small" />
                </Tooltip>
                <Tooltip title={"Hapus"}>
                  <Popconfirm
                    title={`Apakah Anda yakin ingin menghapus nilai?`}
                    placement="topRight"
                    okText="Hapus"
                    okButtonProps={{ danger: true, type: 'primary' }}
                    cancelText="Batal"
                    onConfirm={() => deleteValue(row)}
                  >
                    <Button icon={<DeleteOutlined />} danger type="primary" size="small" />
                  </Popconfirm>
                </Tooltip>
              </Space>
            )
          }]
          :
          []
        }
        pagination={{
          current: page,
          onChange: setPage,
          total: values.count,
          defaultPageSize: limit,
          pageSize: limit,
          onShowSizeChange: (current, limit) => setLimit(limit),
          showSizeChanger: true
        }}
        loading={{ spinning: loading, indicator: <LoadingOutlined spin />, size: 'large', tip: `Mengambil data ${document?.name}` }}
        dataSource={values.rows}
        bordered
        rowKey={item => `${item.id}`}
      />
    </div>
  )
}

export default DocumentTable
