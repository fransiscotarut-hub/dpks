import { useState, useCallback, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 'program_chief' => kaprodi , 'chief' => kajur, 'vice_director' => wadir, 'director' => direk, 'head_team' => tim institusi, 'program_team' => tim prodi, 'administrator' => admin

const { useForm, Item } = Form;

const AddDocument = ({ visible, onCancel, onSubmit, onOpen, document }) => {
  const [loading, toggleLoading] = useState(false);
  const [form] = useForm();

  const isEdit = useMemo(() => (typeof document !== 'undefined'), [document]);

  const clearForm = useCallback(() => {
    form.resetFields(['name']);
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  useEffect(() => {
    (typeof document !== 'undefined') && form.setFieldsValue({
      name: document.name
    });
  }, [document, form]);

  return (
    <>
      <Button style={{ marginBottom: 12 }} onClick={onOpen}>Tambah Form</Button>
      <Modal afterClose={clearForm} visible={visible} onCancel={onCancel} title={isEdit ? `Edit ${document.name}` : `Tambah Form`} footer={null}>
        <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
          <Item name="name" rules={[{ required: true, message: 'Masukkan nama form' }]} label="Nama Form">
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Nama Form" />
          </Item>          
          <Item>
            {isEdit ?
              <Button htmlType="submit" type="primary" loading={loading}>Simpan</Button>
              :
              <Button htmlType="submit" loading={loading}>Tambah Form</Button>
            }
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddDocument
