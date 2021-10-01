import { useMemo } from "react"
import { Typography, Row, Col, Menu, Result } from "antd"
import { useHistory, useLocation } from "react-router";
import { parse } from 'query-string'
import StudyProgramScores from "./StudyProgramScores";
import Scores from "./Scores";
import { ExclamationCircleFilled } from "@ant-design/icons";


const { Item } = Menu;

const Layout = () => {
  const { push } = useHistory();
  const { pathname, search } = useLocation();
  const { form } = useMemo(() => parse(search), [search]);

  document.title = `Dashboard - Simulasi Nilai ${typeof form !== 'undefined' ? `(Form ${form})` : ``} `;


  return (
    <div>
      <Typography.Title level={5}>Simulasi Nilai</Typography.Title>
      <Row align="middle" style={{ marginBottom: 12 }} gutter={[8, 8]}>
        <Col md={24}>
          <Menu selectedKeys={[form]} onClick={(ev) => push({ pathname, search: `?form=${ev.key}` })} theme="dark" mode="horizontal" >
            <Item key="3.a.1">Form 3.a.1</Item>
            <Item key="3.a.1.1">Form 3.a.1.1</Item>
            <Item key="3.a.1.2">Form 3.a.1.2</Item>
            <Item key="2.a">Form 2.a</Item>
          </Menu>
        </Col>
      </Row>
      {
        typeof form !== 'undefined' ?
          form.includes('3.a.1') ?
            <StudyProgramScores />
            :
            <Scores />
          :
          <Result icon={<ExclamationCircleFilled />} title="Pilih Form" subTitle="Pilih form nilai simulasi terlebih dahulu" />
      }
    </div>
  )
}

export default Layout
