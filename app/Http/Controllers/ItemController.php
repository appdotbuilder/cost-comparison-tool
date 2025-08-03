<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::orderBy('name')->get();
        
        return Inertia::render('welcome', [
            'items' => $items,
            'compare_price' => 0,
            'comparisons' => [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        Item::create($request->validated());

        $items = Item::orderBy('name')->get();
        
        return Inertia::render('welcome', [
            'items' => $items,
            'compare_price' => 0,
            'comparisons' => [],
            'success' => 'Item added successfully!',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        $items = Item::orderBy('name')->get();
        
        return Inertia::render('welcome', [
            'items' => $items,
            'compare_price' => 0,
            'comparisons' => [],
            'success' => 'Item updated successfully!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $item->delete();

        $items = Item::orderBy('name')->get();
        
        return Inertia::render('welcome', [
            'items' => $items,
            'compare_price' => 0,
            'comparisons' => [],
            'success' => 'Item deleted successfully!',
        ]);
    }
}