<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => '🍌 Banana', 'price' => 1.50],
            ['name' => '☕ Coffee', 'price' => 4.00],
            ['name' => '🎬 Movie Ticket', 'price' => 12.00],
            ['name' => '🍕 Pizza Slice', 'price' => 3.50],
            ['name' => '🚌 Bus Ride', 'price' => 2.25],
            ['name' => '⚡ Energy Drink', 'price' => 2.99],
            ['name' => '🍔 Burger', 'price' => 8.50],
            ['name' => '🥤 Soda', 'price' => 1.99],
            ['name' => '📱 Phone Case', 'price' => 15.00],
            ['name' => '☂️ Umbrella', 'price' => 12.99],
        ];

        foreach ($items as $item) {
            Item::firstOrCreate(
                ['name' => $item['name']],
                ['price' => $item['price']]
            );
        }
    }
}