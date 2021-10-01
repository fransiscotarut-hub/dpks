import { useCallback, useState, useEffect } from 'react';
import { Modal, InputNumber, Form, Button, Cascader } from 'antd'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const { useForm, Item } = Form;

const AddScore = ({ visible, onCancel, onSubmit }) => {
  const [form] = useForm();
  const [loading, toggleLoading] = useState(false);
  const [departements, setDepartments] = useState([]);
  const { models: { Department } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getDepartments = useCallback(() => {
    Department.collection({
      attributes: ['name'],
      include: [{
        model: 'StudyProgram',
        attributes: ['name', 'id'],
      }]
    }).then(resp => {
      setDepartments(resp.rows);
    }).catch(errorCatch);
  }, [Department, errorCatch]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const resetForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['doctor', 'magister', 'profession', 'study_program_id']);
  }, [form])

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, resetForm);
  }, [onSubmit, resetForm]);

  const filterCascader = useCallback((inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }, [])

  return (
    <Modal visible={visible} title="Tambah Nilai Simulasi" onCancel={onCancel} footer={null}>
      <Form initialValues={{ doctor: 0, magister: 0, profession: 0 }} onFinish={onFinish} form={form} layout="vertical">
        <Item name="study_program_id" label="Program Studi" rules={[{ required: true, message: 'Pilih program studi' }]}>
          <Cascader placeholder="Program Studi" options={
            departements.map(department => ({
              label: department.name,
              value: department.id,
              children: department.study_programs.map(program => ({
                label: program.name,
                value: program.id
              }))
            }))
          } showSearch={filterCascader} />
        </Item>
        <Item name="doctor" label="Doktor / Doktor Terapan / Subspesialis" rules={[{ required: true, message: 'Masukkan nilai doktor / doktor terapan / subspesialis' }]} >
          <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Nilai doktor / doktor terapan / subspesialis" />
        </Item>
        <Item name="magister" label="Milai Magister / Magister Terapan / Spesialis" rules={[{ required: true, message: 'Masukkan nilai magister / magister terapan / spesialis' }]} >
          <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Nilai magister / magister terapan / spesialis" />
        </Item>
        <Item name="profession" label="Nilai Profesi" rules={[{ required: true, message: 'Masukkan nilai profesi' }]} >
          <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Nilai profesi" />
        </Item>
        <Item>
          <Button loading={loading} disabled={loading} block type="primary" htmlType="submit">Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
}

export default AddScore
