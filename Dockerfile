FROM dunglas/frankenphp:php8.2

# Install system packages (THIS is what you're missing)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    exif \
    zip

# Add composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN cp .env.example .env || true
RUN chmod -R 775 storage bootstrap/cache || true

# Now this will work
RUN composer install --no-dev --optimize-autoloader --no-interaction

CMD php artisan serve --host=0.0.0.0 --port=$PORT