import { useState, useCallback, useEffect, useMemo } from 'react'
import { Typography, Table, Space, Tooltip, Button, message, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import AddUser from './AddUser'
import useModels from 'hooks/useModels';
import useErrorCatcher from 'hooks/useErrorCatcher';

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [users, setUsers] = useState({ rows: [], count: 0 });
  const [user, setUser] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const { models: { User } } = useModels();
  const { errorCatch } = useErrorCatcher();

  document.title = "Dashboard - Pengguna";

  const getUsers = useCallback(() => {
    toggleLoading(true);
    const offset = (page - 1) * limit;
    User.collection({
      attributes: ['name', 'username', 'type'],
      limit,
      offset
    }).then(resp => {
      toggleLoading(false);
      setUsers(resp);
    }).catch(errorCatch);
  }, [page, limit, User, errorCatch]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const deleteUser = useCallback((user) => {
    user.delete().then(resp => {
      message.success(`Pengguna ${resp.name} berhasil dihapus`);
      getUsers();
    }).catch(errorCatch);
  }, [errorCatch, getUsers]);

  const columns = useMemo(() => ([
    {
      title: 'Nama',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Username',
      key: 'username',
      dataIndex: 'username'
    },
    {
      title: 'Tipe Pengguna',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: 'Edit | Hapus',
      key: 'action',
      render: (row) => (
        <Space>
          <Tooltip title={`Edit ${row.name}`}>
            <Button onClick={() => {
              toggleModal(true);
              setUser(row);
            }} size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title={`Hapus ${row.name}`}>
            <Popconfirm
              title={`Apakah Anda yakin ingin menghapus ${row.name}?`}
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, type: 'primary' }}
              onConfirm={() => deleteUser(row)}
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]), [deleteUser]);

  const createUser = useCallback((val, cb) => {
    User.create(val).then(resp => {
      message.success(`Pengguna ${resp.name} berhasil ditambah`);
      getUsers();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [User, getUsers, errorCatch]);

  return (
    <div>
      <Typography.Title level={5}>Pengguna</Typography.Title>
      <AddUser visible={modal} onCancel={() => {
        toggleModal(false);
        setUser(undefined);
      }} onOpen={() => toggleModal(true)} onSubmit={createUser} user={user} />
      <Table
        dataSource={users.rows}
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
