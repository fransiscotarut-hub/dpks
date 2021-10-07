import { useCallback, useState, useEffect } from "react";
import { Typography, List, Card, Space, Tooltip, Button, message, Popconfirm } from "antd"
import { DeleteOutlined, EditOutlined, FormOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory, useRouteMatch } from "react-router-dom";
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import AddDocument from "./AddDocument";

const doc = document;

const Layout = () => {
  const [modal, toggleModal] = useState(false);
  const [documents, setDocuments] = useState({ rows: [], count: 0 });
  const [document, setDocument] = useState(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, toggleLoading] = useState(true);
  const { errorCatch } = useErrorCatcher();
  const { models: { Document } } = useModels();
  const { push } = useHistory();
  const { path } = useRouteMatch();

  doc.title = "Dashboard - Pengaturan"

  const getDocuments = useCallback(() => {
    const offset = (page - 1) * limit;
    toggleLoading(true);
    Document.collection({
      limit, offset,
      attributes: ['name'],
      order: [['id', 'asc']]
    }).then(resp => {
      setDocuments(resp);
      toggleLoading(false);
    }).catch(errorCatch);
  }, [Document, limit, page, errorCatch]);

  useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  const createDocument = useCallback((val, cb) => {
    Document.create(val).then(resp => {
      message.success(`Form ${resp.name} berhasil dibuat`);
      getDocuments();
      cb();
      toggleModal(false);
      // setPage(1);
    }).catch(errorCatch);
  }, [Document, getDocuments, errorCatch]);

  const updateDocument = useCallback((val, cb) => {
    document.update(val).then(resp => {
      message.success(`Form ${resp.name} berhasil disimpan`);
      getDocuments();
      cb();
      toggleModal(false);
    }).catch(errorCatch);
  }, [document, getDocuments, errorCatch]);

  const deleteDocument = useCallback((document) => {
    document.delete().then(resp => {
      message.success(`Form ${resp.name} berhasil dihapus`);
      getDocuments();
    }).catch(errorCatch);
  }, [errorCatch, getDocuments]);

  return (
    <div>
      <Typography.Title level={5}>Pengaturan Form DKPS</Typography.Title>
      <AddDocument
        visible={modal}
        onCancel={() => {
          toggleModal(false);
          setDocument(undefined);
        }}
        onOpen={() => toggleModal(true)}
        onSubmit={typeof document !== 'undefined' ? updateDocument : createDocument}
        document={document}
      />
      <List
        style={{ marginTop: 12 }}
        dataSource={documents.rows}
        rowKey={item => `${item.id}`}
        renderItem={item => (
          <Card size="small" style={{ marginTop: 4, marginBottom: 4 }}>
            <List.Item>
              <span>{item.name}</span>
              <Space>
                <Tooltip title={`Edit Field Form ${item.name}`}>
                  <Button onClick={() => {
                    push(`${path}/${item.id}`);
                  }} type="primary" size="small" icon={<FormOutlined />} />
                </Tooltip>
                <Tooltip title={`Edit ${item.name}`}>
                  <Button onClick={() => {
                    setDocument(item);
                    toggleModal(true);
                  }} size="small" icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip placement="topRight" title={`Hapus ${item.name}`}>
                  <Popconfirm
                    title={`Apakah Anda yakin ingin menghapus ${item.name}?`}
                    placement="topRight"
                    okButtonProps={{ danger: true, type: 'primary' }}
                    okText="Hapus"
                    cancelText="Batal"
                    onConfirm={() => deleteDocument(item)}
                  >
                    <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </List.Item>
          </Card>
        )}
        loading={{ spinning: loading, indicator: <LoadingOutlined spin />, size: 'large', tip: 'Mengambil Data Form' }}
        pagination={{ current: page, onChange: setPage, onShowSizeChange: (current, size) => setLimit(size), showSizeChanger: true, total: documents.count }}
      />
    </div>
  )
}

export default Layout
