import { Passwords } from '../../../interfaces'
import PasswordTable from './PasswordTable'

function PersonalPass(): JSX.Element {
  const loadPasswords = async (): Promise<Passwords[]> => {
    return (await window.electron.ipcRenderer.invoke('get-personal-passwords')) as Passwords[]
  }

  return <PasswordTable loadPasswordsMethod={loadPasswords} />
}

export default PersonalPass
