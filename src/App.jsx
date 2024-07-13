import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Share from './pages/Share';
import Welcome from './pages/Welcome';
import Canva from './pages/Canva';

const router = createHashRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/share",
    element: <Share />,
  },
  {
    path: "/canva",
    element: <Canva />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <RouterProvider router={router} />

)

export default App;
