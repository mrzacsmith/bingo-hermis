import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './index.css';
import Main from './pages/main';
import Game from './pages/game';
import reportWebVitals from './reportWebVitals';
import FirebaseAppProvider from "./helpers/context/firebaseContext";
import BingoProvider from './helpers/context/bingoContext';
import fireConfig from "./services/fireBaseConfig";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <FirebaseAppProvider config={fireConfig}>
      <BingoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/game/:gameIdParam" element={<Game />} />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </BrowserRouter>
      </BingoProvider>
    </FirebaseAppProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
