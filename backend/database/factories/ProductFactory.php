<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'breeder_id' => 12,
            'genus' => $this->faker->word,
            'species' => $this->faker->word,
            'cultivar' => $this->faker->word,
            'plant_id' => $this->faker->numberBetween( 1, 100 ),
            'protection_number' => $this->faker->numberBetween( 1000, 9999 ),
            'cpvo_expiration_date' => $this->faker->dateTimeBetween( 'now', '+10 years' ),
            'royalty_fee' => $this->faker->randomFloat( 2, 0, 100 ),
            'sun_icon' => $this->faker->boolean,
            'edible_icon' => $this->faker->boolean,
            'partial_shade_icon' => $this->faker->boolean,
            'blooming_time_icon' => $this->faker->boolean,
            'blooming_period' => $this->faker->word,
            'pruning_icon' => $this->faker->boolean,
            'pruning_period' => $this->faker->word,
            'winter_hardy_icon' => $this->faker->boolean,
            'temperature' => $this->faker->randomFloat( 2, -20, 50 ),
            'height_icon' => $this->faker->boolean,
            'height' => $this->faker->randomFloat( 2, 0, 10 ),
            'width_icon' => $this->faker->boolean,
            'width' => $this->faker->randomFloat( 2, 0, 10 ),
        ];
    }
}