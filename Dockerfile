FROM dunglas/frankenphp:php8.2

# Dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Extensions PHP
RUN install-php-extensions pdo_mysql mbstring bcmath gd exif zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copier d'abord les fichiers de dépendances pour optimiser le cache Docker
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Copier le reste du projet
COPY . .

# Finaliser l'installation de composer (scripts et autoload)
RUN composer install --no-dev --optimize-autoloader

# Permissions cruciales pour Laravel
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Configuration de FrankenPHP
# FrankenPHP écoute par défaut sur le port 80 ou le port défini par SERVER_NAME
# Mais sur Railway, on utilise la variable PORT
ENV PORT=8000
EXPOSE 8000

# Commande de démarrage spécifique à FrankenPHP
# On définit l'entrée sur le dossier public de Laravel
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--domain", ":$PORT", "--public-dir", "public/"]