<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Breeder;
use App\Models\BreederProduct;
use Illuminate\Http\Request;

class AdminBreederProductController extends Controller {
    public function index( Request $request, $breeder_id ) {

        $query = BreederProduct::with( ['breeder', 'product'] )->where( 'breeder_id', $breeder_id );

        // Apply search filter if the search input is provided
        if ( $request->filled( 'search' ) ) {
            $searchTerm = $request->search;
            $query->whereHas( 'product', function ( $q ) use ( $searchTerm ) {
                $q->where( 'genus', 'like', '%' . $searchTerm . '%' )
                    ->orWhere( 'species', 'like', '%' . $searchTerm . '%' );
            } );
        }
        $breederProducts = $query->paginate( 10 );
        return response()->json( $breederProducts );
    }

    public function store( Request $request, $breeder_id ) {
        $request->validate( [
            'product_id' => 'required|exists:products,id',
        ] );

        BreederProduct::create( [
            'product_id' => $request->product_id,
            'breeder_id' => $breeder_id,
        ] );

        return response()->json(
            [
                'message' => 'Product added successfully.',
            ]
        );
    }

    public function show( $breeder_id, $id ) {
        // Fetch all Products for the specified breeder
        $breederProducts = BreederProduct::find( $id )
            ->with( ['breeder', 'product'] )
            ->get();

        // Fetch the breeder details
        $breeder = Breeder::findOrFail( $breeder_id );

        return response()->json( compact( 'breeder', 'breederProducts' ) );
    }

    public function destroy( $breeder_id, $id ) {
        $breederProduct = BreederProduct::findOrFail( $id );
        $breederProduct->delete();

        return response()->json(
            [
                'message' => 'Product deleted successfully.',
            ]
        );
    }
}
