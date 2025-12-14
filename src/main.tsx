
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ова е главната влезна точка за React
const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error("ГРЕШКА: Не е пронајден 'root' елементот во index.html");
} else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
}
