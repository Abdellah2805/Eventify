<?php

// app/Http/Controllers/EventController.php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event; // Assurez-vous d'importer votre modèle Event
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail; // 🔑 Importez le Facade Mail
use App\Mail\EventTicketMail;        // 🔑 Importez votre Mailable (DOIT EXISTER)

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
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Événement créé avec succès', 'event' => $event], 201);
    }

    /**
     * Affiche l'événement spécifié (show).
     */
    public function show(Event $event)
    {
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
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'date' => 'required|date|after:now',
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

        // 🛠️ CORRECTION DE LA SYNTAXE ICI
        if ($search = $request->get('search')) {
            $query->where('title', 'like', '%' . $search . '%')
                  ->orWhere('location', 'like', '%' . $search . '%');
        }

        return $query->paginate(10); // Utilisation de la pagination
    }

    public function showPublic(Event $event)
    {
        return response()->json($event);
    }
    
    /**
     * Gère l'inscription d'un utilisateur à un événement et envoie le billet.
     */
    public function register(Request $request, Event $event)
    {
        // 1. Validation des données de l'utilisateur
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            // Note: Vous pouvez ajouter ici la logique pour vérifier si le participant
            // est déjà inscrit ou si la capacité est atteinte.
        ]);
        
        // 2. Enregistrement de l'inscription (Données simulées pour l'email)
        // 💡 REMPLACEZ CECI par votre logique de sauvegarde réelle (ex: création d'une
        // entrée dans une table 'participants' ou 'inscriptions' liée à l'événement).
        $participant = (object)[
            'id' => uniqid(), // Utilisation d'un ID temporaire/unique
            'name' => $request->name,
            'email' => $request->email,
        ];
        

        // 3. Envoi de l'email (Le point CRUCIAL pour Mailpit)
        try {
            // Envoie l'email au participant avec les données de l'événement et du participant.
            Mail::to($participant->email)->send(new EventTicketMail($event, $participant));
            
            \Log::info("Billet d'événement envoyé via Mailpit à: " . $participant->email);

        } catch (\Exception $e) {
            // Gérer les erreurs d'envoi d'email
            \Log::error("Erreur lors de l'envoi du billet d'événement: " . $e->getMessage());
        }


        // 4. Réponse au Frontend
        return response()->json([
            'message' => 'Inscription réussie! Votre billet a été envoyé à votre email.',
            'event_title' => $event->title,
            'participant' => $participant,
        ], 201);
    }
} // La classe EventController se termine correctement.