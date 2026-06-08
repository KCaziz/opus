import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'

// i18n — must be imported before App so translations are ready
import './i18n/index'

import { CVProvider } from './store/CVContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CVProvider>
        <App />
      </CVProvider>
    </BrowserRouter>
  </StrictMode>,
)
