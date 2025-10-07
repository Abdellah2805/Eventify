<?php

// app/Http/Controllers/EventController.php



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event; // Assurez-vous d'importer votre modèle Event
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    // --- Méthodes Organisateur (Protégées par auth:sanctum) ---

    /**
     * Affiche une liste des événements de l'organisateur (index).
     */
    public function index()
    {
        // 🔑 Point critique : Retourne UNIQUEMENT les événements de l'utilisateur connecté.
        // Si cette ligne ne fonctionne pas, vérifiez la relation 'events()' dans le modèle User.
        $events = Auth::user()->events()->latest()->get(); 
        
        return response()->json($events);
    }

    /**
     * Stocke un nouvel événement créé par l'organisateur (store).
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'date' => 'required|date|after:now',
            'capacity' => 'required|integer|min:1',
            'category_id' => 'sometimes|nullable|integer', // Si vous utilisez les catégories
        ]);

        // 🔑 Point CRUCIAL : Créer l'événement en l'associant à l'utilisateur authentifié
        $event = Auth::user()->events()->create([
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'date' => $request->date,
            'capacity' => $request->capacity,
            // user_id est automatiquement rempli si la relation est configurée correctement,
            // mais l'associer via la relation est plus sûr.
        ]);
        
        return response()->json([
            'message' => 'Événement créé avec succès',
            'event' => $event
        ], 201);
    }

    /**
     * Affiche un événement spécifique (show).
     */
    public function show(Event $event)
    {
        // On s'assure que seul l'organisateur de l'événement peut le voir/modifier
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        return response()->json($event);
    }

    /**
     * Met à jour l'événement spécifié (update).
     */
    public function update(Request $request, Event $event)
    {
        // On vérifie que c'est bien l'organisateur qui met à jour
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'date' => 'required|date',
            'capacity' => 'required|integer|min:1',
            'category_id' => 'sometimes|nullable|integer',
        ]);

        $event->update($request->all());

        return response()->json(['message' => 'Événement mis à jour avec succès', 'event' => $event]);
    }

    /**
     * Supprime l'événement spécifié (destroy).
     */
    public function destroy(Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Événement supprimé avec succès']);
    }

    // --- Méthodes Publiques (Non Protégées) ---

    public function indexPublic(Request $request)
    {
        // Logique de recherche/filtrage pour la page d'accueil
        $query = Event::query();

        // Implémentez ici la logique de filtrage (par titre, date, etc.)
        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }
        // ... (autres filtres)

        return $query->paginate(10); // Utilisation de la pagination
    }

    public function showPublic(Event $event)
    {
        return response()->json($event);
    }
    
    // Assurez-vous d'implémenter la méthode 'register' pour l'inscription si elle n'existe pas encore.
    public function register(Request $request, Event $event)
    {
        // Logique d'inscription de l'utilisateur à l'événement
    }
}