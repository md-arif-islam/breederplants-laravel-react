<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder {
    public function run() {
        // Create 50 posts
        Post::factory()->count( 50 )->create()->each( function ( $post ) {
            // Get random category IDs (1 to 3 categories per post)
            $categoryIds = Category::inRandomOrder()->take( rand( 1, 3 ) )->pluck( 'id' )->toArray();
            // Get random tag IDs (1 to 5 tags per post)
            $tagIds = Tag::inRandomOrder()->take( rand( 1, 5 ) )->pluck( 'id' )->toArray();

            // Attach the categories and tags to the post
            $post->categories()->attach( $categoryIds );
            $post->tags()->attach( $tagIds );
        } );
    }
}