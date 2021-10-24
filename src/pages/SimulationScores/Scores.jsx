import { useMemo, useState, useEffect, useCallback } from 'react'
import { Button, Divider, message, Space, Table, Tooltip, Cascader, Row, Col, Result, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons'
import AddSimulationScore from './AddSimulationScore'
import useModels from 'hooks/useModels'
import useErrorCatcher from 'hooks/useErrorCatcher';
import SimulationScore from './SimulationScore'
import useAuth from 'hooks/useAuth'

const Scores = () => {
  const [modal, toggleModal] = useState(false);
  const [scores, setScores] = useState({ rows: [], count: 0 });
  const [selectedScore, setSelectedScore] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [studyProgramScores, setStudyProgramScores] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [loading, toggleLoading] = useState(true);
  const { models: { SimulationScore: SimulationScoreModel, Department, StudyProgramScore } } = useModels();
  const { errorCatch } = useErrorCatcher();
  const { user } = useAuth();

  const getScores = useCallback(() => {
    if (selectedDepartment.length > 1 || ['program_chief', 'program_team', 'chief'].includes(user.type)) {
      toggleLoading(true);
      const offset = (page - 1) * limit;
      SimulationScoreModel.collection({
        attributes: ['capacity', 'reguler_student', 'transfer_student', 'new_reguler_student', 'new_transfer_student', 'registrant', 'selection_passed', 'study_program_id', 'department_id'],
        include: [
          {
            model: 'Department',
            attributes: ['name']
          },
          {
            model: 'StudyProgram',
            attributes: ['name']
          },
        ],
        offset,
        limit,
        where: {
          ...(
            ['program_chief', 'program_team'].includes(user.type) ?
              {
                study_program_id: user.study_program_id
              }
              :
              { study_program_id: selectedDepartment[1] }
          )
        }
      }).then(resp => {
        setScores(resp);
        toggleLoading(false);
      }).catch(errorCatch);
    }
  }, [SimulationScoreModel, errorCatch, limit, page, selectedDepartment, user]);

  const getStudyProgramScores = useCallback(() => {
    if (selectedDepartment.length > 1 || ['chief', 'program_chief', 'program_team'].includes(user.type)) {
      StudyProgramScore.collection({
        attributes: ['score_type', 'magister', 'doctor', 'profession'],
        where: {
          score_type: '3.a.1',
          ...(
            ['program_chief', 'program_team'].includes(user.type) ?
              {
                study_program_id: user.study_program_id
              }
              :
              { study_program_id: selectedDepartment[1] }
          )
        },
        include: [{
          model: 'StudyProgram',
          attributes: ['name', 'id'],
          include: [{
            model: 'Department',
            attributes: ['id', 'name']
          }],
          where: {
            ...(
              user.type === 'chief' ?
                { department_id: user.department_id }
                :
                {}
            )
          }
        }]
      }).then(resp => {
        setStudyProgramScores(resp.rows);
      }).catch(errorCatch)
    }
  }, [StudyProgramScore, errorCatch, selectedDepartment, user]);

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
    getScores();
    getDepartments();
    getStudyProgramScores();
  }, [getScores, getDepartments, getStudyProgramScores]);

  const sumScore = useMemo(() => (
    studyProgramScores.length > 1 ?
      studyProgramScores.map(score => score.magister + score.doctor + score.profession).reduce((a, b) => (a + b))
      :
      studyProgramScores.length > 0 ?
        studyProgramScores.map(score => score.magister + score.doctor + score.profession)[0]
        :
        0
  ), [studyProgramScores]);

  const sumStudentScore = useMemo(() => {
    return (
      scores.rows.length > 1 ?
        scores.rows.map(data => data.transfer_student + data.reguler_student + data.new_reguler_student + data.new_reguler_student + data.registrant + data.selection_passed).reduce((a, b) => (a + b))
        :
        scores.rows.length > 0 ?
          scores.rows.map(data => data.transfer_student + data.reguler_student + data.new_reguler_student + data.new_reguler_student + data.registrant + data.selection_passed)
          :
          0
    )
  }, [scores])

  const createScore = useCallback((val, cb) => {
    if (!['vice_director', 'director', 'chief'].includes(user.type)) {
      SimulationScoreModel.create({
        ...val,
        department_id: val.study_program_id[0],
        study_program_id: val.study_program_id[1]
      }).then(resp => {
        console.log(resp);
        message.success("Nilai simulasi berhasil ditambah");
        getScores();
        cb();
        toggleModal(false);
      }).catch(errorCatch);
    }
  }, [SimulationScoreModel, errorCatch, getScores, user]);

  const updateScore = useCallback((val, cb) => {
    selectedScore.update(val).then(resp => {
      console.log(resp);
      message.success('Data berhasil disimpan');
      getScores();
      toggleModal(false);
      setSelectedScore(undefined);
    }).catch(errorCatch)
  }, [selectedScore, getScores, errorCatch]);

  const deleteScore = useCallback((score) => {
    score.delete().then(resp => {
      message.success('Nilai berhasil dihapus');
      getScores();
      console.log(resp);
    }).catch(errorCatch);
  }, [getScores, errorCatch]);

  const columns = useMemo(() => [
    {
      title: 'Tahun Akademik',
      key: 'year',
      render: (value, row, index) => (`TS-${index + 1}`),
      align: 'center'
    },
    {
      title: 'Daya Tampung',
      key: 'capacity',
      dataIndex: 'capacity',
      align: 'center'
    },
    {
      title: 'Jumlah Calon Mahasiswa',
      key: 'registrants',
      align: 'center',
      children: [
        {
          title: 'Pendaftar',
          align: 'center',
          key: 'registrant',
          dataIndex: 'registrant',
        },
        {
          title: 'Lulus Seleksi',
          align: 'center',
          key: 'selection_passed',
          dataIndex: 'selection_passed',
        },
      ]
    },
    {
      title: 'Jumlah Mahasiswa Baru',
      key: 'new_students',
      align: 'center',
      children: [
        {
          title: 'Reguler',
          align: 'center',
          key: 'new_reguler_student',
          dataIndex: 'new_reguler_student',
        },
        {
          title: 'Transfer',
          align: 'center',
          key: 'new_transfer_student',
          dataIndex: 'new_transfer_student',
        },
      ]
    },
    {
      title: 'Jumlah Mahasiswa (Student Body)',
      key: 'students',
      align: 'center',
      children: [
        {
          title: 'Reguler',
          align: 'center',
          key: 'reguler_student',
          dataIndex: 'reguler_student',
        },
        {
          title: 'Transfer',
          align: 'center',
          key: 'transfer_student',
          dataIndex: 'transfer_student',
        },
      ]
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      align: 'center',
      render: (val, row, index) => (
        <Space size={2} split={<Divider type="vertical" />}>
          <Tooltip title={`Edit TS-${index + 1}`}>
            <Button onClick={() => {
              setSelectedScore(row);
              toggleModal(true);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip placement="topRight" title={`Hapus TS-${index + 1}`}>
            <Popconfirm placement="topRight" title={`Apakah Anda yakin ingin menghapus data TS-${index + 1}?`}
              okText="Hapus"
              okButtonProps={{ danger: true, type: 'primary' }}
              cancelText="Batal"
              onConfirm={() => deleteScore(row)}
            >
              <Button size="small" danger type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ], [deleteScore]);

  const filterCascader = useCallback((inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }, []);

  const renderSummary = useCallback((pageData) => {
    return (
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell align="center" colSpan={2}>Jumlah</Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            {
              pageData.length > 1 ?
                pageData.map(data => data.registrant).reduce((a, b) => (a + b))
                :
                pageData.map(data => data.registrant)
            }
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            {
              pageData.length > 1 ?
                pageData.map(data => data.selection_passed).reduce((a, b) => (a + b))
                :
                pageData.map(data => data.selection_passed)
            }
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            {
              pageData.length > 1 ?
                pageData.map(data => data.new_reguler_student).reduce((a, b) => (a + b))
                :
                pageData.map(data => data.new_reguler_student)
            }
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            {
              pageData.length > 1 ?
                pageData.map(data => data.new_transfer_student).reduce((a, b) => (a + b))
                :
                pageData.map(data => data.new_transfer_student)
            }
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} align="center">
            {
              pageData.length > 1 ?
                pageData.map(data => data.transfer_student + data.reguler_student).reduce((a, b) => (a + b))
                :
                pageData.map(data => data.transfer_student + data.reguler_student)
            }
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row>
          <Table.Summary.Cell align="center" colSpan={2}>Total</Table.Summary.Cell>
          <Table.Summary.Cell align="center" colSpan={6}>
            {sumStudentScore}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    )
  }, [sumStudentScore]);

  useEffect(() => {
    if (user.type === 'chief') {
      setSelectedDepartment([user.department_id]);
    } else if (['program_chief', 'program_team'].includes(user.type)) {
      setSelectedDepartment([user.department_id, user.study_program_id]);
    }
  }, [user])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col md={6}>
          <Cascader placeholder="Program Studi" disabled={['chief', 'program_chief', 'program_team'].includes(user.type)}
            value={selectedDepartment}
            onChange={setSelectedDepartment} options={
              departments.map(department => ({
                label: department.name,
                value: department.id,
                children: department.study_programs.map(program => ({
                  label: program.name,
                  value: program.id
                }))
              }))
            } style={{ width: '100%' }} showSearch={filterCascader} />
        </Col>
        {!['vice_director', 'director', 'chief'].includes(user.type) &&
          <Col>
            <Button onClick={() => toggleModal(true)} >Tambah Data Simulasi</Button>
          </Col>}
      </Row>
      {!['vice_director', 'director', 'chief'].includes(user.type) && <AddSimulationScore score={selectedScore} visible={modal} onSubmit={
        typeof selectedScore !== 'undefined' ?
          updateScore
          :
          createScore
      } onCancel={() => {
        toggleModal(false);
        setSelectedScore(undefined);
      }} />}
      {(selectedDepartment.length > 1 || ['chief', 'program_chief', 'program_team'].includes(user.type)) ?
        <>
          <Table
            style={{ marginTop: 12 }}
            dataSource={scores.rows}
            columns={columns}
            bordered
            size='small'
            loading={{ spinning: loading, tip: 'Mengambil data simulasi', indicator: <LoadingOutlined />, size: 'large' }}
            pagination={{ current: page, onChange: setPage, pageSize: limit, defaultPageSize: limit, onShowSizeChange: (page, size) => setLimit(size), total: scores.count }}
            summary={scores.rows.length > 0 ? renderSummary : undefined}
          />
          <SimulationScore key={scores.rows.length} studyProgramScore={sumScore} studentScore={sumStudentScore} study_program_id={selectedDepartment} />
        </>
        :
        <Result status="info" title="Pilih Program Studi" subTitle="Pilih jurusan dan program studi pada dropdown" extra={
          <Cascader placeholder="Program Studi" disabled={['chief', 'program_chief', 'program_team'].includes(user.type)}
            value={selectedDepartment}
            onChange={setSelectedDepartment} options={
              departments.map(department => ({
                label: department.name,
                value: department.id,
                children: department.study_programs.map(program => ({
                  label: program.name,
                  value: program.id
                }))
              }))
            } showSearch={filterCascader} />
        } />
      }
    </div>
  )
}

export default Scores
