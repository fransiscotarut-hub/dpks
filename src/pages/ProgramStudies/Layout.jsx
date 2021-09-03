import { useState, useCallback, useEffect, useMemo } from 'react'
import { Typography, Table, Space, Tooltip, Button, message, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import AddUser from './AddUser'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [study_programs, setStudy_programs] = useState({ rows: [], count: 0 });
  const [study_program, setStudy_program] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const { models: { StudyProgram } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Program Studi";

  const getStudy_programs = useCallback(() => {
    toggleLoading(true);
    const offset = (page - 1) * limit;
    StudyProgram.collection({
      attributes: ['name'],
      limit,
      offset
    }).then(resp => {
      toggleLoading(false);
      setStudy_programs(resp);
    }).catch(errorCatch);
  }, [page, limit, StudyProgram, errorCatch]);

  useEffect(() => {
    getStudy_programs();
  }, [getStudy_programs]);

  const deleteStudyProgram = useCallback((study_program) => {
    study_program.delete().then(resp => {
      message.success(`Program Studi ${resp.name} berhasil dihapus`);
      getStudy_programs();
    }).catch(errorCatch);
  }, [errorCatch, getStudy_programs]);

  const columns = useMemo(() => ([
    {
      title: 'Nama',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row) => (
        <Space>
          <Tooltip title={`Edit ${row.name}`}>
            <Button onClick={() => {
              toggleModal(true);
              setStudy_program(row);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title={`Hapus ${row.name}`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus ${row.name}?`}
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, type: 'primary' }}
              onConfirm={() => deleteStudyProgram(row)}
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]), [deleteStudyProgram]);

  const createStudyProgram = useCallback((val, cb) => {
    StudyProgram.create(val).then(resp => {
      message.success(`Program Studi ${resp.name} berhasil ditambah`);
      getStudy_programs();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [StudyProgram, getStudy_programs, errorCatch]);

  return (
    <div>
      <Typography.Title level={5}>Program Studi</Typography.Title>
      <AddUser visible={modal} onCancel={() => {
        toggleModal(false);
        setStudy_programs(undefined);
      }} onOpen={() => toggleModal(true)} onSubmit={createStudyProgram} study_program={study_program} />
      <Table
        dataSource={study_programs.rows}
        rowKey={item => `${item.id}`}
        columns={columns}
        bordered
        pagination={{ current: page, onChange: setPage, pageSize: limit, onShowSizeChange: (page, size) => setLimit(size) }}
        loading={{ indicator: <LoadingOutlined spin={loading} />, spinning: loading, tip: 'Mengambil data user' }}
      />
    </div>
  )
}

export default Layout
