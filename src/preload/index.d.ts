import { ElectronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
