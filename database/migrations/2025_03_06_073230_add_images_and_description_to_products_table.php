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
            // Add images column as the first column
            $table->json( 'images' )->first();

            // Add description column after the cultivar column
            $table->text( 'description' )->after( 'cultivar' );
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table( 'products', function ( Blueprint $table ) {
            $table->dropColumn( 'images' );
            $table->dropColumn( 'description' );
        } );
    }
};