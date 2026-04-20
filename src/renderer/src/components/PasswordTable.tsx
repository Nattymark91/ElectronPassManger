/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Table, message, Modal, Input, Button } from 'antd'
import { Passwords } from '../../../interfaces'
import {
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined
} from '@ant-design/icons'

interface PasswordTableProps {
  loadPasswordsMethod: () => Promise<Passwords[]>
}

const PasswordTable: React.FC<PasswordTableProps> = ({ loadPasswordsMethod }) => {
  const [passwords, setPasswords] = useState<Passwords[]>([])
  const [visiblePasswordId, setVisiblePasswordId] = useState<number | null>(null)
  const [editingPasswordId, setEditingPasswordId] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  const loadPasswords = async (): Promise<void> => {
    const result: Passwords[] = await loadPasswordsMethod()
    setPasswords(result)
  }

  const deletePassword = async (id: number): Promise<void> => {
    await window.electron.ipcRenderer.invoke('delete-password', id)
    loadPasswords()
    message.success('Пароль удален')
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
    message.success('Скопировано в буфер обмена')
  }

  const confirmDelete = (id: number): void => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить этот пароль?',
      content: 'Пароль удалится безвозвратно.',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: () => deletePassword(id)
    })
  }

  const togglePasswordVisibility = (id: number): void => {
    setVisiblePasswordId((prevId) => (prevId === id ? null : id))
  }

  const openEditModal = (id: number, currentPassword: string): void => {
    setEditingPasswordId(id)
    setNewPassword(currentPassword)
    setVisiblePasswordId(null)
    setIsPasswordVisible(false)
  }

  const updatePassword = async (): Promise<void> => {
    if (editingPasswordId !== null) {
      await window.electron.ipcRenderer.invoke('update-password', editingPasswordId, newPassword)
      message.success('Пароль обновлен')
      setEditingPasswordId(null)
      setNewPassword('')
      loadPasswords()
    }
  }

  useEffect(() => {
    loadPasswords()
  }, [])

  const columns = [
    {
      title: 'Ресурс',
      dataIndex: 'name',
      key: 'name',
      render: (text: string): React.JSX.Element => (
        <span
          style={{
            textAlign: 'left',
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: 'Пользователь',
      dataIndex: 'user',
      key: 'user',
      render: (text: string): React.JSX.Element => (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <span
            style={{
              textAlign: 'left',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flexGrow: 1
            }}
          >
            {text}
          </span>
          <CopyOutlined
            onClick={() => copyToClipboard(text)}
            style={{ marginLeft: 8, cursor: 'pointer' }}
          />
        </span>
      )
    },
    {
      title: 'Пароль',
      dataIndex: 'pass',
      key: 'pass',
      render: (text: string, record: Passwords): React.JSX.Element => (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <span
            style={{
              textAlign: 'left',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flexGrow: 1
            }}
          >
            {visiblePasswordId === record.id ? text : '••••••••'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <span
              onClick={() => {
                togglePasswordVisibility(record.id)
              }}
              style={{ cursor: 'pointer' }}
            >
              {visiblePasswordId === record.id ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
            <CopyOutlined
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(text)
              }}
              style={{ marginLeft: 8, cursor: 'pointer' }}
            />
          </span>
        </span>
      )
    },
    {
      title: 'Правка',
      key: 'action',
      render: (_: unknown, record: Passwords): React.JSX.Element => (
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <EditOutlined
            onClick={() => openEditModal(record.id, record.pass)}
            style={{ marginLeft: 8, cursor: 'pointer' }}
          />
          <DeleteOutlined onClick={() => confirmDelete(record.id)} />
        </span>
      )
    }
  ]

  return (
    <div style={{ overflowY: 'auto', height: '100vh' }}>
      <Table
        style={{ width: '100vw' }}
        dataSource={passwords}
        columns={columns.map((column) => ({
          ...column,
          width: '25%'
        }))}
        rowKey="id"
        pagination={false}
        scroll={{ y: 'calc(100vh - 100px)' }}
      />
      <Modal
        title="Редактировать пароль"
        visible={editingPasswordId !== null}
        onCancel={() => setEditingPasswordId(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditingPasswordId(null)}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={updatePassword}>
            Сохранить
          </Button>
        ]}
      >
        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Введите новый пароль"
          suffix={
            isPasswordVisible ? (
              <EyeInvisibleOutlined
                onClick={() => setIsPasswordVisible(false)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <EyeOutlined
                onClick={() => setIsPasswordVisible(true)}
                style={{ cursor: 'pointer' }}
              />
            )
          }
        />
      </Modal>
    </div>
  )
}

export default PasswordTable
