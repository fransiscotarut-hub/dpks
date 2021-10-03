import { Descriptions, Badge } from "antd"

const FormScore = ({ data }) => {
  return (
    <div>
      <br />
      <Descriptions title="3.a.1" column={5} layout="vertical" bordered>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1">text</Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text" span={5}>
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="3.a.1.1" column={5} layout="vertical" bordered>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text1" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text2" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text3" span={5}>
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="3.a.1.2" column={5} layout="vertical" bordered>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text1" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text2" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text3" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text4" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text5" span={5}>
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="2.a" column={5} layout="vertical" bordered>
        <Descriptions.Item label="Kelompok sains teknologi" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="Kelompok sosial humanioral" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text" span={5}>
        </Descriptions.Item>
      </Descriptions>
    </div>

  )
}

export default FormScore
