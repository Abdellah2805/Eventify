FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy .env.example to .env if needed
RUN cp .env.example .env || true

# Generate application key
RUN php artisan key:generate --ansi

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage

EXPOSE 9000

CMD ["php-fpm"]
