<?php

namespace Database\Seeders;

use App\Models\Breeder;
use Illuminate\Database\Seeder;

class BreederSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        Breeder::factory( 10 )->create();
    }
}