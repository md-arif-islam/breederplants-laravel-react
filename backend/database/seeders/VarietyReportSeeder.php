<?php

namespace Database\Seeders;

use App\Models\VarietyReport;
use Illuminate\Database\Seeder;

class VarietyReportSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        VarietyReport::factory()->count( 10 )->create();
    }
}