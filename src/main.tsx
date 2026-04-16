import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WhatTheHell } from './components/WhatTheHell.tsx';

const path = window.location.pathname;


const root = createRoot(document.getElementById('root')!)

if(path === '/whatthehell') {
  root.render(
    <StrictMode>
      <WhatTheHell/>
    </StrictMode>
  )
} else {
  root.render(
    <StrictMode>
      <App/>
    </StrictMode>
  )
}
