import { useState, useCallback, useEffect, useMemo } from "react"
import { PageHeader, List, Card, Button, message, Space, Tooltip, Divider, Typography, Descriptions } from "antd";
import { useParams, useHistory } from "react-router-dom"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import AddFormField from "./AddFormField";
import { fieldType } from "translation";

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
      attributes: ['properties'],
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
      message.success(`Field berhasil ditambah`);
      console.log(resp)
      getFields();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [DocumentField, errorCatch, getFields, id]);

  const updateField = useCallback((val) => {
    if (typeof field !== 'undefined') {
      field.update({ ...val }).then(resp => {
        message.success(`Data field berhasil disimpan`);
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
        extra={fields.length > 0 ? [] : <Button onClick={() => toggleModal(true)}>Tambah Field</Button>}
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
            <Typography.Title level={5}>Field {form?.name}</Typography.Title>
            <Descriptions size="small" column={1}>
              {
                item.properties.map(prop => (
                  <Descriptions.Item label={prop.field} >
                    <Typography.Text type="secondary">{fieldType[prop.type]} {fieldType[prop.type] === 'option' && <>({prop.options})</> }</Typography.Text>
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
            <Space size={2} split={<Divider type="vertical" />}>
              <Tooltip placement="right" title="Edit Field">
                <Button size="small" onClick={() => {
                  setField(item);
                  toggleModal(true);
                }} icon={<EditOutlined />}></Button>
              </Tooltip>
            </Space>
          </Card>
        )}
        rowKey={item => `${item.id}`}
      />
    </div>
  )
}

export default Layout
