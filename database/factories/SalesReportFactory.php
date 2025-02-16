<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesReport>
 */
class SalesReportFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'grower_id' => 27,
            'submission_date' => null,
            'data' => null,
            'quarter' => 'q1',
            'year' => 2025,
            'quarters_array' => json_encode(
                [
                    [
                        'year' => 2025,
                        'quarter' => 'q1',
                    ],
                ]
            ),
            'total' => 23400.00,
        ];
    }
}