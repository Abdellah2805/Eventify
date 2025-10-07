// src/components/Organisateur/EventList.js (FINAL CSS-FRIENDLY)

import React, { useState, useEffect, useCallback } from 'react';
import { fetchMyEvents, deleteEvent } from '../../services/API';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null); 

    const loadEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setNotification(null); 

        try {
            const response = await fetchMyEvents();
            setEvents(response.data); 
        } catch (err) {
            console.error("Erreur lors du chargement des événements:", err);
            // L'erreur affichée sur la capture d'écran se produit ici.
            // C'est souvent dû au token ou à l'API.
            setError("Impossible de charger les événements. Vérifiez votre connexion.");
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);


    const handleDelete = async (eventId, eventTitle) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement : "${eventTitle}" ? Cette action est irréversible.`)) {
            return;
        }

        try {
            setNotification({ type: 'info', message: `Suppression de l'événement en cours...` });

            await deleteEvent(eventId);
            
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
            
            setNotification({ type: 'success', message: `L'événement "${eventTitle}" a été supprimé avec succès.` });

        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setNotification({ type: 'error', message: `Erreur: Impossible de supprimer l'événement. Le serveur a renvoyé une erreur.` });
        }
    };


    const NotificationDisplay = () => {
        if (!notification) return null;
        
        const alertClass = 
            notification.type === 'success' ? 'alert-success' : 
            notification.type === 'error' ? 'alert-danger' : 
            'alert';

        return <div className={`alert ${alertClass}`}>{notification.message}</div>;
    };


    if (isLoading) {
        return <div className="loading-state">Chargement de vos événements... ⏳</div>;
    }

    return (
        <div className="event-list-container">
            <header className="list-header">
                <h2>Mes Événements Publiés ({events.length})</h2>
                {/* Utilisation de la classe btn-primary pour le bouton d'ajout */}
                <Link to="/organisateur/nouveau" className="btn-primary">
                    + Ajouter un nouvel événement
                </Link>
            </header>

            <NotificationDisplay /> 

            {/* Utilisation de la classe alert-danger pour les erreurs de chargement */}
            {error && <div className="alert alert-danger">{error}</div>}

            {events.length === 0 ? (
                <div className="empty-state">
                    <p>Vous n'avez pas encore publié d'événement.</p>
                    <Link to="/organisateur/nouveau">Commencez ici !</Link>
                </div>
            ) : (
                <div className="list-grid">
                    {events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>Lieu : {event.location}</p>
                            <div className="card-actions">
                                <Link 
                                    to={`/organisateur/modifier/${event.id}`} 
                                    className="btn-secondary"
                                >
                                    Modifier
                                </Link>
                                <button 
                                    onClick={() => handleDelete(event.id, event.title)} 
                                    className="btn-danger"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;