import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Main from './pages/MainPage/Main';
import Autor from './pages/AutorPage/Autor';
import Pessoas from './pages/PessoasPage/Pessoas';
import Emprestimo from './pages/EmprestimoPage/Emprestimo';
import Genero from './pages/GeneroPage/Genero';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/autores" element={<Autor />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/emprestimos" element={<Emprestimo />} />
          <Route path="/generos" element={<Genero />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
