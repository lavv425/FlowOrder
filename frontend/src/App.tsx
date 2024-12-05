import { Suspense } from "react"
import { AppProvider } from "./Contexts/AppProvider"
import AppRouter from "./Routes/AppRouter"
import Loader from "./Components/Loader/Loader"

function App() {
  return (
    <Suspense fallback={<Loader />} name="app-suspense">
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Suspense>
  )
}

export default App
