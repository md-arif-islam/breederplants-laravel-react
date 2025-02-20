<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VarietySample;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AdminVarietySampleController extends Controller {

    public function create( $id ) {

        $sample = VarietySample::where( 'variety_report_id', $id )->first();

        return response()->json( $sample );
    }

    public function store( $id, Request $request ) {
        // Validate incoming data.
        $validated = $request->validate( [
            'sample_date' => 'required|date',
            'leaf_color' => 'nullable|string',
            'amount_of_branches' => 'nullable|numeric',
            'flower_buds' => 'nullable|numeric',
            'branch_color' => 'nullable|string',
            'roots' => 'nullable|string',
            'flower_color' => 'nullable|string',
            'flower_petals' => 'nullable|numeric',
            'flowering_time' => 'nullable|string',
            'length_of_flowering' => 'nullable|string',
            'seeds' => 'nullable|string',
            'seed_color' => 'nullable|string',
            'amount_of_seeds' => 'nullable|numeric',
            'status' => 'required|boolean',
            'note' => 'nullable|string',
            'images' => 'required|array',
            'images.*' => 'required|string',
        ] );

        // Process each image.
        $storedImages = [];
        foreach ( $validated['images'] as $image ) {
            // If the image is a valid base64 encoded image, decode and store it.
            if ( preg_match( '/^data:image\/(\w+);base64,/', $image, $matches ) ) {
                try {
                    $storedImages[] = $this->saveImage( $image );
                } catch ( \Exception $e ) {
                    return response()->json( ['error' => $e->getMessage()], 422 );
                }
            } else {
                // Otherwise assume it's already a full URL/path.
                $storedImages[] = $image;
            }
        }

        // Merge processed images into data and set the variety_report_id.
        $dataToStore = $validated;
        $dataToStore['images'] = json_encode( $storedImages );
        $dataToStore['variety_report_id'] = $id;

        // Create a new record.
        $varietySample = VarietySample::create( $dataToStore );

        return response()->json( [
            'message' => 'Variety sample created successfully',
            'data' => $varietySample,
        ], 201 );
    }

    public function update( $id, $sampleId, Request $request ) {
        // Validate incoming data.
        $validated = $request->validate( [
            'sample_date' => 'required|date',
            'leaf_color' => 'nullable|string',
            'amount_of_branches' => 'nullable|numeric',
            'flower_buds' => 'nullable|numeric',
            'branch_color' => 'nullable|string',
            'roots' => 'nullable|string',
            'flower_color' => 'nullable|string',
            'flower_petals' => 'nullable|numeric',
            'flowering_time' => 'nullable|string',
            'length_of_flowering' => 'nullable|string',
            'seeds' => 'nullable|string',
            'seed_color' => 'nullable|string',
            'amount_of_seeds' => 'nullable|numeric',
            'status' => 'required|boolean',
            'note' => 'nullable|string',
            'images' => 'required|array',
            'images.*' => 'required|string',
        ] );

        // Fetch the existing variety sample
        $varietySample = VarietySample::findOrFail( $sampleId );
        $oldImages = json_decode( $varietySample->images, true ) ?? [];

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
        $varietySample->update( $dataToUpdate );

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
            'message' => 'Variety sample updated successfully',
            'data' => $varietySample,
        ], 200 );
    }

    public function showVarietySample( $id, $sampleId ) {

        $sample = VarietySample::with( 'varietyReport' )->findOrFail( $sampleId );

        return response()->json( $sample );
    }

    public function destroy( $id, $sampleId ) {
        $varietySample = VarietySample::findOrFail( $sampleId );
        $varietySample->delete();

        return response()->json( [
            'message' => 'Variety sample deleted successfully',
        ], 200 );
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

        $dir = 'images/variety-samples/';
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