// src/components/Public/EventDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventDetails } from '../../services/API';
import EventRegistrationForm from './EventRegistrationForm'; // Sous-composant pour le formulaire

const EventDetails = () => {
    // Récupère l'ID de l'événement depuis l'URL (défini dans App.js : /evenement/:id)
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            setIsLoading(true);
            setError(null);
            setEvent(null);

            try {
                // Appel de l'API pour récupérer les détails de l'événement
                const response = await fetchEventDetails(id);
                setEvent(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des détails:", err);
                setError("Désolé, impossible de trouver cet événement ou le serveur est indisponible.");
            } finally {
                setIsLoading(false);
            }
        };

        // Assurez-vous que l'ID est bien là avant de charger
        if (id) {
            loadDetails();
        }
    }, [id]); 


    // --- Rendu conditionnel ---

    if (isLoading) {
        return <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>Chargement des détails de l'événement... ⏳</div>;
    }

    if (error) {
        return <div className="error-state alert-error" style={{ color: '#dc3545', border: '1px solid #dc3545', padding: '15px' }}>{error}</div>;
    }

    if (!event) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Événement non disponible.</div>;
    }
    
    // Calcul de la date et de l'heure formatées
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // --- Rendu final ---

    return (
        <div className="event-details-page" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
            
            {/* Colonne des Détails (70% de la largeur) */}
            <div className="details-content" style={{ flex: 3 }}>
                <h1 style={{ color: '#ff6700' }}>{event.title}</h1>
                
                <div className="info-box" style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '5px solid #007bff' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>📅 Date : <span style={{ color: '#007bff' }}>{formattedDate} à {formattedTime}</span></p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>📍 Lieu : {event.location}</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>👥 Places disponibles : <span style={{ color: event.capacity > 10 ? 'green' : 'red' }}>{event.capacity}</span></p>
                </div>
                
                <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>À propos de l'événement</h2>
                <p style={{ lineHeight: 1.6 }}>{event.description}</p>
                
                {/* Information sur l'organisateur, etc. */}
                {/* <p>Organisé par : {event.organizer_name}</p> */}
            </div>

            {/* Colonne du Formulaire d'Inscription (30% de la largeur) */}
            <div className="registration-sidebar" style={{ flex: 1, padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>Inscription</h2>
                {event.capacity > 0 ? (
                    <EventRegistrationForm eventId={event.id} />
                ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>Désolé, l'événement est complet.</p>
                )}
            </div>

        </div>
    );
};

export default EventDetails;