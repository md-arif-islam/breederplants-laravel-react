<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create( 'breeders', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'user_id' )->constrained()->onDelete( 'cascade' );
            $table->string( 'username' )->unique()->index();
            $table->string( 'company_name' );
            $table->string( 'company_email' )->unique()->index();
            $table->string( 'contact_person' );
            $table->string( 'street' );
            $table->string( 'city' );
            $table->string( 'postal_code' );
            $table->string( 'country' );
            $table->string( 'phone' )->nullable();
            $table->string( 'website' )->nullable();
            $table->boolean( 'is_deleted' )->default( false );
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'breeders' );
    }
};
