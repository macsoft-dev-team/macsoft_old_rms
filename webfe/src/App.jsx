import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from "react-router-dom";
import { store } from './store';
import { router } from "./lib/constants/routes";
import "./App.css";
  
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;
