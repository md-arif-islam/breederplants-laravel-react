<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table( 'products', function ( Blueprint $table ) {
            // Remove the breeder_id column without dropping a non-existent foreign key
            $table->dropColumn( 'breeder_id' );

            // Drop the other specified columns
            $table->dropColumn( 'blooming_time_icon' );
            $table->dropColumn( 'pruning_icon' );
            $table->dropColumn( 'winter_hardy_icon' );
            $table->dropColumn( 'height_icon' );
            $table->dropColumn( 'width_icon' );
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table( 'products', function ( Blueprint $table ) {
            $table->foreignId( 'breeder_id' )->onDelete( 'cascade' )->index();
            $table->boolean( 'blooming_time_icon' )->nullable();
            $table->boolean( 'pruning_icon' )->nullable();
            $table->boolean( 'winter_hardy_icon' )->nullable();
            $table->boolean( 'height_icon' )->nullable();
            $table->boolean( 'width_icon' )->nullable();
        } );
    }
};