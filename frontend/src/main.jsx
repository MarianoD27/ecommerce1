import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AppProvider } from './context/AppProvider.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') { disableReactDevTools() }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppProvider>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </AppProvider>
    </Router>
  </StrictMode>,
)
