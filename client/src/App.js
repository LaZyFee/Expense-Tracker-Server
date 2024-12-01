import { RouterProvider } from 'react-router-dom';
import './App.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { router } from './Router/router';


function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
