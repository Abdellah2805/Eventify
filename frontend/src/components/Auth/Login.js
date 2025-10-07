// src/components/Auth/Login.js (FINAL CSS-FRIENDLY)

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/API';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await loginUser(data);
            
            login(response.data); 
            navigate('/organisateur/evenements', { replace: true });

        } catch (error) {
            console.error("Erreur de connexion:", error);
            const errorMessage = error.response?.data?.message || "Échec de la connexion. Veuillez réessayer.";
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Connexion Organisateur</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Champ Email */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...register('email', { required: "L'email est requis" })} />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                {/* Champ Mot de passe */}
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input id="password" type="password" {...register('password', { required: "Le mot de passe est requis" })} />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                {/* Affichage de l'erreur de soumission */}
                {submitError && <div className="alert alert-danger">{submitError}</div>}

                {/* Bouton de Soumission */}
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>

            <p className="form-footer">
                Pas encore de compte ? <Link to="/register">Inscrivez-vous ici</Link>
            </p>
        </div>
    );
};

export default Login;