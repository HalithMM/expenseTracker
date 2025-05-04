import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Apps from '../Apps';
// import { DashboardPage } from './pages/index'; 
// import OrdersPage from './pages/Orders';
// import Layout from './Dashboard'; // Ensure this component exists and is imported correctly

// const router = createBrowserRouter([
//   {
//     Component: Apps, // root layout route
//     children: [
//       {
//         path: '/',
//         Component: Layout,
//       },
//       {
//         path: 'dashboard', // Updated path
//         Component: DashboardPage,
//       },
//       {
//         path: 'orders',
//         Component: OrdersPage,
//       },
//     ],
//   },
// ]);

// const rootElement = document.getElementById('root');

// if (rootElement) {
//   ReactDOM.createRoot(rootElement).render(
//     <React.StrictMode>
//       <RouterProvider router={router} />
//     </React.StrictMode>,
//   );
// } else {
//   console.error('Failed to find the root element');
// }