import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { NavigationProvider } from './context/NavigationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavigationProvider>
          <ScrollToTop />
          <App />
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
