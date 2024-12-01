import { Suspense } from 'react'
import { AppProvider } from './Contexts/AppProvider'
import AppRouter from './Routes/AppRouter'

function App() {
  return (
    <Suspense>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Suspense>
  )
}

export default App
