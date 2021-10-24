import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, Divider, message, Popconfirm, Space, Table, Tooltip } from 'antd';
import { parse } from 'query-string';
import { useLocation } from 'react-router';
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';
import AddScore from './AddScore';
import { DeleteOutlined, EditOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import FormScore from './FormScore';

const StudyProgramScores = () => {
  const [modal, toggleModal] = useState(false);
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState(undefined);
  const [loading, toggleLoading] = useState(true);
  const { errorCatch } = useErrorCatcher();
  const { models: { StudyProgramScore } } = useModels();
  const { search } = useLocation();
  const { form } = useMemo(() => parse(search), [search]);
  const { user } = useAuth();

  const getScores = useCallback(() => {
    toggleLoading(true);
    StudyProgramScore.collection({
      attributes: ['score_type', 'magister', 'doctor', 'profession', 'lecturer', 'chief_lecturer', 'professor'],
      where: {
        score_type: form,
        ...(
          ['program_chief', 'program_team'].includes(user.type) ?
            { study_program_id: user.study_program_id }
            :
            {}
        )
      },
      include: [{
        model: 'StudyProgram',
        attributes: ['name', 'id'],
        include: [{
          model: 'Department',
          attributes: ['id', 'name']
        }],
        ...(
          user.type === 'chief' ?
            { department_id: user.department_id }
            :
            {}
        )
      }]
    }).then(resp => {
      setScores(resp.rows);
      toggleLoading(false);
    }).catch(errorCatch)
  }, [StudyProgramScore, errorCatch, form, user]);

  useEffect(() => {
    getScores();
  }, [getScores]);

  const createScore = useCallback((val, cb) => {
    StudyProgramScore.create({
      ...val, study_program_id: val.study_program_id[1], score_type: form
    }).then(resp => {
      message.success('Nilai berhasil disimpan');
      console.log(resp);
      getScores();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [StudyProgramScore, errorCatch, form, getScores]);

  const updateScore = useCallback((val, cb) => {
    score.update({
      ...val, study_program_id: val.study_program_id[1],
    }).then(resp => {
      message.success('Nilai berhasil disimpan');
      console.log(resp);
      getScores();
      cb();
      toggleModal(false);
      setScore(undefined);
    }).catch(errorCatch);
  }, [score, errorCatch, getScores]);

  const deleteScore = useCallback((score) => {
    score.delete().then(resp => {
      message.success('Nilai berhasil dihapus');
      console.log(resp);
      getScores();
    }).catch(errorCatch);
  }, [errorCatch, getScores]);

  const columns = useMemo(() => [
    {
      title: 'No.',
      key: 'index',
      render: (val, row, index) => (index + 1),
      align: 'center',
    },
    {
      title: 'Unit Pengelola (Departemen/Jurusan)',
      key: 'department',
      render: (row) => (`${row.study_program.department.name} / ${row.study_program.name}`),
      align: 'center',
    },
    {
      title: 'Pendidikan Tertinggi',
      key: 'education',
      align: 'center',
      children: [
        {
          title: 'Doktor / Doktor Terapan / Subspesialis',
          dataIndex: 'doctor',
          key: 'doctor',
          align: 'center',
        },
        {
          title: 'Magister / Magister Terapan / Spesialis',
          dataIndex: 'magister',
          key: 'magister',
          align: 'center',
        },
        {
          title: 'Profesi',
          dataIndex: 'profession',
          key: 'profession',
          align: 'center',
        },
      ]
    },
    {
      title: 'Jumlah',
      key: 'data_total',
      render: (row) => (row.doctor + row.magister + row.profession),
      align: 'center',
    },
    ...(
      form === '3.a.1.2' ?
        [
          {
            title: 'NDGB',
            dataIndex: 'professor',
            align: 'center',
            key: 'professor'
          },
          {
            title: 'NDLK',
            dataIndex: 'chief_lecturer',
            align: 'center',
            key: 'chief_lecturer'
          },
          {
            title: 'NDL',
            dataIndex: 'lecturer',
            align: 'center',
            key: 'lecturer'
          },
        ]
        :
        []
    ),
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row) => (
        <Space size={2} split={<Divider type="vertical" />}>
          <Tooltip title={`Edit nilai`}>
            <Button onClick={() => {
              setScore(row);
              toggleModal(true);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title={`Hapus nilai`}>
            <Popconfirm title={`Apakah Anda ingin menghapus nilai?`}
              okText="Hapus"
              okButtonProps={{ type: 'primary', danger: true }}
              onConfirm={() => deleteScore(row)}
              placement="topRight"
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ], [form, deleteScore]);

  const renderSummary = useCallback((pageData) => {
    const dataLength = pageData.length;
    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} align="center" colSpan={2}>Jumlah</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">{
            dataLength > 1 ?
              pageData.map(data => data.doctor).reduce((a, b) => (a + b))
              :
              dataLength > 0 ?
                pageData[0].doctor
                :
                0
          }</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">{
            dataLength > 1 ?
              pageData.map(data => data.magister).reduce((a, b) => (a + b))
              :
              dataLength > 0 ?
                pageData[0].magister
                :
                0
          }</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">{
            dataLength > 1 ?
              pageData.map(data => data.profession).reduce((a, b) => (a + b))
              :
              dataLength > 0 ?
                pageData[0].profession
                :
                0
          }</Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="center">{
            dataLength > 1 ?
              pageData.map(data => (data.profession + data.doctor + data.magister)).reduce((a, b) => (a + b))
              :
              dataLength > 0 ?
                pageData[0].profession + pageData[0].doctor + pageData[0].magister
                :
                0
          }</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    )
  }, []);

  return (
    <div>
      {!['vice_director', 'director', 'chief'].includes(user.type) && <>
        <Button onClick={() => toggleModal(true)}>Tambah Data Simulasi</Button>
        <AddScore score={score} visible={modal} onCancel={() => {
          toggleModal(false);
          setScore(undefined);
        }} onSubmit={typeof score !== 'undefined' ? updateScore : createScore} />
      </>}
      <Table
        size="small"
        dataSource={scores}
        pagination={false}
        rowKey={item => `${item.id}`}
        columns={columns}
        loading={{ spinning: loading, indicator: <Loading3QuartersOutlined />, tip: `Mengambil data form ${form}`, size: 'large' }}
        bordered
        style={{ marginTop: 12 }}
        summary={renderSummary}
      />
      {scores.length > 0 && <FormScore key={scores.length} />}
    </div>
  )
}

export default StudyProgramScores
