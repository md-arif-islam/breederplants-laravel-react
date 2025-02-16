<?php

namespace Database\Seeders;

use App\Models\VarietySample;
use Illuminate\Database\Seeder;

class VarietySampleSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        VarietySample::factory()->count( 10 )->create();
    }
}