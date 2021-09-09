import { useCallback, useMemo, useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button } from "antd"
import { LoadingOutlined } from '@ant-design/icons';

const { useForm, Item } = Form;

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
    typeof field !== 'undefined' && form.setFieldsValue({ name: field.name, field_type: field.field_type });
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
        <Item name="name" label="Nama field" rules={[{ required: true, message: 'Masukkan nama field' }]}>
          <Input prefix={loading && <LoadingOutlined spin />} placeholder="Nama field" />
        </Item>
        <Item name="field_type" label="Tipe field" rules={[{ required: true, message: 'Pilih tipe field' }]}>
          <Select loading={loading} allowClear placeholder="Pilih tipe field">
            <Select.Option value="string">Teks</Select.Option>
            <Select.Option value="number">Angka</Select.Option>
          </Select>
        </Item>
        <Item>
          <Button loading={loading} type="primary" htmlType="submit">Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
}

export default AddFormField
