<?php

namespace Database\Factories;

use App\Models\Breeder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Breeder>
 */
class BreederFactory extends Factory {
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Breeder::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'user_id' => rand( 11, 21 ),
            'username' => $this->faker->userName(),
            'company_name' => $this->faker->company(),
            'company_email' => $this->faker->unique()->safeEmail(),
            'contact_person' => $this->faker->name(),
            'street' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'country' => $this->faker->country(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'website' => $this->faker->optional()->url(),
        ];
    }
}