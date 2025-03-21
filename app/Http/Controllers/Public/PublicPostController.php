<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag; // Added to fetch category name
use Illuminate\Http\Request;

class PublicPostController extends Controller {
    public function index( Request $request ) {
        $query = Post::with( ['user', 'categories', 'tags'] );

        // Search functionality
        if ( $search = $request->input( 'search' ) ) {
            $query->where( 'title', 'LIKE', "%{$search}%" );
        }

        // Category filter functionality
        $categorySlug = $request->input( 'category' );
        if ( $categorySlug ) {
            $query->whereHas( 'categories', function ( $q ) use ( $categorySlug ) {
                $q->where( 'slug', $categorySlug );
            } );
        }

        // add for tags
        $tagSlug = $request->input( 'tag' );
        if ( $tagSlug ) {
            $query->whereHas( 'tags', function ( $q ) use ( $tagSlug ) {
                $q->where( 'slug', $tagSlug );
            } );
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
        $data = $posts->toArray();

        // Append category name if a filter was applied
        if ( $categorySlug ) {
            $data['categoryName'] = Category::where( 'slug', $categorySlug )->value( 'name' );
        }

        //  tag
        if ( $tagSlug ) {
            $data['tagName'] = Tag::where( 'slug', $tagSlug )->value( 'name' );
        }

        return response()->json( $data );
    }

    public function show( Post $post ) {
        return response()->json( $post->load( ['user', 'categories', 'tags'] ) ); // Load relationships
    }
}
