import { useCallback, useState, useEffect } from 'react';
import { Modal, InputNumber, Form, Button, Cascader } from 'antd'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const { useForm, Item } = Form;

const AddSimulationScore = ({ visible, onCancel, onSubmit, score }) => {
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

  useEffect(() => {
    if (typeof score !== 'undefined') {
      const { capacity, registrant, selection_passed, new_reguler_student, new_transfer_student, reguler_student, transfer_student, study_program_id, department_id } = score;
      form.setFieldsValue({ capacity, registrant, selection_passed, new_reguler_student, new_transfer_student, reguler_student, transfer_student, study_program_id: [department_id, study_program_id] });
    }
  }, [score, form]);

  const resetForm = useCallback(() => {
    toggleLoading(false);
    form.resetFields(['capacity', 'registrant', 'selection_passed', 'new_reguler_student', 'new_transfer_student', 'reguler_student', 'transfer_student', 'study_program_id']);
  }, [form])

  const onFinish = useCallback((val) => {
    toggleLoading(true);
    onSubmit(val, resetForm);
  }, [onSubmit, resetForm]);

  const filterCascader = useCallback((inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }, []);

  return (
    <Modal style={{ top: 15 }} afterClose={resetForm} visible={visible} title="Tambah Nilai Simulasi" onCancel={onCancel} footer={null}>
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
        <Item name="capacity" label="Daya Tampung" rules={[{ required: true, message: 'Masukkan nilai daya tampung' }]} >
          <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Daya tampung" />
        </Item>
        <Item label="Jumlah Calon Mahasiswa">
          <Item name="registrant" label="Pendaftar" rules={[{ required: true, message: 'Masukkan nilai pendaftar' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Pendaftar" />
          </Item>
          <Item name="selection_passed" label="Lulus Seleksi" rules={[{ required: true, message: 'Masukkan nilai lulus seleksi' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Lulus seleksi" />
          </Item>
        </Item>
        <Item label="Jumlah Mahasiswa Baru">
          <Item name="new_reguler_student" label="Reguler" rules={[{ required: true, message: 'Masukkan nilai reguler' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Reguler" />
          </Item>
          <Item name="new_transfer_student" label="Transfer" rules={[{ required: true, message: 'Masukkan nilai transfer' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Transfer" />
          </Item>
        </Item>
        <Item label="Jumlah Mahasiswa (Student Body)">
          <Item name="reguler_student" label="Reguler" rules={[{ required: true, message: 'Masukkan nilai regulter' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Reguler" />
          </Item>
          <Item name="transfer_student" label="Transfer" rules={[{ required: true, message: 'Masukkan nilai transfer' }]} >
            <InputNumber min={0} style={{ width: '100%' }} disabled={loading} placeholder="Transfer" />
          </Item>
        </Item>
        <Item>
          <Button loading={loading} disabled={loading} block type="primary" htmlType="submit">Simpan</Button>
        </Item>
      </Form>
    </Modal>
  )
}

export default AddSimulationScore
