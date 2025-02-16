<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller {

    public function registerAdmin( Request $request ) {

        $request->validate( [
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'role' => 'required',
            'is_active' => 'required',
            'fcm_token' => 'nullable',
        ] );

        $user = User::create( [
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'is_active' => $request->is_active,
            'fcm_token' => $request->fcm_token,
        ] );

        $token = $user->createToken( $request->email )->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
            'message' => 'User registered successfully',
        ];
    }

    public function login( Request $request ) {

        $request->validate( [
            'email' => 'required|email',
            'password' => 'required',
        ] );

        $user = User::where( 'email', $request->email )->with( 'grower', 'breeder' )->first();

        if ( !$user || !\Hash::check( $request->password, $user->password ) ) {
            return response()->json( [
                'message' => 'Invalid credentials',
            ], 401 );
        }
        $token = $user->createToken( $request->email )->plainTextToken;

        return response()->json( [
            'token' => $token,
            'user' => $user,
            'message' => 'User logged in successfully',
        ], 200 );

    }

    public function authCheck( Request $request ) {
        return $request->user();
    }

    public function logout( Request $request ) {
        $request->user()->tokens()->delete();

        return response()->json( [
            'message' => 'User logged out successfully',
        ], 200 );
    }

    public function sendResetLinkEmail( Request $request ) {
        $request->validate( ['email' => 'required|email'] );

        $user = User::whereEmail( $request->email )->first();

        $status = Password::sendResetLink(
            $request->only( 'email' ),
            function ( $user, $token ) {
                $url = env( 'FRONTEND_URL' ) . '/reset-password?token=' . $token . '&email=' . urlencode( $user->email );
                $user->sendPasswordResetNotification( $token, $url );
            }
        );

        return $status === Password::RESET_LINK_SENT
        ? response()->json( ['message' => __( 'Password reset link sent' )], 200 )
        : response()->json( ['error' => [__( 'Email could not be sent' )]], 422 );
    }

    public function resetPassword( Request $request ) {
        $request->validate( [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ] );

        $user = User::whereEmail( $request->email )->first();
        $user->password = bcrypt( $request->password );
        $user->save();

        return response()->json( [
            'message' => 'Password reset successfully',
        ], 200 );
    }

    public function showResetForm( Request $request, $token = null ) {
        return response()->json( [
            'token' => $token,
            'email' => $request->email,
        ], 200 );
    }
}