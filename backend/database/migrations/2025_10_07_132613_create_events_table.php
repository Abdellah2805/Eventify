<?php

// database/migrations/xxxx_create_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            
            // 🔑 Clé étrangère vers l'utilisateur (organisateur)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('title', 255);
            $table->text('description');
            $table->string('location', 255);
            $table->dateTime('date');
            $table->integer('capacity');
            $table->unsignedBigInteger('category_id')->nullable(); // Si vous utilisez les catégories
            
            $table->timestamps();
            
            // Optionnel : relation vers la table des catégories si elle existe
            // $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};