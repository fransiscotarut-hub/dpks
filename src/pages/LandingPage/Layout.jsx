import { Row, Col } from 'antd';
// import PaymentProcessed from 'src/assets/imgs/PaymentProcessed.png'
const Layout = () => {
  return (
    <div>
      <>
        <Row>
          <Col span={12}>audit mutu internal</Col>
          <Col span={12}>AMI 2021-2022 Semester Ganjil</Col>
        </Row>
        <Row>
          <Col span={12}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores blanditiis laudantium odio eaque rem? Error qui mollitia ratione, tenetur consequuntur libero numquam nobis, architecto consequatur harum quibusdam exercitationem, voluptatem unde.</Col>
          <Col span={6}>
            Kepala P4M
            {/* <img src={PaymentProcessed}/> */}
          </Col>
          <Col span={6}>Ketua Autor</Col>
        </Row>
        <Row>
          <Col span={12}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, officiis! Numquam, dolores dicta consectetur minus praesentium odio libero quos repellat voluptatem, fuga consequatur aliquam. Nihil dolore sequi dolorum deleniti quibusdam.</Col>
          <Col span={6}>Auditor</Col>
          <Col span={6}>auditrex</Col>
        </Row>
      </>
    </div>
  )
}

export default Layout
