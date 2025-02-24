<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table( 'growers', function ( Blueprint $table ) {
            $table->text( 'production_reporting_quarter' )->after( 'sales_reporting_quarter' );
            $table->text( 'production_reporting_values' )->after( 'production_reporting_quarter' );
        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table( 'growers', function ( Blueprint $table ) {
            $table->dropColumn( 'production_reporting_quarter' );
            $table->dropColumn( 'production_reporting_values' );
        } );
    }
};