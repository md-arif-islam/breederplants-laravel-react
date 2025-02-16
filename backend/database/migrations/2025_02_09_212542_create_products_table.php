<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'products', function ( Blueprint $table ) {
            $table->id();
            $table->unsignedInteger( 'breeder_id' )->nullable()->index();
            $table->string( 'genus' )->index();
            $table->string( 'species' )->index();
            $table->string( 'cultivar' )->nullable();
            $table->unsignedInteger( 'plant_id' )->nullable()->index();
            $table->integer( 'protection_number' )->nullable();
            $table->dateTime( 'cpvo_expiration_date' )->nullable();
            $table->decimal( 'royalty_fee', 8, 2 )->nullable();
            $table->boolean( 'sun_icon' )->nullable();
            $table->boolean( 'edible_icon' )->nullable();
            $table->boolean( 'partial_shade_icon' )->nullable();
            $table->boolean( 'blooming_time_icon' )->nullable();
            $table->string( 'blooming_period' )->nullable();
            $table->boolean( 'pruning_icon' )->nullable();
            $table->string( 'pruning_period' )->nullable();
            $table->boolean( 'winter_hardy_icon' )->nullable();
            $table->decimal( 'temperature', 5, 2 )->nullable();
            $table->boolean( 'height_icon' )->nullable();
            $table->decimal( 'height', 8, 2 )->nullable();
            $table->boolean( 'width_icon' )->nullable();
            $table->decimal( 'width', 8, 2 )->nullable();
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'products' );
    }
};