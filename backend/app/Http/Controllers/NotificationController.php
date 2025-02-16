<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller {
    public function getNotifications( Request $request ) {
        return $request->user()->notifications;
    }

    public function getUnreadNotifications( Request $request ) {
        Log::info( "Fetching unread notifications" );
        return $request->user()->unreadNotifications;
    }

    public function markAsRead( $id, Request $request ) {
        $notification = $request->user()->notifications()->findOrFail( $id );
        $notification->markAsRead();
        return response()->json( ['message' => 'Notification marked as read'] );
    }

    public function markAllAsRead( Request $request ) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json( ['message' => 'All notifications marked as read'] );
    }
}