<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'grower_products', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'product_id' )->constrained()->onDelete( 'cascade' );
            $table->foreignId( 'grower_id' )->constrained()->onDelete( 'cascade' );
            $table->decimal( 'unit_price', 8, 2 );
            $table->integer( 'stock' );
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'grower_products' );
    }
};