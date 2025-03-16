<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        // Posts table
        Schema::create( 'posts', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId( 'user_id' )->constrained()->onDelete( 'cascade' );
            $table->string( 'title' );
            $table->string( 'slug' )->unique();
            $table->text( 'description' )->nullable();
            $table->string( 'thumbnail' )->nullable();
            $table->timestamps();
            // Note: Ensure a user with id 1 exists for seeder use.
        } );

        // Categories table
        Schema::create( 'categories', function ( Blueprint $table ) {
            $table->id();
            $table->string( 'name' )->unique();
            $table->string( 'slug' )->unique();
            $table->timestamps();
        } );

        // Tags table
        Schema::create( 'tags', function ( Blueprint $table ) {
            $table->id();
            $table->string( 'name' )->unique();
            $table->string( 'slug' )->unique();
            $table->timestamps();
        } );

        // Post_Category pivot table
        Schema::create( 'post_category', function ( Blueprint $table ) {
            $table->foreignId( 'post_id' )->constrained()->onDelete( 'cascade' );
            $table->foreignId( 'category_id' )->constrained()->onDelete( 'cascade' );
            $table->primary( ['post_id', 'category_id'] );
        } );

        // Post_Tag pivot table
        Schema::create( 'post_tag', function ( Blueprint $table ) {
            $table->foreignId( 'post_id' )->constrained()->onDelete( 'cascade' );
            $table->foreignId( 'tag_id' )->constrained()->onDelete( 'cascade' );
            $table->primary( ['post_id', 'tag_id'] );
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists( 'post_tag' );
        Schema::dropIfExists( 'post_category' );
        Schema::dropIfExists( 'tags' );
        Schema::dropIfExists( 'categories' );
        Schema::dropIfExists( 'posts' );
    }
};
