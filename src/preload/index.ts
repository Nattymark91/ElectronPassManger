/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MenuComponent } from '../interfaces'

// Custom APIs for renderer
const api = {
  send: (channel: string, data: unknown) => {
    ipcRenderer.send(channel, data)
  },
  invoke: (channel: string, ...data: unknown[]) => ipcRenderer.invoke(channel, ...data),
  on: (channel: string, func: (component: MenuComponent) => void) => {
    ipcRenderer.on(channel, (_event, component) => func(component))
  },
  off: (channel: string, func: (component: MenuComponent) => void) => {
    ipcRenderer.off(channel, (_event, component) => func(component))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcRenderer: api
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = {
    ...electronAPI,
    ipcRenderer: api
  }
}
