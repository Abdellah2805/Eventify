<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Billet Événement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #ff6700;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #ff6700;
            font-size: 24px;
            margin: 0;
        }
        .details-box {
            border: 1px solid #dddddd;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .qr-code-section {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px dashed #cccccc;
            margin-top: 20px;
            border-radius: 4px;
        }
        .qr-code-section h3 {
            color: #333333;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
            padding-top: 10px;
        }
        strong {
            color: #000000;
        }
    </style>
</head>
<body>

    <div class="container">
        
        <div class="header">
            <h1>🎉 Billet Événement</h1>
        </div>
        
        <p>Bonjour **{{ $participant->name }}**, vous êtes inscrit(e) à l'événement !</p>
        
        <p>Voici votre billet officiel. Veuillez le conserver précieusement.</p>

        <div class="details-box">
            <h2>Détails du Billet</h2>
            <p><strong>Événement :</strong> {{ $event->title }}</p>
            <p><strong>Date et heure :</strong> {{ \Carbon\Carbon::parse($event->date)->format('d/m/Y à H:i') }}</p>
            <p><strong>Lieu :</strong> {{ $event->location }}</p>
            <p><strong>Nom du participant :</strong> {{ $participant->name }}</p>
        </div>

        <div class="qr-code-section">
            <h3>Code d'Accès Rapide</h3>
            
            <img 
                src="data:image/svg+xml;base64,{{ $qrCode }}" 
                alt="QR Code du Billet" 
                style="width: 200px; height: 200px; display: block; margin: 10px auto; border: 5px solid #ffffff;"
            >
            
            <p style="font-size: 0.9em; color: #555;">Veuillez présenter ce code à l'entrée pour validation.</p>
        </div>

        <p style="margin-top: 30px;">Nous vous attendons avec impatience !</p>
        
        <div class="footer">
            Ceci est un email généré automatiquement par Eventify.
        </div>

    </div>

</body>
</html>