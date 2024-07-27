import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Route from './pages/Route';
import { ImgProvider } from './provider/imgProvider';
import { RouteProvider } from './provider/routeProvider';

// const router = createHashRouter([
//   {
//     path: "/",
//     element: <Welcome />,
//   },
//   {
//     path: "/share",
//     element: <Share />,
//   },
//   {
//     path: "/canva",
//     element: <Canva />,
//   },
// ]);
const App = () => {
  return (
    <RouteProvider>
    <ImgProvider>
    <Route />
    </ImgProvider>
    </RouteProvider>

  );
};

export default App;
