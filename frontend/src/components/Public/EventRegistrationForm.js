// src/components/Public/EventRegistrationForm.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerToEvent } from '../../services/API';

const EventRegistrationForm = ({ eventId }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null); // Pour la confirmation / erreur

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setFeedback(null);

        try {
            // Appel de l'API d'inscription
            const response = await registerToEvent(eventId, data);
            
            // Si Laravel retourne 201 Created (ou 200 OK)
            setFeedback({ 
                type: 'success', 
                message: `Inscription réussie pour ${data.email} ! Une confirmation a été envoyée.` 
            });
            reset(); // Réinitialise les champs du formulaire

        } catch (error) {
            console.error("Erreur d'inscription:", error);
            
            // Gestion des erreurs de validation de Laravel ou d'autres erreurs spécifiques
            const errorMessage = error.response?.data?.message 
                               || error.response?.data?.errors?.email?.[0] // Exemple d'erreur spécifique Laravel
                               || "Une erreur est survenue lors de l'inscription.";

            setFeedback({ 
                type: 'error', 
                message: errorMessage
            });

        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Style de base pour les notifications
    const feedbackStyle = {
        padding: '10px',
        borderRadius: '4px',
        fontWeight: 'bold',
        marginTop: '15px',
        color: 'white',
        backgroundColor: feedback?.type === 'success' ? '#28a745' : '#dc3545'
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            
            <p>Veuillez remplir le formulaire ci-dessous pour réserver votre place.</p>
            
            {/* Champ Nom */}
            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="name">Votre Nom et Prénom</label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Votre nom est requis' })}
                />
                {errors.name && <p className="error-message" style={{ color: 'red' }}>{errors.name.message}</p>}
            </div>

            {/* Champ Email */}
            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="email">Votre Email (pour la confirmation)</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', { 
                        required: 'Votre email est requis',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Format d\'email invalide'
                        }
                    })}
                />
                {errors.email && <p className="error-message" style={{ color: 'red' }}>{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: isSubmitting ? '#ccc' : '#ff6700', // Orange Eventify
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
            }}>
                {isSubmitting ? 'Enregistrement...' : 'Confirmer mon inscription'}
            </button>
            
            {/* Affichage du Feedback */}
            {feedback && <div style={feedbackStyle}>{feedback.message}</div>}

        </form>
    );
};

export default EventRegistrationForm;