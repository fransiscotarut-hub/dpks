import { useState, useCallback, useEffect, useMemo } from "react"
import { PageHeader, List, Card, Button, message, Space, Tooltip, Divider, Typography } from "antd";
import { useParams, useHistory } from "react-router-dom"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import AddFormField from "./AddFormField";

const Layout = () => {
  const [fields, setFields] = useState([]);
  const [field, setField] = useState(undefined);
  const [form, setForm] = useState(undefined);
  const [loading, toggleLoading] = useState(true);
  const [modal, toggleModal] = useState(false);
  const { models: { DocumentField, Document } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { id } = useParams();
  const { push } = useHistory();

  const getFields = useCallback(() => {
    toggleLoading(true);
    DocumentField.collection({
      attributes: ['name', 'field_type'],
      where: {
        document_id: id
      }
    }).then(resp => {
      setFields(resp.rows);
      toggleLoading(false);
    }).catch(errorCatch);
  }, [DocumentField, id, errorCatch]);

  const getFormDetail = useCallback(() => {
    Document.single(id).then(resp => {
      setForm(resp)
    }).catch(errorCatch);
  }, [Document, id, errorCatch]);

  useEffect(() => {
    getFields();
    getFormDetail();
  }, [getFields, getFormDetail]);

  const createField = useCallback((val, cb) => {
    DocumentField.create({ ...val, document_id: id }).then(resp => {
      message.success(`Field ${resp.name} berhasil ditambah`);
      getFields();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [DocumentField, errorCatch, getFields, id]);

  const updateField = useCallback((val) => {
    if (typeof field !== 'undefined') {
      field.update({ ...val }).then(resp => {
        message.success(`Data field ${resp.name} berhasil disimpan`);
        getFields();
        toggleModal(false);
      }).catch(errorCatch);
    }
  }, [getFields, field, errorCatch]);

  const isEdit = useMemo(() => typeof field !== 'undefined', [field]);

  return (
    <div>
      <PageHeader
        onBack={() => push('/dashboard/pengaturan-form')} title={typeof form !== 'undefined' ? `Form ${form.name}` : 'Form'}
        extra={<Button onClick={() => toggleModal(true)}>Tambah Field</Button>}
      />
      <AddFormField visible={modal} field={field} onCancel={() => {
        toggleModal(false);
        setField(undefined);
      }} onSubmit={isEdit ? updateField : createField} />
      <List
        style={{ marginTop: 8 }}
        loading={{ spinning: loading, indicator: <LoadingOutlined spin />, size: 'large', tip: `Mengambil field form` }}
        dataSource={fields}
        renderItem={item => (
          <Card size="small" style={{ marginBottom: 4, marginTop: 4 }}>
            <List.Item>
              <Space size={'large'} split={<Divider type="vertical" />}>
                <div>
                  <div>
                    <Typography.Text>
                      {item.name}
                    </Typography.Text>
                  </div>
                  <Typography.Text type="secondary">
                    <small> Nama Field </small>
                  </Typography.Text>
                </div>
                <span>
                  <div>
                    <Typography.Text>
                      {item.field_type}
                    </Typography.Text>
                  </div>
                  <Typography.Text type="secondary">
                    <small> Tipe Field </small>
                  </Typography.Text>
                </span>
              </Space>
              <Space split={<Divider type="vertical" />} size="small">
                <Tooltip title={`Edit ${item.name}`}>
                  <Button onClick={() => {
                    toggleModal(true);
                    setField(item);
                  }} size="small" icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip placement="topRight" title={`Hapus ${item.name}`}>
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                </Tooltip>
              </Space>
            </List.Item>
          </Card>
        )}
        rowKey={item => `${item.id}`}
      />
    </div>
  )
}

export default Layout
