import { useState, useCallback, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Input, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 'program_chief' => kaprodi , 'chief' => kajur, 'vice_director' => wadir, 'director' => direk, 'head_team' => tim institusi, 'program_team' => tim prodi, 'administrator' => admin

const { useForm, Item } = Form;

const AddStudyProgram = ({ visible, onCancel, onSubmit, onOpen, studyProgram }) => {
  const [loading, toggleLoading] = useState(false);
  const [form] = useForm();

  const isEdit = useMemo(() => (typeof studyProgram !== 'undefined'), [studyProgram]);

  const clearForm = useCallback(() => {
    form.resetFields(['name', 'diploma', 'type']);
    toggleLoading(false);
  }, [form]);

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, clearForm);
  }, [onSubmit, clearForm]);

  useEffect(() => {
    (typeof studyProgram !== 'undefined') && form.setFieldsValue({
      name: studyProgram.name,
      type: studyProgram.type,
      diploma: studyProgram.diploma
    });
  }, [studyProgram, form]);

  return (
    <>
      <Button style={{ marginBottom: 12 }} onClick={onOpen}>Tambah Program Studi</Button>
      <Modal afterClose={clearForm} visible={visible} onCancel={onCancel} title={isEdit ? `Edit ${studyProgram.name}` : `Tambah Program Studi`} footer={null}>
        <Form onFinish={loading ? undefined : onFinish} form={form} layout="vertical">
          <Item name="name" rules={[{ required: true, message: 'Masukkan nama program studi' }]} label="Program Studi">
            <Input prefix={loading && <LoadingOutlined spin />} placeholder="Program Studi" />
          </Item>
          <Item name="type" rules={[{ required: true, message: 'Pilih tipe program studi' }]} label="Tipe Program Studi">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="technology" >Kelompok Sains Teknologi</Radio.Button>
              <Radio.Button value="humaniora" >Kelompok Sosial Humaniora</Radio.Button>
            </Radio.Group>
          </Item>
          <Item name="diploma" rules={[{ required: true, message: 'Pilih diploma' }]} label="Program Diploma">
            <Radio.Group>
              <Radio value="3" >Diploma 3</Radio>
              <Radio value="4" >Diploma 4</Radio>
            </Radio.Group>
          </Item>
          <Item>
            {isEdit ?
              <Button htmlType="submit" type="primary" loading={loading}>Simpan</Button>
              :
              <Button htmlType="submit" loading={loading}>Tambah Program Studi</Button>
            }
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddStudyProgram
