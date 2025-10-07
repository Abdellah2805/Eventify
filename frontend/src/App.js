// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Composants d'Authentification Organisateur
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

// Composants de l'Espace Organisateur (Protégé)
import ProtectedRoute from './components/ProtectedRoute'; 
import EventList from './components/Organisateur/EventList';
import EventForm from './components/Organisateur/EventForm';

// Composants Publics (Utilisateur Final)
import HomePage from './components/Public/HomePage'; 
import EventDetails from './components/Public/EventDetails'; 
// Assurez-vous d'avoir importé le CSS dans src/index.js ou ici pour les styles globaux
import './styles/App.css'; 

// --- Composant de Navigation Modulaire ---

const NavMenu = () => {
    const { isAuthenticated, logout } = useAuth();
    
    // Styles pour la navigation (utilisant des classes CSS pour les boutons)
    const navStyle = {
        padding: '15px 20px',
        backgroundColor: '#f8f8f8',
        borderBottom: '2px solid #ff6700', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const linkStyle = {
        margin: '0 10px',
        textDecoration: 'none',
        color: '#333',
        fontWeight: 'bold',
        // Ajout d'une transition pour le style App.css
        transition: 'color 0.3s' 
    };

    const logoStyle = {
        color: '#ff6700', 
        fontSize: '1.8em',
        textDecoration: 'none',
        fontWeight: '900'
    };
    
    // Le style du bouton d'inscription est appliqué via la classe btn-primary
    // Le style du bouton de déconnexion est appliqué via la classe btn-danger
    const buttonMargin = {
        marginLeft: '20px', 
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>Eventify 🌟</Link>
            
            <div className="nav-links">
                <Link to="/" className="nav-link" style={linkStyle}>Accueil</Link> 
                
                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="nav-link" style={linkStyle}>Connexion Organisateur</Link> 
                        {/* Utilisation de la classe btn-primary pour l'inscription */}
                        <Link to="/register" className="btn-primary" style={{...buttonMargin, textDecoration: 'none'}}>Inscription Organisateur</Link> 
                    </>
                )}
                
                {isAuthenticated && (
                    <>
                        <Link to="/organisateur/evenements" className="nav-link" style={linkStyle}>Mon Espace Organisateur</Link> 
                        {/* Utilisation de la classe btn-danger pour la déconnexion */}
                        <button 
                            onClick={logout} 
                            className="btn-danger"
                            style={buttonMargin}
                        >
                            Déconnexion
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

// --- Composant Principal de l'Application ---

function App() {
  return (
    <Router>
      {/* AuthProvider entoure tout pour que l'état d'auth soit globalement accessible */}
      <AuthProvider> 
        <NavMenu /> 
        
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
                
                {/* 🌎 Routes Publiques */}
                <Route path="/" element={<HomePage />} /> 
                <Route path="/evenement/:id" element={<EventDetails />} /> 
                
                {/* Pages d'Authentification Organisateur */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                
                {/* 🔑 Routes Protégées (Espace Organisateur) */}
                {/* Les routes enfants ne sont accessibles qu'après vérification du token */}
                <Route element={<ProtectedRoute />}>
                    
                    <Route path="/organisateur/evenements" element={<EventList />} /> 
                    <Route path="/organisateur/nouveau" element={<EventForm />} />
                    <Route path="/organisateur/modifier/:id" element={<EventForm isEditMode={true} />} />
                    
                </Route>
                
                {/* Route par défaut (Page 404) */}
                <Route path="*" element={
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h2 style={{ color: '#ff6700' }}>404 - Page Non Trouvée</h2>
                        <p>Désolé, cette adresse n'existe pas !</p>
                        <Link to="/" style={{ color: '#007bff', fontWeight: 'bold' }}>Retour à l'accueil</Link>
                    </div>
                } />
            </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;