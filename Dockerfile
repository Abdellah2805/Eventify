FROM dunglas/frankenphp:php8.2

RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    bcmath \
    gd \
    exif

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]