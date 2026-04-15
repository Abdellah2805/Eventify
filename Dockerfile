FROM dunglas/frankenphp:php8.2

RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    exif

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Ensure env exists
RUN cp .env.example .env || true

# Fix permissions
RUN chmod -R 775 storage bootstrap/cache || true

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]