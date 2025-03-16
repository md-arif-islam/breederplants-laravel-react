<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPostController extends Controller {
    // Display a listing of posts.
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

        // Tag filter functionality
        if ( $tags = $request->input( 'tags' ) ) {
            $query->whereHas( 'tags', function ( $q ) use ( $tags ) {
                $q->where( 'slug', $tags );
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

        $posts = $query->paginate( 6 );

        return response()->json( $posts );
    }

    // This endpoint is not applicable for API; returning not implemented.
    public function create() {
        return response()->json( ['message' => 'Method not implemented'], 501 );
    }

    // Store a newly created post.
    public function store( Request $request ) {
        $validated = $request->validate( [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_id' => 'required|integer',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
        ] );

        if ( $request->hasFile( 'thumbnail' ) ) {
            $thumbnailPath = $request->file( 'thumbnail' )->store( 'thumbnails', 'public' );
            $validated['thumbnail'] = $thumbnailPath;
        }

        $post = Post::create( $validated );

        // Attach categories
        if ( isset( $validated['categories'] ) ) {
            $post->categories()->attach( $validated['categories'] );
        }

        // Attach tags
        if ( isset( $validated['tags'] ) ) {
            $post->tags()->attach( $validated['tags'] );
        }

        return response()->json( [
            'message' => 'Post created successfully',
            'post' => $post,
        ], 201 );
    }

    // Display the specified post.
    public function show( Post $post ) {
        return response()->json( $post->load( ['user', 'categories', 'tags'] ) ); // Load relationships
    }

    // For API, edit simply returns the resource.
    public function edit( Post $post ) {
        return response()->json( $post );
    }

    // Update the specified post.
    public function update( Request $request, Post $post ) {
        $validated = $request->validate( [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
        ] );

        // Handle thumbnail update
        if ( $request->hasFile( 'thumbnail' ) ) {
            // Delete old thumbnail
            if ( $post->thumbnail ) {
                Storage::delete( 'public/' . $post->thumbnail );
            }
            $thumbnailPath = $request->file( 'thumbnail' )->store( 'thumbnails', 'public' );
            $validated['thumbnail'] = $thumbnailPath;
        }

        $post->update( $validated );

        // Sync categories
        if ( isset( $validated['categories'] ) ) {
            $post->categories()->sync( $validated['categories'] );
        }

        // Sync tags
        if ( isset( $validated['tags'] ) ) {
            $post->tags()->sync( $validated['tags'] );
        }

        return response()->json( [
            'message' => 'Post updated successfully',
            'post' => $post->load( ['user', 'categories', 'tags'] ), // Load relationships
        ] );
    }

    // Remove the specified post.
    public function destroy( Post $post ) {
        // Delete thumbnail
        if ( $post->thumbnail ) {
            Storage::delete( 'public/' . $post->thumbnail );
        }

        $post->delete();
        return response()->json( ['message' => 'Post deleted successfully'] );
    }
}