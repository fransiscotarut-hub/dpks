import useAuth from "hooks/useAuth"

const { Typography } = require("antd")

const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <Typography.Title level={4}>Selamat datang, {user.name}!</Typography.Title>
    </div>
  )
}

export default Home
