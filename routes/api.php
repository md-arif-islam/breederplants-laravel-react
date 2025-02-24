<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGrowerProductController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminProductionReportController;
use App\Http\Controllers\Admin\AdminSalesReportController;
use App\Http\Controllers\Admin\AdminVarietyReportController;
use App\Http\Controllers\Admin\AdminVarietySampleController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BreederController;
use App\Http\Controllers\GrowerController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductionReportController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\VarietyReportController;
use App\Http\Controllers\VarietySampleController;
use Illuminate\Support\Facades\Route;

Route::post( '/admin/register', [AuthController::class, 'registerAdmin'] );
Route::post( '/login', [AuthController::class, 'login'] );
Route::post( '/send-reset-link-email', [AuthController::class, 'sendResetLinkEmail'] );

Route::post( '/logout', [AuthController::class, 'logout'] )->middleware( 'auth:sanctum' );

Route::get( '/reset-password/{token}', [AuthController::class, 'showResetForm'] )->name( 'password.reset' );
// ----------------------
Route::post( '/reset-password', [AuthController::class, 'resetPassword'] )->name( 'password.update' );

Route::get( '/user', [AuthController::class, 'authCheck'] );

Route::middleware( 'auth:sanctum' )->group( function () {

    Route::post( '/logout', [AuthController::class, 'logout'] );
    Route::get( '/user', [AuthController::class, 'authCheck'] );

} );

Route::prefix( 'admin' )->middleware( ['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class] )->group( function () {

    // export routes
    Route::get( '/breeders/export-csv', [BreederController::class, 'exportCSV'] );
    Route::get( '/growers/export-csv', [GrowerController::class, 'exportCSV'] );
    Route::get( '/variety-reports/{id}/export', [AdminVarietyReportController::class, 'export'] );
    Route::get( '/sales-reports/{id}/export', [AdminSalesReportController::class, 'export'] );
    Route::get( '/production-reports/{id}/export', [AdminProductionReportController::class, 'export'] );

    // import routes
    Route::post( '/breeders/import', [BreederController::class, 'importCSV'] );
    Route::post( '/growers/import', [GrowerController::class, 'importCSV'] );
    Route::post( '/variety-reports/import', [AdminVarietyReportController::class, 'import'] );

    // reminder
    Route::get( '/variety-reports/{id}/reminder', [AdminVarietyReportController::class, 'reminder'] );

    // Dashboard Controller
    Route::get( '/dashboard', [AdminDashboardController::class, 'index'] );

    // Growers routes
    Route::get( '/growers', [GrowerController::class, 'index'] );
    Route::get( '/growers/{grower}', [GrowerController::class, 'show'] );
    Route::post( '/growers', [GrowerController::class, 'store'] );
    Route::put( '/growers/{grower}', [GrowerController::class, 'update'] );
    Route::delete( '/growers/{grower}', [GrowerController::class, 'destroy'] );
    Route::put( '/growers/{grower}/update-password', [GrowerController::class, 'updatePassword'] );

    // Breeders routes
    Route::get( '/breeders', [BreederController::class, 'index'] );
    Route::get( '/breeders/{breeder}', [BreederController::class, 'show'] );
    Route::post( '/breeders', [BreederController::class, 'store'] );
    Route::put( '/breeders/{breeder}', [BreederController::class, 'update'] );
    Route::delete( '/breeders/{breeder}', [BreederController::class, 'destroy'] );
    Route::put( '/breeders/{breeder}/update-password', [BreederController::class, 'updatePassword'] );
    Route::get( '/breeders/export-csv', [BreederController::class, 'exportCSV'] );

    // Variety Reports
    Route::get( '/variety-reports', [AdminVarietyReportController::class, 'index'] );
    Route::get( '/variety-reports/create', [AdminVarietyReportController::class, 'create'] );
    Route::get( '/variety-reports/{id}', [AdminVarietyReportController::class, 'show'] );
    Route::post( '/variety-reports', [AdminVarietyReportController::class, 'store'] );
    Route::put( '/variety-reports/{id}', [AdminVarietyReportController::class, 'update'] );
    Route::delete( '/variety-reports/{id}', [AdminVarietyReportController::class, 'destroy'] );

    Route::get( '/variety-reports/{id}/variety-sample/create', [AdminVarietySampleController::class, 'create'] );
    Route::post( '/variety-reports/{id}/variety-sample', [AdminVarietySampleController::class, 'store'] );
    Route::get( '/variety-reports/{id}/variety-sample/{sampleId}', [AdminVarietySampleController::class, 'showVarietySample'] );
    Route::put( '/variety-reports/{id}/variety-sample/{sampleId}', [AdminVarietySampleController::class, 'update'] );
    Route::delete( '/variety-reports/{id}/variety-sample/{sampleId}', [AdminVarietySampleController::class, 'destroy'] );

    Route::get( '/products', [AdminProductController::class, 'index'] );
    Route::post( '/products', [AdminProductController::class, 'store'] );
    Route::get( '/products/{id}', [AdminProductController::class, 'show'] );
    Route::put( '/products/{id}', [AdminProductController::class, 'update'] );
    Route::delete( '/products/{id}', [AdminProductController::class, 'destroy'] );

    Route::get( '/growers/{grower_id}/products', [AdminGrowerProductController::class, 'index'] );
    Route::post( '/growers/{grower_id}/products', [AdminGrowerProductController::class, 'store'] );
    Route::get( '/growers/{grower_id}/products/{id}', [AdminGrowerProductController::class, 'show'] );
    Route::put( '/growers/{grower_id}/products/{id}', [AdminGrowerProductController::class, 'update'] );
    Route::delete( '/growers/{grower_id}/products/{id}', [AdminGrowerProductController::class, 'destroy'] );
    Route::put( '/growers/{grower_id}/products/{id}/add-quantity', [AdminGrowerProductController::class, 'addQuantity'] );

    // Sales Reports
    Route::get( '/sales-reports', [AdminSalesReportController::class, 'index'] );
    Route::get( '/sales-reports/{id}', [AdminSalesReportController::class, 'show'] );
    Route::delete( '/sales-reports/{id}/empty', [AdminSalesReportController::class, 'empty'] )->name( 'sales-reports.empty' );

    // Productions Reports
    Route::get( '/production-reports', [AdminProductionReportController::class, 'index'] );
    Route::get( '/production-reports/{id}', [AdminProductionReportController::class, 'show'] );
    Route::delete( '/production-reports/{id}/empty', [AdminProductionReportController::class, 'empty'] )->name( 'production-reports.empty' );

} );

Route::middleware( 'auth:sanctum' )->group( function () {
    Route::get( '/variety-reports', [VarietyReportController::class, 'index'] );
    Route::get( '/variety-reports/{id}', [VarietyReportController::class, 'show'] );

    Route::get( '/variety-reports/{id}/variety-sample/create', [VarietySampleController::class, 'create'] );
    Route::get( '/variety-reports/{id}/variety-sample/{sampleId}', [VarietySampleController::class, 'showVarietySample'] );
    Route::post( '/variety-reports/{id}/variety-sample', [VarietySampleController::class, 'store'] );
    Route::put( '/variety-reports/{id}/variety-sample/{sampleId}', [VarietySampleController::class, 'update'] );

    Route::get( '/sales-reports', [SalesReportController::class, 'index'] );
    Route::get( '/sales-reports/create/{year}/{quarter}', [SalesReportController::class, 'create'] );
    Route::post( '/sales-reports', [SalesReportController::class, 'store'] );

    Route::get( '/production-reports', [ProductionReportController::class, 'index'] );
    Route::get( '/production-reports/create/{year}/{quarter}', [ProductionReportController::class, 'create'] );
    Route::post( '/production-reports', [ProductionReportController::class, 'store'] );

    // Notifications
    Route::get( '/notifications', [NotificationController::class, 'getNotifications'] );
    Route::get( '/notifications/unread', [NotificationController::class, 'getUnreadNotifications'] );
    Route::post( '/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'] );
    Route::post( '/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'] );

} );

Route::get( '/clear', function () {
    \Illuminate\Support\Facades\Artisan::call( 'config:clear' );
    \Illuminate\Support\Facades\Artisan::call( 'cache:clear' );
    \Illuminate\Support\Facades\Artisan::call( 'config:cache' );
    \Illuminate\Support\Facades\Artisan::call( 'view:clear' );
    \Illuminate\Support\Facades\Artisan::call( 'route:clear' );
    \Illuminate\Support\Facades\Artisan::call( 'route:cache' );
    \Illuminate\Support\Facades\Artisan::call( 'optimize:clear' );
    return 'Cleared';
} );