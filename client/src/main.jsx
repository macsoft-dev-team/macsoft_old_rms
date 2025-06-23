import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom-style.css';
import './styles/sidenav.css';
import './styles/deviceConfiguration.css';
import ReduxProvider from './utils/hooks/ReduxProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </StrictMode>,
)
