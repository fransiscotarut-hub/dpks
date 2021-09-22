import { memo, useEffect, useCallback, useState, useMemo } from "react"
import { Modal, Form, Input, InputNumber } from 'antd'
import useModels from "hooks/useModels";
import { useLocation } from "react-router";
import { parse } from "query-string";
import useErrorCatcher from "hooks/useErrorCatcher";

const { useForm, Item } = Form;

const AddValue = memo(({ visible, onCancel, onSubmit }) => {
  const [forms, setForms] = useState([]);
  const { models: { DocumentField } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { search } = useLocation();
  const { form: document_id } = useMemo(() => (parse(search)), [search]);
  const [form] = useForm();

  const getForms = useCallback(() => {
    DocumentField.collection({
      attributes: ['name', 'field_type'],
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
    getForms()
  }, [getForms]);

  return (
    <Modal visible={visible} onCancel={onCancel} title="Tambah Data">
      <Form form={form} layout="vertical">
        {
          forms.map(form => (
            <Item label={form.name} rules={[{ required: true, message: `Masukkan ${form.name}` }]} key={`${form.id}`}>
              {
                form.field_type === 'string' ?
                  <Input placeholder={form.name} />
                  :
                  <InputNumber style={{ width: '100%' }} placeholder={form.name} />
              }
            </Item>
          ))
        }
      </Form>
    </Modal>
  )
})

export default AddValue
