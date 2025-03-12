<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicProductController extends Controller {
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $products = Product::when( $query, function ( $q ) use ( $query ) {
            return $q->where( 'genus', 'like', "%{$query}%" )
                ->orWhere( 'species', 'like', "%{$query}%" )
                ->orWhere( 'cultivar', 'like', "%{$query}%" );
        } )->paginate( 20 );

        return response()->json( $products );
    }

    public function show( $id ) {
        $product = Product::findOrFail( $id );
        return response()->json( ['product' => $product] );
    }
}
