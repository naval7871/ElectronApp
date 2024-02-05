import './App.css'
import ErrorBoundary from './ErrorBoundary'
import { SideBarComponent } from './components/sideBar/SideBarComponent'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { muiTheme } from './application.theme'
import { Menu } from './components/Menu'
import { FolderSearchFilter } from './components/FolderSearchFilter'
import { TopBarComponent } from './components/TopBar/TopBarComponent'
import { MainSectionComponent } from './components/mainsection/MainSectionComponent'
import { useAppSelector } from './app/hooks'
import { selectHomePageShow } from './features/files/filesSlice'
import { HomePage } from './HomePage'
import { Notification } from './shared/components/notifications/Notification'

function App(): React.ReactElement {
  const showHomeComponent = useAppSelector(selectHomePageShow)
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ErrorBoundary>
        {showHomeComponent ? (
          <HomePage />
        ) : (
          <>
            <header>
              <Menu />
            </header>
            <div style={{ display: 'flex', height: 'calc(100vh - 56.5px)' }}>
              <div
                style={{
                  minWidth: 250,
                  maxWidth: 400,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  resize: 'horizontal'
                }}
              >
                <FolderSearchFilter />
                <SideBarComponent />
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}
              >
                <TopBarComponent />
                <MainSectionComponent />
              </div>
            </div>
            <Notification />
          </>
        )}
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
