import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // 👈 ADD THIS
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>   {/* 👈 WRAP APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();