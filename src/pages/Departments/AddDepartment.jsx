import { useState, useCallback, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 'program_chief' => kaprodi , 'chief' => kajur, 'vice_director' => wadir, 'director' => direk, 'head_team' => tim institusi, 'program_team' => tim prodi, 'administrator' => admin

const { useForm, Item } = Form;

const AddDepartment = ({ visible, onCancel, onSubmit, onOpen, department }) => {
  const [loading, toggleLoading] = useState(false);
  const [form] = useForm();

  const isEdit = useMemo(() => (typeof department !== 'undefined'), [department]);

  const clearForm = useCallback(() => {
    form.resetFields(['name']);
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  useEffect(() => {
    (typeof department !== 'undefined') && form.setFieldsValue({
      name: department.name
    });
  }, [department, form]);

  return (
    <>
      <Button style={{ marginBottom: 12 }} onClick={onOpen}>Tambah Jurusan</Button>
      <Modal afterClose={clearForm} visible={visible} onCancel={onCancel} title={isEdit ? `Edit ${department.name}` : `Tambah Jurusan`} footer={null}>
        <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
          <Item name="name" rules={[{ required: true, message: 'Masukkan nama program studi' }]} label="Jurusan">
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Jurusan" />
          </Item>          
          <Item>
            {isEdit ?
              <Button htmlType="submit" type="primary" loading={loading}>Simpan</Button>
              :
              <Button htmlType="submit" loading={loading}>Tambah Jurusan</Button>
            }
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddDepartment
