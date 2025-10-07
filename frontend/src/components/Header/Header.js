// src/components/Header/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importez votre hook d'authentification ici (ex: import { useAuth } from '../../context/AuthContext';)

const Header = () => {
    // 🔑 État pour gérer l'ouverture/fermeture du menu mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- SIMULATION D'AUTHENTIFICATION (à remplacer par votre logique réelle) ---
    // En se basant sur vos captures d'écran, l'utilisateur est souvent connecté.
    const isAuthenticated = true; 
    // const { isAuthenticated, logout } = useAuth(); // Votre logique réelle

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className="logo-text">Eventify</span>
                </Link>

                {/* 🔑 Bouton Burger (le code CSS le rend visible uniquement sur mobile) */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✕' : '☰'} 
                </button>

                {/* 🔑 Navigation : la classe 'menu-open' est ajoutée quand le menu est ouvert */}
                <nav className={`main-nav ${isMenuOpen ? 'menu-open' : ''}`}>
                    <Link to="/" onClick={toggleMenu}>Accueil</Link>
                    
                    {isAuthenticated ? (
                        <>
                            <Link to="/organisateur/evenements" onClick={toggleMenu}>Mon Espace Organisateur</Link>
                            <button 
                                onClick={() => { 
                                    // Insérez ici votre fonction de déconnexion réelle (ex: logout())
                                    toggleMenu(); 
                                }} 
                                className="btn-deconnexion"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={toggleMenu} className="btn-connexion">Connexion Organisateur</Link>
                            <Link to="/register" onClick={toggleMenu} className="btn-inscription">Inscription Organisateur</Link>
                        </>
                    )}
                </nav>
            </div>
            {/* Ligne de démarcation orange */}
            <div className="header-border"></div>
        </header>
    );
};

export default Header;