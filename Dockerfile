FROM dunglas/frankenphp:php8.2

# Install PHP extensions
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    exif

# 👉 Add this line (important)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Now composer works
RUN composer install --no-dev --optimize-autoloader

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]