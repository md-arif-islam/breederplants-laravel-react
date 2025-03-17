<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AdminProductController extends Controller {
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $products = Product::when( $query, function ( $q ) use ( $query ) {
            return $q->where( 'genus', 'like', "%{$query}%" )
                ->orWhere( 'species', 'like', "%{$query}%" )
                ->orWhere( 'cultivar', 'like', "%{$query}%" );
        } )->paginate( 20 );

        return response()->json( $products );
    }

    public function store( Request $request ) {
        $validated = $request->validate( [
            'images' => 'required|array',
            'images.*' => 'required|string',
            'genus' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'cultivar' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'plant_id' => 'nullable|string',
            'protection_number' => 'nullable|string',
            'cpvo_expiration_date' => 'nullable|date',
            'royalty_fee' => 'nullable|numeric',
            'sun_icon' => 'nullable',
            'edible_icon' => 'nullable',
            'partial_shade_icon' => 'nullable',
            'blooming_period' => 'nullable|string|max:255',
            'pruning_period' => 'nullable|string|max:255',
            'temperature' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'width' => 'nullable|numeric',
        ] );

        // Process each image in the array.
        $storedImages = [];
        foreach ( $validated['images'] as $image ) {
            // If the image is a base64-encoded image, decode and save it.
            if ( preg_match( '/^data:image\/(\w+);base64,/', $image, $matches ) ) {
                try {
                    $storedImages[] = $this->saveImage( $image );
                } catch ( \Exception $e ) {
                    return response()->json( ['error' => $e->getMessage()], 422 );
                }
            } else {
                $storedImages[] = $image;
            }
        }

        // Merge the processed images into the validated data.
        $dataToCreate = $validated;
        $dataToCreate['images'] = json_encode( $storedImages );

        // Create the variety sample record.
        $product = Product::create( $dataToCreate );

        return response()->json( [
            'message' => 'Product created successfully',
            'product' => $product,
        ] );
    }

    public function show( $id ) {
        $product = Product::findOrFail( $id );
        return response()->json( ['product' => $product] );
    }

    public function update( Request $request, $id ) {

        $product = Product::findOrFail( $id );

        $validated = $request->validate( [
            'images' => 'required|array',
            'images.*' => 'required|string',
            'genus' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'cultivar' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'plant_id' => 'nullable|string',
            'protection_number' => 'nullable|string',
            'cpvo_expiration_date' => 'nullable|date',
            'royalty_fee' => 'nullable|numeric',
            'sun_icon' => 'nullable',
            'edible_icon' => 'nullable',
            'partial_shade_icon' => 'nullable',
            'blooming_period' => 'nullable|string|max:255',
            'pruning_period' => 'nullable|string|max:255',
            'temperature' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'width' => 'nullable|numeric',
        ] );

        $oldImages = json_decode( $product->images, true ) ?? [];

        // Process each image in the array.
        $storedImages = [];
        foreach ( $validated['images'] as $image ) {
            // If the image is a base64-encoded image, decode and save it.
            if ( preg_match( '/^data:image\/(\w+);base64,/', $image, $matches ) ) {
                try {
                    $storedImages[] = $this->saveImage( $image );
                } catch ( \Exception $e ) {
                    return response()->json( ['error' => $e->getMessage()], 422 );
                }
            } else {
                $storedImages[] = $image;
            }
        }

        // Merge the processed images into the validated data.
        $dataToUpdate = $validated;
        $dataToUpdate['images'] = json_encode( $storedImages );

        // Update or create the variety sample record.
        $product->update( $dataToUpdate );

        // Delete old images that are not in the updated images array
        foreach ( $oldImages as $oldImage ) {
            if ( !in_array( $oldImage, $storedImages ) ) {
                $imagePath = public_path( $oldImage );
                if ( File::exists( $imagePath ) ) {
                    File::delete( $imagePath );
                }
            }
        }

        return response()->json( [
            'message' => 'Product updated successfully',
            'product' => $product,
        ] );
    }

    public function destroy( $id ) {
        $product = Product::findOrFail( $id );

        // Delete associated image files
        if ( $product->images ) {
            $images = json_decode( $product->images, true ) ?? [];

            foreach ( $images as $imagePath ) {
                $fullPath = public_path( $imagePath );
                if ( File::exists( $fullPath ) ) {
                    File::delete( $fullPath );
                }
            }
        }

        // Delete the product record
        $product->delete();

        return response()->json( [
            'message' => 'Product deleted successfully',
        ] );
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

        $dir = 'images/products/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path( $dir );
        $relativePath = $dir . $file;
        if ( !File::exists( $absolutePath ) ) {
            File::makeDirectory( $absolutePath, 0755, true );
        }
        file_put_contents( $relativePath, $image );

        return $relativePath;
    }
}