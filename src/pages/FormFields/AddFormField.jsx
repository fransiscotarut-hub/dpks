import { useCallback, useMemo, useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Space, Divider } from "antd"
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

const { useForm, Item, List, ErrorList } = Form;

const AddFormField = ({ visible, onCancel, onSubmit, field }) => {
  const [loading, toggleLoading] = useState(false);
  const [form] = useForm();
  const isEdit = useMemo(() => typeof field !== 'undefined', [field]);

  const clearForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['name', 'field_type']);
  }, [form]);

  const onFinish = useCallback((val) => {
    onSubmit(val, clearForm)
  }, [onSubmit, clearForm]);

  useEffect(() => {
    typeof field !== 'undefined' && form.setFieldsValue({ properties: field.properties });
  }, [field, form])

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title={isEdit ? `Edit ${field.name}` : `Tambah field`}
      afterClose={clearForm}
      confirmLoading={loading}
    >
      <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
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
                <Space key={field.key} size={2} align="center" split={<Divider type="vertical" />}>
                  <Item label="Nama field" name={[field.name, "field"]} fieldKey={[field.fieldKey, "field"]} rules={[{ required: true, message: 'Masukkan nama field' }]}>
                    <Input prefix={loading && <LoadingOutlined />} placeholder="Nama Field" />
                  </Item>
                  <Item label="Tipe field" name={[field.name, "type"]} fieldKey={[field.fieldKey, "type"]} rules={[{ required: true, message: 'Pilih tipe field' }]}>
                    <Select loading={loading} placeholder="Tipe Field">
                      <Select.Option value="text">Teks</Select.Option>
                      <Select.Option value="number">Numerik</Select.Option>
                    </Select>
                  </Item>
                  <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Item>
                <Button loading={loading} block onClick={() => add()} >Tambah Field</Button>
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
