import { useEffect, useState } from 'react'
import AddPass from './components/AddPass'
import WorkPass from './components/WorkPass'
import { MenuComponent, MenuComponentsEnum } from '../../interfaces'
import PersonalPass from './components/PersonalPass'

function App(): JSX.Element {
  const [activeComponent, setActiveComponent] = useState<MenuComponent>(MenuComponentsEnum.ADD)

  useEffect(() => {
    const handleMenuItemClick = (component: MenuComponent): void => {
      setActiveComponent(component)
    }

    window.electron.ipcRenderer.on('menu-item-clicked', handleMenuItemClick)

    return (): void => {
      window.electron.ipcRenderer.off('menu-item-clicked', handleMenuItemClick)
    }
  }, [])

  const renderComponent = (): React.JSX.Element | null => {
    switch (activeComponent) {
      case MenuComponentsEnum.ADD:
        return <AddPass />
      case MenuComponentsEnum.WORK:
        return <WorkPass />
      case MenuComponentsEnum.PERSONAL:
        return <PersonalPass />
      default:
        return <AddPass />
    }
  }

  return <>{renderComponent()}</>
}

export default App
