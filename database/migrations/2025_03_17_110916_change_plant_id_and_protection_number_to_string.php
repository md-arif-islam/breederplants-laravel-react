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
            $table->string( 'plant_id' )->nullable()->change();
            $table->string( 'protection_number' )->nullable()->change();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table( 'products', function ( Blueprint $table ) {
            $table->integer( 'plant_id' )->nullable()->unsigned()->change();
            $table->integer( 'protection_number' )->nullable()->change();
        } );
    }
};