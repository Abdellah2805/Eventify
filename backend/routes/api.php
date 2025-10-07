<?php

// routes/api.php (Côté Laravel)

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EventController;

 // Assurez-vous d'importer votre contrôleur d'événements

/*
|--------------------------------------------------------------------------
| Routes d'Authentification (Non Protégées)
|--------------------------------------------------------------------------
| Ces routes ne nécessitent PAS de jeton.
*/

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Routes Publiques (Utilisateur)
|--------------------------------------------------------------------------
| Ces routes sont accessibles sans authentification (HomePage, EventDetails).
*/

// GET /api/events (Liste + filtres)
Route::get('/events', [EventController::class, 'indexPublic']); 

// GET /api/events/{id} (Détails)
Route::get('/events/{event}', [EventController::class, 'showPublic']); 

// POST /api/events/{id}/register (Inscription)
Route::post('/events/{event}/register', [EventController::class, 'register']); 


/*
|--------------------------------------------------------------------------
| Routes Organisateur (PROTÉGÉES)
|--------------------------------------------------------------------------
| Elles nécessitent le token d'authentification pour y accéder.
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // POST /api/logout (Déconnexion)
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    
    
    // --- GROUPE DE ROUTES CRUD ORGANISATEUR ---
    // La route préfixée 'organisateur' doit correspondre à l'appel React.
    Route::prefix('organisateur')->group(function () {
        
        // GET /api/organisateur/events    (fetchMyEvents)
        // POST /api/organisateur/events   (createEvent)
        Route::resource('events', EventController::class)->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);
        Route::resource('events', EventController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

        // Optionnel: Renommer la route pour correspondre exactement
        // La route 'store' générée par Route::resource s'appelle déjà POST /api/organisateur/events
        
    });
});