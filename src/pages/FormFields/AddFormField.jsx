import { useCallback, useMemo, useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Row, Col } from "antd"
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

const { useForm, Item, List, ErrorList } = Form;

const AddFormField = ({ visible, onCancel, onSubmit, field }) => {
  const [loading, toggleLoading] = useState(false);
  const [form] = useForm();
  const isEdit = useMemo(() => typeof field !== 'undefined', [field]);
  const [formFields, setFormFields] = useState([]);

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['properties']);
  }, [form]);

  const onFinish = useCallback((val) => {
    onSubmit(val, clearForm)
  }, [onSubmit, clearForm]);

  useEffect(() => {
    if (typeof field !== 'undefined') {
      form.setFieldsValue({ properties: field.properties });
      setFormFields(field.properties);
    }
  }, [field, form]);

  const onValuesChange = useCallback((value, formValues) => {
    setFormFields(formValues.properties);
  }, []);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title={isEdit ? `Edit Form` : `Tambah field`}
      afterClose={clearForm}
      confirmLoading={loading}
      width="60%"
    >
      <Form onValuesChange={onValuesChange} onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
        <List
          name="properties"
          rules={[
            {
              validator: async (_, props) => {
                if (!props || props.length < 1) {
                  return Promise.reject(new Error('Tambah form'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Row align="middle" key={field.fieldKey} gutter={[16, 16]}>
                  <Col md={8}>
                    <Item label="Nama field" name={[field.name, "field"]} fieldKey={[field.fieldKey, "field"]} rules={[{ required: true, message: 'Masukkan nama field' }]}>
                      <Input prefix={loading && <LoadingOutlined />} placeholder="Nama Field" />
                    </Item>
                  </Col>
                  <Col md={6}>
                    <Item label="Tipe field" name={[field.name, "type"]} fieldKey={[field.fieldKey, "type"]} rules={[{ required: true, message: 'Pilih tipe field' }]}>
                      <Select loading={loading} placeholder="Tipe Field">
                        <Select.Option value="text">Teks</Select.Option>
                        <Select.Option value="number">Numerik</Select.Option>
                        <Select.Option value="option">Pilihan</Select.Option>
                      </Select>
                    </Item>
                  </Col>
                  {formFields[index].type === "option" &&
                    <Col md={8}>
                      <Item label="Nilai Pilihan" name={[field.name, "options"]} extra="Tiap nilai dipisah dengan koma (,)" fieldKey={[field.fieldKey, "options"]} rules={[{ required: true, message: 'Masukkan nilai pilihan' }]}>
                        <Input placeholder="Nilai pilihan" />
                      </Item>
                    </Col>
                  }
                  <Col md={2}>
                    <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => remove(field.name)} />
                  </Col>
                </Row>
              ))}
              <Item>
                <Button loading={loading} block onClick={() => add({ field: "", type: "text" })} >Tambah Field</Button>
                <ErrorList errors={errors} />
              </Item>
            </>
          )}
        </List>
        <Item>
          <Button loading={loading} type="primary" htmlType="submit">Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
}

export default AddFormField
