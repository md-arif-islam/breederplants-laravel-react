<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GrowerProduct>
 */
class GrowerProductFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'product_id' => 2,
            'grower_id' => 27,
            'unit_price' => $this->faker->randomFloat( 2, 10, 100 ),
            'stock' => $this->faker->randomNumber( 3, false ),
        ];
    }
}