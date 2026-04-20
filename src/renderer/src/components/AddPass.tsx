import { Form, Input, Select, Button, message, Switch } from 'antd'
import { CreatePass } from '../../../interfaces'
import { useState } from 'react'
const { Option } = Select

function AddPass(): JSX.Element {
  const [form] = Form.useForm()
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)
  const [, setGeneratedPassword] = useState<string>('')

  const generatePassword = (): void => {
    const length = 12
    const charsetLower = 'abcdefghijklmnopqrstuvwxyz'
    const charsetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charsetNumbers = '0123456789'
    const charsetSpecial = '!@#$%^&*()_+'

    const passwordArray = [
      charsetLower[Math.floor(Math.random() * charsetLower.length)],
      charsetUpper[Math.floor(Math.random() * charsetUpper.length)],
      charsetNumbers[Math.floor(Math.random() * charsetNumbers.length)],
      charsetSpecial[Math.floor(Math.random() * charsetSpecial.length)]
    ]

    const allCharset = charsetLower + charsetUpper + charsetNumbers + charsetSpecial
    for (let i = passwordArray.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharset.length)
      passwordArray.push(allCharset[randomIndex])
    }
    const password = passwordArray.sort(() => Math.random() - 0.5).join('')
    setGeneratedPassword(password)
    form.setFieldsValue({ pass: password })
  }

  const onFinish = async (values: CreatePass): Promise<void> => {
    await window.electron.ipcRenderer.invoke('add-password', values)
    form.resetFields()
    setGeneratedPassword('')
    setIsPasswordGenerated(false)
    message.success('Пароль сохранен')
  }

  const handleSwitchChange = (checked: boolean): void => {
    setIsPasswordGenerated(checked)
    if (checked) {
      generatePassword()
    } else {
      form.setFieldsValue({ pass: '', confirmPass: '' })
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ width: '300px' }}>
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
      >
        <Input placeholder="Введите имя" />
      </Form.Item>
      <Form.Item
        label="Пользователь"
        name="user"
        rules={[{ required: true, message: 'Пожалуйста, введите пользователя!' }]}
      >
        <Input placeholder="Введите пользователя" />
      </Form.Item>
      <Form.Item label="Сгенерировать пароль">
        <Switch checked={isPasswordGenerated} onChange={handleSwitchChange} />
      </Form.Item>
      <Form.Item
        label="Пароль"
        name="pass"
        rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
      >
        <Input.Password placeholder="Введите пароль" disabled={isPasswordGenerated} />
      </Form.Item>
      <Form.Item
        label="Тип"
        name="type"
        rules={[{ required: true, message: 'Пожалуйста, выберите тип!' }]}
      >
        <Select placeholder="Выберите тип">
          <Option value="WORK">Рабочий</Option>
          <Option value="PERSONAL">Личный</Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddPass
