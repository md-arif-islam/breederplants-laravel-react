<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Notifications\ContactSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class PublicContactController extends Controller {
    public function store( Request $request ) {
        $data = $request->validate( [
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email|max:255',
            'company_address' => 'required|string',
        ] );

        Notification::route( 'mail', 'info@onlinewithyou.nl' )
            ->notify( new ContactSubmittedNotification( $data ) );

        return response()->json( [
            'message' => 'Contact submitted successfully',
        ] );
    }
}
