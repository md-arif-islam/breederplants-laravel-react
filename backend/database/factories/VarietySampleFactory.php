<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VarietySample>
 */
class VarietySampleFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'variety_report_id' => 2,
            'images' => json_encode( [
                'http://127.0.0.1:8000/images/hydrangea-paniculata.jpg',
                'http://127.0.0.1:8000/images/45Ta1xRYGmf7qwbr.jpeg',
            ] ),
            'sample_date' => $this->faker->date(),
            'leaf_color' => $this->faker->safeColorName(),
            'amount_of_branches' => $this->faker->numberBetween( 1, 10 ),
            'flower_buds' => $this->faker->numberBetween( 1, 20 ),
            'branch_color' => $this->faker->safeColorName(),
            'roots' => $this->faker->word(),
            'flower_color' => $this->faker->safeColorName(),
            'flower_petals' => $this->faker->numberBetween( 1, 10 ),
            'flowering_time' => $this->faker->word(),
            'length_of_flowering' => $this->faker->word(),
            'seeds' => $this->faker->word(),
            'seed_color' => $this->faker->safeColorName(),
            'amount_of_seeds' => $this->faker->numberBetween( 1, 100 ),
            'note' => $this->faker->paragraph(),
            'status' => $this->faker->boolean(),
        ];
    }
}
