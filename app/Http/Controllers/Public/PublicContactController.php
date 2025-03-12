<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicContactController extends Controller {
    public function store( Request $request ) {
        $data = $request->validate( [
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email|max:255',
            'company_address' => 'required|string',
        ] );

        return response()->json( [
            'message' => 'Contact submitted successfully',
        ] );
    }
}
