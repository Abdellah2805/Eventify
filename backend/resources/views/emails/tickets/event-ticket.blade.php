{{-- resources/views/emails/tickets/event-ticket.blade.php --}}

<x-mail::message>
# Votre Confirmation d'Inscription

Bonjour **{{ $user->name }}**,

Votre inscription à l'événement **{{ $event->title }}** a été confirmée !

<x-mail::panel>
## Détails du Ticket
| Événement | {{ $event->title }} |
| :--- | :--- |
| **Lieu** | {{ $event->location }} |
| **Date & Heure** | {{ \Carbon\Carbon::parse($event->date)->format('d/m/Y H:i') }} |
| **Inscrit par** | {{ $user->email }} |
| **ID de Confirmation** | {{ $user->id }}-{{ $event->id }} |
</x-mail::panel>

Veuillez présenter ce reçu (ou une capture d'écran) à l'entrée.

<x-mail::button :url="url('/events/' . $event->id)">
Voir l'événement en ligne
</x-mail::button>

Merci d'utiliser notre service,
{{ config('app.name') }}
</x-mail::message>