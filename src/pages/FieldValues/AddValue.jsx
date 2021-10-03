import { memo, useEffect, useCallback, useState, useMemo } from "react"
import { Modal, Form, Input, InputNumber, Button } from 'antd'
import useModels from "hooks/useModels";
import { useLocation } from "react-router";
import { parse } from "query-string";
import useErrorCatcher from "hooks/useErrorCatcher";
import { LoadingOutlined } from "@ant-design/icons";

const { useForm, Item } = Form;

const AddValue = memo(({ visible, onCancel, onSubmit, value }) => {
  const [forms, setForms] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const { models: { DocumentField } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { search } = useLocation();
  const { form: document_id } = useMemo(() => (parse(search)), [search]);
  const [form] = useForm();

  const getForms = useCallback(() => {
    DocumentField.collection({
      attributes: ['properties'],
      where: {
        document_id
      }
    })
      .then(resp => {
        setForms(resp.rows);
      })
      .catch(errorCatch);
  }, [document_id, DocumentField, errorCatch]);

  useEffect(() => {
    getForms();
  }, [getForms]);

  const resetForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(forms[0].properties.map(prop => (prop.field)));
  }, [form, forms]);

  const onFinish = useCallback((val) => {
    onSubmit(val, resetForm);
  }, [onSubmit, resetForm]);

  useEffect(() => {
    typeof value !== 'undefined' && form.setFieldsValue({
      ...value.value
    });
  }, [form, forms, value]);

  return (
    <Modal footer={null} visible={visible} onCancel={onCancel} title={typeof value !== 'undefined' ? "Edit Data" : "Tambah Data"}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {
          forms.map(form => (
            form.properties.map(prop => (
              <Item label={prop.field} name={prop.field} rules={[{ required: true, message: `Masukkan ${prop.field}` }]} key={`${prop.field}`}>
                {
                  prop.type === 'text' ?
                    <Input prefix={loading && <LoadingOutlined />} placeholder={prop.field} />
                    :
                    <InputNumber min={0} style={{ width: '100%' }} placeholder={prop.field} />
                }
              </Item>
            ))
          ))
        }
        <Item>
          <Button block type="primary" loading={loading} htmlType="submit">Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
})

export default AddValue
