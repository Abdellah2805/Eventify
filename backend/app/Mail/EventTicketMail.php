<?php
// app/Mail/EventTicketMail.php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
// 🔑 CORRECTION : Utilisation de la CLASSE Generator directement au lieu de la Façade
use SimpleSoftwareIO\QrCode\Generator; 

class EventTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public $event;
    public $participant;

    /**
     * Crée une nouvelle instance de message.
     */
    public function __construct(Event $event, $participant)
    {
        $this->event = $event;
        $this->participant = $participant;
    }

    /**
     * Obtient l'enveloppe du message.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre Billet pour : ' . $this->event->title,
        );
    }

    /**
     * Obtient la définition du contenu du message.
     */
    public function content(): Content
    {
        // 1. Définir les données à encoder.
        $dataToEncode = url('/api/events/' . $this->event->id . '/check-in/' . $this->participant->id);

        // 2. 🔑 CORRECTION : Instancier le Generator et l'utiliser
        $qrCodeGenerator = new Generator();
        
        $qrCodeBase64 = base64_encode(
            $qrCodeGenerator->format('svg')
                ->size(200)
                ->generate($dataToEncode)
        );

        // 3. Passer le QR code à la vue.
        return new Content(
            view: 'emails.ticket', // Assurez-vous que c'est la bonne vue
            with: [
                'qrCode' => $qrCodeBase64, 
                'event' => $this->event,
                'participant' => $this->participant,
            ]
        );
    }
}