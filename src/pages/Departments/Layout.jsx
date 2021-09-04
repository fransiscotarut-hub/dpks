import { useState, useCallback, useEffect, useMemo } from 'react'
import { Typography, Table, Space, Tooltip, Button, message, Popconfirm } from 'antd'
import { Link, useRouteMatch } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import AddDepartment from './AddDepartment'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [departments, setDepartments] = useState({ rows: [], count: 0 });
  const [department, setDepartment] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const {path} = useRouteMatch();
  const { models: { Department } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Program Studi";

  const getDepartments = useCallback(() => {
    toggleLoading(true);
    const offset = (page - 1) * limit;
    Department.collection({
      attributes: ['name'],
      limit,
      offset
    }).then(resp => {
      toggleLoading(false);
      setDepartments(resp);
    }).catch(e => errorCatch(e));
  }, [page, limit, Department, errorCatch]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const deleteDepartment = useCallback((department) => {
    department.delete().then(resp => {
      message.success(`Program Studi ${resp.name} berhasil dihapus`);
      getDepartments();
    }).catch(errorCatch);
  }, [errorCatch, getDepartments]);

  const columns = useMemo(() => ([
    {
      title: 'Jurusan',
      key: 'name',
      dataIndex: 'name',
      render: (text, row) => (<Link to={`${path}/${row.id}`}>{text}</Link>)
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row) => (
        <Space>
          <Tooltip title={`Edit ${row.name}`}>
            <Button onClick={() => {
              toggleModal(true);
              setDepartment(row);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title={`Hapus ${row.name}`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus ${row.name}?`}
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, type: 'primary' }}
              onConfirm={() => deleteDepartment(row)}
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]), [deleteDepartment, path]);

  const createDepartment = useCallback((val, cb) => {
    Department.create(val).then(resp => {
      message.success(`Jurusan ${resp.name} berhasil ditambah`);
      getDepartments();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [Department, getDepartments, errorCatch]);

  const updateDepartment = useCallback((val, cb) => {
    if (typeof department !== 'undefined') {
      department.update(val).then(resp => {
        message.success(`Jurusan ${department.name} berhasil diubah menjadi ${resp.name}`);
        getDepartments();
        cb();
        toggleModal(false);
      }).catch(errorCatch);
    }
  }, [department, errorCatch, getDepartments]);

  return (
    <div>
      <Typography.Title level={5}>Jurusan</Typography.Title>
      <AddDepartment visible={modal}
        onCancel={() => {
          toggleModal(false);
          setDepartment(undefined)
        }}
        onOpen={() => toggleModal(true)}
        onSubmit={typeof department !== 'undefined' ? updateDepartment : createDepartment}
        department={department}
      />
      <Table
        dataSource={departments.rows}
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
