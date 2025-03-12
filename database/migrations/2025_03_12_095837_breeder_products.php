<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'breeder_products', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'product_id' )->constrained()->onDelete( 'cascade' );
            $table->foreignId( 'breeder_id' )->constrained()->onDelete( 'cascade' );

            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'breeder_products' );
    }
};
