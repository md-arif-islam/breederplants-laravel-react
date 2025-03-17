<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PublicPostController extends Controller {
    public function index( Request $request ) {
        $query = Post::with( ['user', 'categories', 'tags'] );

        // Search functionality
        if ( $search = $request->input( 'search' ) ) {
            $query->where( 'title', 'LIKE', "%{$search}%" );
        }

        // Category filter functionality
        if ( $category = $request->input( 'category' ) ) {
            $query->whereHas( 'categories', function ( $q ) use ( $category ) {
                $q->where( 'slug', $category );
            } );
        }

        // Tag filter functionality: support numeric tag id or slug.
        if ( $tags = $request->input( 'tags' ) ) {
            if ( is_numeric( $tags ) ) {
                $query->whereHas( 'tags', function ( $q ) use ( $tags ) {
                    $q->where( 'id', $tags );
                } );
            } else {
                $query->whereHas( 'tags', function ( $q ) use ( $tags ) {
                    $q->where( 'slug', $tags );
                } );
            }
        }

        // Sorting functionality
        if ( $sort = $request->input( 'sort' ) ) {
            switch ( $sort ) {
            case 'a-z':
                $query->orderBy( 'title', 'asc' );
                break;
            case 'last-item-first':
                $query->latest();
                break;
            case 'first-item-last':
                $query->oldest();
                break;
            }
        }

        $posts = $query->paginate( 10 );

        return response()->json( $posts );
    }

    public function show( Post $post ) {
        // This controller already supports loading a post with its category and tag relationships.
        return response()->json( $post->load( ['user', 'categories', 'tags'] ) ); // Load relationships
    }
}
