<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
        protected $except = [
        // AJOUTE TES ROUTES D'AUTHENTIFICATION ICI
        'api/login',
        'api/register',
        'api/logout',
        'api/organisateur/events',
        // Si d'autres routes de ton API n'utilisent pas de session, tu peux les ajouter aussi
        'api/events/*', 
    ];
}
