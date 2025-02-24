<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'production_reports', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'grower_id' )->constrained()->onDelete( 'cascade' );
            $table->dateTime( 'submission_date' )->nullable();
            $table->json( 'data' )->nullable();
            $table->string( 'quarter' );
            $table->integer( 'year' );
            $table->json( 'quarters_array' )->nullable();
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'production_reports' );
    }
};