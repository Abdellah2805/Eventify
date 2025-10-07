// src/services/API.js

import axios from 'axios';

// 💡 ATTENTION : Configure l'URL de base de ton backend Laravel
const API_BASE_URL = 'http://localhost:8000/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

/**
 * Définit le token d'authentification pour toutes les requêtes futures (utilisé par l'Organisateur).
 * Cette fonction est appelée par AuthContext.js après la connexion/inscription.
 * @param {string | null} token Le token Bearer ou null pour supprimer le header.
 */
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// --- Fonctions d'Authentification ---

/**
 * Fonction pour l'inscription : POST /register
 */
export const registerUser = (data) => {
    return api.post('/register', data);
};

/**
 * Fonction pour la connexion : POST /login
 */
export const loginUser = (data) => {
    return api.post('/login', data);
};

/**
 * Fonction pour la déconnexion : POST /logout
 * Ceci est crucial pour invalider le token côté serveur.
 */
export const logoutUser = () => {
    return api.post('/logout');
};

// --- Fonctions Publiques (Utilisateur) ---

/**
 * Fonction pour récupérer la liste publique des événements, avec filtres et pagination : GET /events
 * @param {object} params - Paramètres de requête (ex: { search: 'rock', page: 2 })
 */
export const fetchPublicEvents = (params = {}) => {
    return api.get('/events', { params: params });
};

/**
 * Fonction pour récupérer les détails d'un événement public : GET /events/{id}
 */
export const fetchEventDetails = (eventId) => {
    return api.get(`/events/${eventId}`);
};

/**
 * Fonction pour l'inscription à un événement : POST /events/{id}/register
 */
export const registerToEvent = (eventId, userData) => {
    return api.post(`/events/${eventId}/register`, userData);
};


// --- Fonctions Organisateur (Protégées par Token) ---

/**
 * Fonction pour récupérer la liste des événements de l'organisateur : GET /organisateur/events
 */
export const fetchMyEvents = () => {
    return api.get('/organisateur/events');
};

/**
 * Fonction pour créer un nouvel événement : POST /organisateur/events
 */
export const createEvent = (data) => {
    return api.post('/organisateur/events', data);
};

/**
 * Fonction pour modifier un événement existant : PUT /organisateur/events/{eventId}
 */
export const updateEvent = (eventId, data) => {
    return api.put(`/organisateur/events/${eventId}`, data);
};

/**
 * Fonction pour supprimer un événement : DELETE /organisateur/events/{eventId}
 */
export const deleteEvent = (eventId) => {
    return api.delete(`/organisateur/events/${eventId}`);
};


export default api;