import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { PassType, PrismaClient } from '@prisma/client'
import { MenuComponentsEnum, Passwords } from '../interfaces'
import icon from './icon.png'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY || 'secret'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    minHeight: 650,
    minWidth: 700,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Добавить пароль',
      click: (): void => mainWindow.webContents.send('menu-item-clicked', MenuComponentsEnum.ADD)
    },
    {
      label: 'Рабочие',
      click: (): void => mainWindow.webContents.send('menu-item-clicked', MenuComponentsEnum.WORK)
    },
    {
      label: 'Личные',
      click: (): void =>
        mainWindow.webContents.send('menu-item-clicked', MenuComponentsEnum.PERSONAL)
    }
  ])

  Menu.setApplicationMenu(menu)
}

const decryptText = (text: string): string => {
  return CryptoJS.AES.decrypt(text, SECRET_KEY).toString(CryptoJS.enc.Utf8)
}

const encryptText = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

const mapPasswords = (passwords: Passwords[]): Passwords[] => {
  return passwords.map((password) => ({
    ...password,
    user: decryptText(password.user),
    pass: decryptText(password.pass)
  }))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('get-work-passwords', async (): Promise<Passwords[]> => {
    const passwords = await prisma.passwords.findMany({
      where: { type: PassType.WORK }
    })
    return mapPasswords(passwords)
  })

  ipcMain.handle('delete-password', async (_event, id): Promise<void> => {
    await prisma.passwords.delete({ where: { id } })
  })

  ipcMain.handle('get-personal-passwords', async (): Promise<Passwords[]> => {
    const passwords = await prisma.passwords.findMany({
      where: { type: PassType.PERSONAL }
    })
    return mapPasswords(passwords)
  })

  ipcMain.handle('add-password', async (_event, passwordData) => {
    const { user, pass } = passwordData
    const encryptedData = {
      ...passwordData,
      user: encryptText(user),
      pass: encryptText(pass)
    }
    await prisma.passwords.create({ data: encryptedData })
  })

  ipcMain.handle('update-password', async (_event, id: number, newPassword: string) => {
    await prisma.passwords.update({
      where: { id },
      data: { pass: encryptText(newPassword) }
    })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
