<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'variety_reports', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'user_id' )->constrained()->onDelete( 'restrict' );
            $table->foreignId( 'grower_id' )->constrained( 'growers' )->onDelete( 'restrict' );
            $table->foreignId( 'breeder_id' )->constrained( 'breeders' )->onDelete( 'restrict' );
            $table->string( 'variety_name' )->index();
            $table->string( 'thumbnail' )->nullable();
            $table->unsignedBigInteger( 'amount_of_plants' );
            $table->string( 'pot_size' )->nullable();
            $table->boolean( 'pot_trial' )->default( false );
            $table->boolean( 'open_field_trial' )->default( false );
            $table->date( 'date_of_propagation' )->nullable();
            $table->date( 'date_of_potting' )->nullable();
            $table->json( 'samples_schedule' )->nullable();
            $table->date( 'start_date' )->nullable();
            $table->date( 'end_date' )->nullable();
            $table->boolean( 'status' )->default( true );
            $table->timestamps();
            $table->softDeletes();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'variety_reports' );
    }
};
