import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './lib/easing/easing.js'
import './css/style.css'
import './lib/animate/animate.min.css'
import './lib/owlcarousel/assets/owl.carousel.min.css'
import './lib/owlcarousel/owl.carousel.min.js'
import './js/main.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
