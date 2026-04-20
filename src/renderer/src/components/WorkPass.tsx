import { Passwords } from '../../../interfaces'
import PasswordTable from './PasswordTable'

function WorkPass(): JSX.Element {
  const loadPasswords = async (): Promise<Passwords[]> => {
    return (await window.electron.ipcRenderer.invoke('get-work-passwords')) as Passwords[]
  }

  return <PasswordTable loadPasswordsMethod={loadPasswords} />
}

export default WorkPass
