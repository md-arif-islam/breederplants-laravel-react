<?php

namespace Database\Seeders;

use App\Models\SalesReport;
use Illuminate\Database\Seeder;

class SalesReportSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        SalesReport::factory()->count( 1 )->create();
    }
}