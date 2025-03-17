<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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

        $posts = $query->paginate( 10 );

        return response()->json( $posts );
    }

    // This endpoint is not applicable for API; returning not implemented.
    public function create() {
        return response()->json( ['message' => 'Method not implemented'], 501 );
    }

    // Store a newly created post.
    public function store( Request $request ) {

        Log::info( $request->all() );

        $validated = $request->validate( [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'thumbnail' => 'nullable|string',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
        ] );

        if ( isset( $validated['thumbnail'] ) ) {
            if ( preg_match( '/^data:image\/(\w+);base64,/', $validated['thumbnail'] ) ) {
                $relativePath = $this->saveImage( $validated['thumbnail'] );
                $validated['thumbnail'] = $relativePath;
            } else {
                // nothing
            }

        }

        $validated['user_id'] = Auth::id();

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
            'thumbnail' => 'nullable|string',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
        ] );

        // Handle thumbnail update
        if ( isset( $request['thumbnail'] ) ) {
            if ( preg_match( '/^data:image\/(\w+);base64,/', $request['thumbnail'] ) ) {

                if ( $post->thumbnail ) {
                    if ( file_exists( $post->thumbnail ) ) {
                        unlink( $post->thumbnail );
                    }
                }

                $relativePath = $this->saveImage( $request['thumbnail'] );
                $validated['thumbnail'] = $relativePath;
            } else {

            }

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
            if ( file_exists( $post->thumbnail ) ) {
                unlink( $post->thumbnail );
            }
        }

        $post->delete();
        return response()->json( ['message' => 'Post deleted successfully'] );
    }

    private function saveImage( $image ) {
        // Check if image is valid base64 string
        if ( preg_match( '/^data:image\/(\w+);base64,/', $image, $type ) ) {
            // Take out the base64 encoded text without mime type
            $image = substr( $image, strpos( $image, ',' ) + 1 );
            // Get file extension
            $type = strtolower( $type[1] ); // jpg, png, gif

            // Check if file is an image
            if ( !in_array( $type, ['jpg', 'jpeg', 'gif', 'png'] ) ) {
                throw new \Exception( 'invalid image type' );
            }
            $image = str_replace( ' ', '+', $image );
            $image = base64_decode( $image );

            if ( $image === false ) {
                throw new \Exception( 'base64_decode failed' );
            }
        } else {
            throw new \Exception( 'did not match data URI with image data' );
        }

        $dir = 'images/news/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path( $dir );
        $relativePath = $dir . $file;
        if ( !File::exists( $absolutePath ) ) {
            File::makeDirectory( $absolutePath, 0755, true );
        }
        file_put_contents( $relativePath, $image );

        return $relativePath;
    }

    // Category CRUD methods
    public function indexCategories() {
        Log::info( 'Fetching categories' );
        $categories = Category::all();
        return response()->json( $categories );
    }

    public function storeCategory( Request $request ) {
        $validated = $request->validate( [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
        ] );
        $category = Category::create( $validated );
        return response()->json( ['message' => 'Category created successfully', 'category' => $category], 201 );
    }

    public function updateCategory( Request $request, $category ) {
        $cat = Category::findOrFail( $category );
        $validated = $request->validate( [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:categories,slug,' . $cat->id,
        ] );
        $cat->update( $validated );
        return response()->json( ['message' => 'Category updated successfully', 'category' => $cat] );
    }

    public function destroyCategory( $category ) {
        $cat = Category::findOrFail( $category );
        $cat->delete();
        return response()->json( ['message' => 'Category deleted successfully'] );
    }

    // Tag CRUD methods
    public function indexTags() {
        $tags = Tag::all();
        return response()->json( $tags );
    }

    public function storeTag( Request $request ) {
        $validated = $request->validate( [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:tags,slug',
        ] );
        $tag = Tag::create( $validated );
        return response()->json( ['message' => 'Tag created successfully', 'tag' => $tag], 201 );
    }

    public function updateTag( Request $request, $tag ) {
        $tg = Tag::findOrFail( $tag );
        $validated = $request->validate( [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:tags,slug,' . $tg->id,
        ] );
        $tg->update( $validated );
        return response()->json( ['message' => 'Tag updated successfully', 'tag' => $tg] );
    }

    public function destroyTag( $tag ) {
        $tg = Tag::findOrFail( $tag );
        $tg->delete();
        return response()->json( ['message' => 'Tag deleted successfully'] );
    }
}
