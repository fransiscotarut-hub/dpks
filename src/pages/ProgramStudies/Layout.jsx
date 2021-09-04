import { useState, useCallback, useEffect, useMemo } from 'react'
import { Typography, Table, Space, Tooltip, Button, message, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import AddStudyProgram from './AddStudyProgram'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [studtPrograms, setStudyPrograms] = useState({ rows: [], count: 0 });
  const [studyProgram, setStudyProgram] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const { models: { StudyProgram } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Program Studi";

  const getStudyPrograms = useCallback(() => {
    toggleLoading(true);
    const offset = (page - 1) * limit;
    StudyProgram.collection({
      attributes: ['name'],
      limit,
      offset
    }).then(resp => {
      toggleLoading(false);
      setStudyPrograms(resp);
    }).catch(e => errorCatch(e));
  }, [page, limit, StudyProgram, errorCatch]);

  useEffect(() => {
    getStudyPrograms();
  }, [getStudyPrograms]);

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
      getStudyPrograms();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [StudyProgram, getStudyPrograms, errorCatch]);

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
      <Typography.Title level={5}>Program Studi</Typography.Title>
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
        dataSource={studtPrograms.rows}
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
