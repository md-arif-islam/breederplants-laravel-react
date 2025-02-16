<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Breeder;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller {
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $products = Product::with( 'breeder' )->when( $query, function ( $q ) use ( $query ) {
            return $q->where( 'genus', 'like', "%{$query}%" )
                ->orWhere( 'species', 'like', "%{$query}%" )
                ->orWhere( 'cultivar', 'like', "%{$query}%" );
        } )->paginate( 20 );

        return response()->json( $products );
    }

    public function store( Request $request ) {
        $request->validate( [
            'breeder_id' => 'nullable|exists:breeders,id',
            'genus' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'cultivar' => 'nullable|string|max:255',
            'plant_id' => 'nullable|integer',
            'protection_number' => 'nullable|integer',
            'cpvo_expiration_date' => 'nullable|date',
            'royalty_fee' => 'nullable|numeric',
            'sun_icon' => 'nullable|boolean',
            'edible_icon' => 'nullable|boolean',
            'partial_shade_icon' => 'nullable|boolean',
            'blooming_time_icon' => 'nullable|boolean',
            'blooming_period' => 'nullable|string|max:255',
            'pruning_icon' => 'nullable|boolean',
            'pruning_period' => 'nullable|string|max:255',
            'winter_hardy_icon' => 'nullable|boolean',
            'temperature' => 'nullable|numeric',
            'height_icon' => 'nullable|boolean',
            'height' => 'nullable|numeric',
            'width_icon' => 'nullable|boolean',
            'width' => 'nullable|numeric',
        ] );

        $product = Product::create( $request->all() );

        return response()->json(
            [
                'message' => 'Product created successfully',
                'product' => $product,
            ]
        );
    }

    public function show( $id ) {
        $product = Product::findOrFail( $id );
        $breeders = Breeder::all();

        return response()->json(
            ['product' => $product,
                'breeders' => $breeders]
        );
    }

    public function update( Request $request, $id ) {
        $request->validate( [
            'breeder_id' => 'nullable|exists:breeders,id',
            'genus' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'cultivar' => 'nullable|string|max:255',
            'plant_id' => 'nullable|integer',
            'protection_number' => 'nullable|integer',
            'cpvo_expiration_date' => 'nullable|date',
            'royalty_fee' => 'nullable|numeric',
            'sun_icon' => 'nullable|boolean',
            'edible_icon' => 'nullable|boolean',
            'partial_shade_icon' => 'nullable|boolean',
            'blooming_time_icon' => 'nullable|boolean',
            'blooming_period' => 'nullable|string|max:255',
            'pruning_icon' => 'nullable|boolean',
            'pruning_period' => 'nullable|string|max:255',
            'winter_hardy_icon' => 'nullable|boolean',
            'temperature' => 'nullable|numeric',
            'height_icon' => 'nullable|boolean',
            'height' => 'nullable|numeric',
            'width_icon' => 'nullable|boolean',
            'width' => 'nullable|numeric',
        ] );

        $product = Product::findOrFail( $id );
        $product->update( $request->all() );

        return response()->json( [
            'message' => 'Product updated successfully',
            'product' => $product,
        ] );
    }

    public function destroy( $id ) {
        $product = Product::findOrFail( $id );
        $product->delete();

        return response()->json( [
            'message' => 'Product deleted successfully',
        ] );
    }
}