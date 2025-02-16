<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'variety_samples', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'variety_report_id' )->constrained()->onDelete( 'cascade' );
            $table->json( 'images' );
            $table->date( 'sample_date' );
            $table->string( 'leaf_color' )->nullable();
            $table->unsignedBigInteger( 'amount_of_branches' )->nullable();
            $table->unsignedBigInteger( 'flower_buds' )->nullable();
            $table->string( 'branch_color' )->nullable();
            $table->string( 'roots' )->nullable();
            $table->string( 'flower_color' )->nullable();
            $table->unsignedBigInteger( 'flower_petals' )->nullable();
            $table->string( 'flowering_time' )->nullable();
            $table->string( 'length_of_flowering' )->nullable();
            $table->string( 'seeds' )->nullable();
            $table->string( 'seed_color' )->nullable();
            $table->unsignedBigInteger( 'amount_of_seeds' )->nullable();
            $table->longText( 'note' )->nullable();
            $table->boolean( 'status' )->default( true );
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'variety_samples' );
    }
};
