import { MenuComponent } from './interfaces'

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on(arg0: string, handleMenuItemClick: (component: MenuComponent) => void): unknown
        off(arg0: string, handleMenuItemClick: (component: MenuComponent) => void): unknown
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
        send: (channel: string, ...args: unknown[]) => void
      }
    }
  }
}

export {}
