<?php

namespace Database\Seeders;

use App\Models\GrowerProduct;
use Illuminate\Database\Seeder;

class GrowerProductSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        GrowerProduct::factory()->count( 20 )->create();
    }
}