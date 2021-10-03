import { useState, useCallback, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Input, Select, Cascader } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

// 'program_chief' => kaprodi , 'chief' => kajur, 'vice_director' => wadir, 'director' => direk, 'head_team' => tim institusi, 'program_team' => tim prodi, 'administrator' => admin

const { useForm, Item } = Form;

const AddUser = ({ visible, onCancel, onSubmit, onOpen, user }) => {
  const [loading, toggleLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [userType, setUserType] = useState(undefined);
  const { models: { Department } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const [form] = useForm();

  const isEdit = useMemo(() => (typeof user !== 'undefined'), [user]);

  const clearForm = useCallback(() => {
    form.resetFields(['name', 'username', 'password', 'type']);
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  useEffect(() => {
    (typeof user !== 'undefined') && form.setFieldsValue({
      name: user.name,
      username: user.username,
      type: user.type
    });
  }, [user, form]);

  const getDepartments = useCallback(() => {
    Department.collection({
      attributes: ['name'],
      include: [{
        model: 'StudyProgram',
        attributes: ['name', 'id']
      }]
    }).then(resp => {
      setDepartments(resp.rows);
    }).catch(errorCatch);
  }, [Department, errorCatch]);

  useEffect(() => getDepartments(), [getDepartments]);

  return (
    <>
      <Button style={{ marginBottom: 12 }} onClick={onOpen}>Tambah Pengguna</Button>
      <Modal visible={visible} onCancel={onCancel} title={isEdit ? `Edit ${user.name}` : `Tambah Pengguna`} footer={null}>
        <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
          <Item name="name" rules={[{ required: true, message: 'Masukkan nama pengguna' }]} label="Nama">
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Nama" />
          </Item>
          <Item name="username" rules={[{ required: true, message: 'Masukkan username' }]} label="Username">
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Username" />
          </Item>
          <Item name="password" rules={[{ required: !isEdit, message: 'Masukkan password' }]} label="Password">
            <Input.Password prefix={loading && <LoadingOutlined spin />} placeholder="Password" />
          </Item>
          <Item name="type" rules={[{ required: true, message: 'Pilih tipe pengguna' }]} label="Tipe pengguna">
            <Select loading={loading} placeholder="Tipe pengguna" allowClear showSearch optionFilterProp="children">
              <Select.Option value="director">Direktur</Select.Option>
              <Select.Option value="vice_director">Wakil Direktur</Select.Option>
              <Select.Option value="chief">Kepala Jurusan</Select.Option>
              <Select.Option value="program_chief">Kepala Program Studi</Select.Option>
              <Select.Option value="head_team">Tim Akreditasi Institusi</Select.Option>
              <Select.Option value="program_team">Tim Akreditasi Program Studi</Select.Option>
              <Select.Option value="administrator">Administrator</Select.Option>
            </Select>
          </Item>
          <Item name="department" rules={[{ required: true, message: 'Pilih jurusan' }]} label="Jurusan">
            <Select optionFilterProp="children" showSearch loading={loading} placeholder="Jurusan">
              {
                departments.map(department => (
                  <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
                ))
              }
            </Select>
          </Item>
          <Item>
            {isEdit ?
              <Button htmlType="submit" type="primary" loading={loading}>Simpan</Button>
              :
              <Button htmlType="submit" loading={loading}>Tambah Pengguna</Button>
            }
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddUser
