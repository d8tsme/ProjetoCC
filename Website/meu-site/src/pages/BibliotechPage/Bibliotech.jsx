import React from 'react';
import '../LoginPage/App.css';
import Navbar from '../../components/PageComponents/Navbarfolder/Navbar.js';
import Layout from '../../components/PageComponents/mainlayout/layout.jsx';
import './Bibliotech.css';

export default function Bibliotech() {
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <div className="bibliotech-container">
          <div className="bibliotech-logo">
            Biblio.<br/>tech
          </div>
          
          <div className="bibliotech-intro">
            <p>
              Bibliotech é uma biblioteca virtual completa que facilita o gerenciamento de acervos. Com login de usuários, cadastro de obras, controle de empréstimos e reservas, nossa plataforma torna o processo simples e organizado — acessível via web ou mobile.
            </p>
          </div>

          <div className="bibliotech-buttons">
            <a href="https://github.com/d8tsme/ProjetoCC" target="_blank" rel="noopener noreferrer" className="bibliotech-btn">
              Repositório Git
            </a>
            <a href="https://app.flutterflow.io/project/projeto-final-8p0rcf" target="_blank" rel="noopener noreferrer" className="bibliotech-btn">
              Flutter Flow
            </a>
            <a href="https://docs.google.com/document/d/1UwnAzJB9lY0T-014Hiv68IrVr8XS9iWFYCsBCxP4wb8/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="bibliotech-btn">
              Documentação
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
