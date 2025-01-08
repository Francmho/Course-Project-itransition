// import logo from './logo.svg';
//import { useEffect } from 'react';
import React, { useContext } from "react";
import { Context } from "./store/appContext";
import './App.css';


function App() {
  const { store } = useContext(Context);

  return (
    <div className={`app-container ${store.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <p>
       Edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <p>
//       Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//       className="App-link"
//       href="https://reactjs.org"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//   </header>
// </div>