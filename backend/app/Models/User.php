<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany; // 👈 NOUVEAU: Import pour la relation HasMany

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- NOUVELLE MÉTHODE DE RELATION ---

    /**
     * Définit la relation One-to-Many: Un utilisateur (organisateur) peut avoir plusieurs événements.
     */
    public function events(): HasMany
    {
        // 🔑 Le point crucial : Indique à Eloquent que l'utilisateur est lié à plusieurs instances du modèle Event.
        // Eloquent utilisera la clé étrangère 'user_id' dans la table 'events' par défaut.
        return $this->hasMany(Event::class);
    }
    
    // Si vous utilisez un système de rôles (comme le suggère votre RegisteredUserController)
    // vous pourriez avoir une méthode ou un trait ici pour gérer les rôles.
    // public function addRole(string $roleName) { /* ... */ }

    // Si vous aviez une méthode addRole, elle devrait être définie dans un trait
    // ou une classe spécifique si ce n'est pas déjà le cas.
    // Je laisse la structure ouverte au cas où vous avez cette logique ailleurs.
}