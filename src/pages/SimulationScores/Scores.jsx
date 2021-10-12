import { useMemo, useCallback } from 'react'
import { Button, Divider, Space, Table, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const Scores = () => {
  const columns = useMemo(() => [
    {
      title: 'Tahun Akademik',
      key: 'year',
      render: (value, row, index) => (`TS-${index + 11}`),
      align: 'center'
    },
    {
      title: 'Daya Tampung',
      key: 'capacity',
      dataIndex: 'capacity',
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
      render: (val, row, index) => (
        <Space size={2} split={<Divider type="vertical" />}>
          <Tooltip title={`Edit TS-${index + 1}`}>
            <Button size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip placement="topRight" title={`Hapus TS-${index + 1}`}>
            <Button size="small" danger type="primary" icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      )
    }
  ], [])
  return (
    <div>
      <Button>Tambah Data Simulasi</Button>
      <Table
        style={{ marginTop: 12 }}
        dataSource={[]}
        columns={columns}
        bordered
        size='small'
      />
    </div>
  )
}

export default Scores
