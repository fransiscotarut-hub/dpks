const { Typography } = require("antd")

const Layout = () => {
  document.title = "Dashboard - Program Studi"
  return (
    <div>
      <Typography.Title level={4}>Program Studi</Typography.Title>
    </div>
  )
}

export default Layout
