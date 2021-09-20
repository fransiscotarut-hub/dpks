import { memo, useEffect, useCallback, useState } from "react"
import {Modal, Form, Select} from 'antd'

const AddValue = memo(({ visible, onCancel, onSubmit }) => {
  const [forms, setForms] = useState([]);

  const getForms = useCallback(() => {

  }, [])

  return (
    <div>

    </div>
  )
})

export default AddValue
