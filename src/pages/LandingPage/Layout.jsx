import { Row, Col, Space, Typography, Card, Divider, Button } from 'antd';
import { ContainerWithBorder, Container } from 'components/Container';
import { HomePageImg } from 'components/HomePageImg'
import PaymentProcessed from 'assets/imgs/PaymentProcessed.png'
import meeting from 'assets/imgs/Meeting.png'
import coding from 'assets/imgs/Coding.png'
import deployment from 'assets/imgs/deployment.png'
import development from 'assets/imgs/development.png'
import logo from 'assets/imgs/logo-polimdo.png'
import { Footer } from 'components/Container';

const currentYear = (new Date()).getFullYear();

const Layout = () => {
  return (
    <Container fluid={true}>
      <ContainerWithBorder>
        <Row>
          <Col span={12}>
            <Container style={{ padding: 18 }} fluid={true}>
              <Space split={<Divider type="vertical" />} align="center">
                <img alt="logo" src={logo} style={{ width: 100, height: 100, display: 'inline-block' }} />
                <Typography.Title level={5}>
                  Audit mutu internal <Typography.Title style={{ display: 'inline-block', margin: 0 }} level={5} type="secondary">Polimdo</Typography.Title>
                </Typography.Title>
              </Space>
              <HomePageImg alt="presentation" src={meeting} style={{ width: 300, margin: '10px auto' }} />
              <Typography.Text>
                Selamat datang di website Audit Mutu Internal (AMI) Polimdo. Semua kegiatan AMI Polimdo akan melalui website ini. Silakan klik icon sesuai dengan status dalam Audit Internal.
              </Typography.Text>
              <Typography.Text style={{ display: 'block' }}>
                Jangan lupa tetap selalu berdoa dan berpikir positif, kami doakan bapak/ibu/saudara selalu dalam keadaan sehat, sukses dan bahagia selalu dunia dan akhirat. Amin.
              </Typography.Text>
              <Typography.Text style={{ textAlign: 'right', display: 'block', marginTop: 12 }}>Tuhan selalu beserta kita semua</Typography.Text>
              <Typography.Text style={{ textAlign: 'right', display: 'block', }}>Hormat kami,</Typography.Text>
              <Typography.Text strong style={{ textAlign: 'right', display: 'block', }}>Ketua P4M Polimdo</Typography.Text>
              <Space style={{ marginTop: 35 }}>
                <Typography.Text>Auditor dan Auditi silakan login di sini</Typography.Text>
                <Button type="primary">Login di sini</Button>
              </Space>
            </Container>
          </Col>
          <Col span={12}>
            <Container fluid={true} style={{ padding: 18 }}>
              <Typography.Title style={{ textAlign: 'center' }} level={3}>AMI 2021-2022 Semester Ganjil</Typography.Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card hoverable size="small" title="Kepala P4M">
                    <HomePageImg alt="paymentprocessed" src={PaymentProcessed} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small" title="Ketua Autor">
                    <HomePageImg alt="paymentprocessed" src={deployment} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small" title="Auditor">
                    <HomePageImg alt="paymentprocessed" src={coding} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small" title="Auditee">
                    <HomePageImg alt="paymentprocessed" src={development} />
                  </Card>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col span={24}>
            <Footer>
              <Typography.Text style={{color: '#313131'}}>Copyright &copy; {currentYear}, All rights reserved.</Typography.Text>
            </Footer>
          </Col>
        </Row>
      </ContainerWithBorder>
    </Container>
  )
}

export default Layout
