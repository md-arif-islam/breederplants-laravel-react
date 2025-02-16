<?php

namespace Database\Seeders;

use App\Models\Grower;
use Illuminate\Database\Seeder;

class GrowerSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        Grower::factory( 10 )->create();
    }
}