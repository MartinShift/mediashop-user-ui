import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Import jQuery and make it global
import $ from 'jquery';
window.jQuery = window.$ = $;

// Import Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your CSS files
import './css/style.css';
import './lib/animate/animate.min.css';
import './lib/owlcarousel/assets/owl.carousel.min.css';

// Create a separate file for jQuery plugins initialization
import './lib/init.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);