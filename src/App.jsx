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
import { ImgProvider } from './provider/imgProvider';

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
const App = () => {
  return (
    <ImgProvider>
        <RouterProvider
    router={router}/>
    </ImgProvider>

  );
};

export default App;
