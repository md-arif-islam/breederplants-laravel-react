<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grower;
use App\Models\GrowerProduct;
use Illuminate\Http\Request;

class AdminGrowerProductController extends Controller {
    public function index( Request $request, $grower_id ) {

        $query = GrowerProduct::with( ['grower', 'product'] )->where( 'grower_id', $grower_id );

        // Apply search filter if the search input is provided
        if ( $request->filled( 'search' ) ) {
            $searchTerm = $request->search;
            $query->whereHas( 'product', function ( $q ) use ( $searchTerm ) {
                $q->where( 'genus', 'like', '%' . $searchTerm . '%' )
                    ->orWhere( 'species', 'like', '%' . $searchTerm . '%' );
            } );
        }
        $growerProducts = $query->paginate( 10 );
        return response()->json( $growerProducts );
    }

    public function store( Request $request, $grower_id ) {
        $request->validate( [
            'product_id' => 'required|exists:products,id',
            'unit_price' => 'required|numeric|between:0,999999.99',
            'stock' => 'required|integer',
        ] );

        GrowerProduct::create( [
            'product_id' => $request->product_id,
            'grower_id' => $grower_id,
            'unit_price' => $request->unit_price,
            'stock' => $request->stock,
        ] );

        return response()->json(
            [
                'message' => 'Product added successfully.',
            ]
        );
    }

    public function show( $grower_id, $id ) {
        // Fetch all grower product details for the specified grower
        $growerProducts = GrowerProduct::find( $id )
            ->with( ['grower', 'product'] )
            ->get();

        // Fetch the grower details
        $grower = Grower::findOrFail( $grower_id );

        return response()->json( compact( 'grower', 'growerProducts' ) );
    }

    public function addQuantity( Request $request, $grower_id, $id ) {

        $request->validate( [
            'quantity' => 'required|integer|min:1',
        ] );

        // Find the grower product detail and update the stock
        $growerProduct = GrowerProduct::findOrFail( $id );
        $growerProduct->stock += $request->quantity;
        $growerProduct->save();

        return response()->json( [
            'message' => 'Stock added successfully.',
        ] );
    }

    public function update( Request $request, $grower_id, $id ) {

        $request->validate( [
            'unit_price' => 'required|numeric|between:0,999999.99',
            'stock' => 'required|integer',
        ] );

        $growerProduct = GrowerProduct::findOrFail( $id );
        $growerProduct->update( $request->all() );

        return response()->json(
            [
                'message' => 'Product updated successfully.',
                'growerProduct' => $growerProduct,
            ]
        );
    }

    public function destroy( $grower_id, $id ) {
        $growerProduct = GrowerProduct::findOrFail( $id );
        $growerProduct->delete();

        return response()->json(
            [
                'message' => 'Product deleted successfully.',
            ]
        );
    }
}
