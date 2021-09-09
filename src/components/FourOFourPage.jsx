import { Result } from 'antd'
import { Route } from 'react-router-dom'
import { Container } from './Container'

const FourOFourPage = () => {
  document.title = "404 Page"
  return (
    <Route path="*">
      <Container>
        <Result status="404" title="Ooooppppssss....." subTitle="Maaf, halaman yang Anda cari tidak ada" />
      </Container>
    </Route>
  )
}

export default FourOFourPage
