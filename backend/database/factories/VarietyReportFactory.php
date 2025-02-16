<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VarietyReport>
 */
class VarietyReportFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'user_id' => 1,
            'grower_id' => 2,
            'breeder_id' => 12,
            'variety_name' => $this->faker->word(),
            'thumbnail' => '',
            'amount_of_plants' => $this->faker->numberBetween( 1, 1000 ),
            'pot_size' => $this->faker->word(),
            'pot_trial' => $this->faker->boolean(),
            'open_field_trial' => $this->faker->boolean(),
            'date_of_propagation' => $this->faker->date(),
            'date_of_potting' => $this->faker->date(),
            'samples_schedule' => '["2024-11-26", "2024-11-29"]',
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'status' => $this->faker->boolean(),
        ];
    }
}