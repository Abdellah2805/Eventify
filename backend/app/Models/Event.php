<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Pour la relation inverse (organisateur)

class Event extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés massivement (Mass Assignable).
     * Ils correspondent aux champs que l'utilisateur soumet.
     */
    protected $fillable = [
        'user_id', // 🔑 Clé étrangère vers l'organisateur (User)
        'title',
        'description',
        'location',
        'date',
        'capacity',
        'category_id', // Si utilisé
    ];

    /**
     * Définit la relation inverse : Un événement appartient à un seul utilisateur.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
