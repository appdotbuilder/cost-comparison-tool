<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Item>
     */
    protected $model = Item::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $items = [
            ['name' => 'Banana', 'price' => 1.50],
            ['name' => 'Coffee', 'price' => 4.00],
            ['name' => 'Movie Ticket', 'price' => 12.00],
            ['name' => 'Pizza Slice', 'price' => 3.50],
            ['name' => 'Bus Ride', 'price' => 2.25],
            ['name' => 'Energy Drink', 'price' => 2.99],
            ['name' => 'Burger', 'price' => 8.50],
            ['name' => 'Soda', 'price' => 1.99],
        ];

        $item = fake()->randomElement($items);

        return [
            'name' => $item['name'],
            'price' => $item['price'],
        ];
    }
}