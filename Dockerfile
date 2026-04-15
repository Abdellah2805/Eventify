FROM dunglas/frankenphp:php8.2

# System deps
RUN apt-get update && apt-get install -y git unzip zip && rm -rf /var/lib/apt/lists/*

# PHP extensions (include zip!)
RUN install-php-extensions pdo_mysql mbstring bcmath gd exif zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions (VERY important)
RUN chmod -R 775 storage bootstrap/cache || true

# Railway uses PORT env var
CMD sh -c "php -S 0.0.0.0:${PORT:-8080} -t public"

EXPOSE $PORT