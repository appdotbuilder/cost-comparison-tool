<?php

use App\Models\Item;

it('loads welcome page successfully', function () {
    $response = $this->get('/');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('items')
        ->has('compare_price')
        ->has('comparisons')
    );
});

it('can view cost comparison with items', function () {
    // Create test items
    Item::create(['name' => '🍌 Banana', 'price' => 1.50]);
    Item::create(['name' => '☕ Coffee', 'price' => 4.00]);
    Item::create(['name' => '🍕 Pizza', 'price' => 12.00]);

    $response = $this->get('/?compare_price=10');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('compare_price', '10')
        ->has('items', 3)
        ->has('comparisons', 3)
    );
});

it('can add new item', function () {
    $response = $this->post('/items', [
        'name' => '🚗 Car Wash',
        'price' => 15.99
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('items', [
        'name' => '🚗 Car Wash',
        'price' => 15.99
    ]);
});

it('can update existing item', function () {
    $item = Item::create(['name' => '🍔 Burger', 'price' => 8.50]);

    $response = $this->patch("/items/{$item->id}", [
        'name' => '🍔 Deluxe Burger',
        'price' => 12.50
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('items', [
        'id' => $item->id,
        'name' => '🍔 Deluxe Burger',
        'price' => 12.50
    ]);
});

it('can delete item', function () {
    $item = Item::create(['name' => '🥤 Soda', 'price' => 2.99]);

    $response = $this->delete("/items/{$item->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('items', [
        'id' => $item->id
    ]);
});

it('validates item input correctly', function () {
    // Test required fields
    $response = $this->post('/items', []);
    $response->assertSessionHasErrors(['name', 'price']);

    // Test invalid price (negative)
    $response = $this->post('/items', [
        'name' => 'Test Item',
        'price' => -5.00
    ]);
    $response->assertSessionHasErrors(['price']);

    // Test invalid price (too high)
    $response = $this->post('/items', [
        'name' => 'Test Item',
        'price' => 1000000.00
    ]);
    $response->assertSessionHasErrors(['price']);

    // Test name too long
    $response = $this->post('/items', [
        'name' => str_repeat('a', 256),
        'price' => 5.00
    ]);
    $response->assertSessionHasErrors(['name']);
});

it('calculates comparisons accurately', function () {
    Item::create(['name' => '🍌 Banana', 'price' => 1.50]);
    Item::create(['name' => '☕ Coffee', 'price' => 4.00]);

    $response = $this->get('/?compare_price=10');
    
    $response->assertInertia(fn ($page) => $page
        ->has('comparisons', 2)
    );
});