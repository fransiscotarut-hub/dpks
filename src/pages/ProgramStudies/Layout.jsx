import { useState, useCallback, useEffect, useMemo } from 'react'
import { Table, Space, Tooltip, Button, message, Popconfirm, PageHeader } from 'antd'
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';
import AddStudyProgram from './AddStudyProgram'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState({ rows: [], count: 0 });
  const [studyProgram, setStudyProgram] = useState(undefined);
  const [department, setDepartment] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const { id } = useParams();
  const { push } = useHistory()
  const { models: { StudyProgram, Department } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Program Studi";

  const getDepartment = useCallback(() => {
    Department.single(id).then(resp => {
      setDepartment(resp);
    }).catch(errorCatch);
  }, [Department, errorCatch, id]);

  const getStudyPrograms = useCallback(() => {
    toggleLoading(true);
    const offset = (page - 1) * limit;
    StudyProgram.collection({
      attributes: ['name', 'type', 'diploma', 'department_id'],
      limit,
      offset,
      where: {
        department_id: id
      }
    }).then(resp => {
      toggleLoading(false);
      setStudyPrograms(resp);
    }).catch(e => errorCatch(e));
  }, [page, limit, StudyProgram, errorCatch, id]);

  useEffect(() => {
    getStudyPrograms();
    getDepartment()
  }, [getStudyPrograms, getDepartment]);

  const deleteStudyProgram = useCallback((studyProgram) => {
    studyProgram.delete().then(resp => {
      message.success(`Program Studi ${resp.name} berhasil dihapus`);
      getStudyPrograms();
    }).catch(errorCatch);
  }, [errorCatch, getStudyPrograms]);

  const columns = useMemo(() => ([
    {
      title: 'Program Studi',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Program Diploma',
      key: 'diploma',
      dataIndex: 'diploma',
      render: (val) => `Program Diploma ${val}`
    },
    {
      title: 'Kelompok',
      key: 'type',
      dataIndex: 'type',
      render: (val) => val === 'technology' ? 'Kelompok Sains Teknologi' : `Kelompok Sosial Humaniora`
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row) => (
        <Space>
          <Tooltip title={`Edit ${row.name}`}>
            <Button onClick={() => {
              toggleModal(true);
              setStudyProgram(row);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title={`Hapus ${row.name}`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus ${row.name}?`}
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, type: 'primary' }}
              onConfirm={() => deleteStudyProgram(row)}
              placement="topRight"
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]), [deleteStudyProgram]);

  const createStudyProgram = useCallback((val, cb) => {
    StudyProgram.create({ ...val, department_id: id }).then(resp => {
      message.success(`Program Studi ${resp.name} berhasil ditambah`);
      getStudyPrograms();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [StudyProgram, getStudyPrograms, errorCatch, id]);

  const updateStudyProgram = useCallback((val, cb) => {
    if (typeof studyProgram !== 'undefined') {
      studyProgram.update(val).then(resp => {
        message.success(`Program studi ${studyProgram.name} berhasil diubah menjadi ${resp.name}`);
        getStudyPrograms();
        cb();
        toggleModal(false);
      }).catch(errorCatch);
    }
  }, [studyProgram, errorCatch, getStudyPrograms]);

  return (
    <div>
      <PageHeader title={typeof department !== 'undefined' ? department.name : `Program Studi`} onBack={() => push('/dashboard/jurusan')} />
      <AddStudyProgram visible={modal}
        onCancel={() => {
          toggleModal(false);
          setStudyProgram(undefined)
        }}
        onOpen={() => toggleModal(true)}
        onSubmit={typeof studyProgram !== 'undefined' ? updateStudyProgram : createStudyProgram}
        studyProgram={studyProgram}
      />
      <Table
        dataSource={studyPrograms.rows}
        rowKey={item => `${item.id}`}
        columns={columns}
        bordered
        pagination={{ current: page, onChange: setPage, pageSize: limit, onShowSizeChange: (page, size) => setLimit(size), total: studyPrograms.count }}
        loading={{ indicator: <LoadingOutlined spin={loading} />, spinning: loading, tip: 'Mengambil data user' }}
      />
    </div>
  )
}

export default Layout
