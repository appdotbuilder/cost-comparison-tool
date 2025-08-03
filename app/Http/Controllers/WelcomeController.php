<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page with cost comparison tool.
     */
    public function index(Request $request)
    {
        $items = Item::orderBy('name')->get();
        $comparePrice = $request->get('compare_price', 0);
        
        $comparisons = [];
        if ($comparePrice > 0) {
            foreach ($items as $item) {
                $quantity = floor($comparePrice / $item->price);
                $comparisons[] = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'quantity' => $quantity,
                    'total_cost' => $quantity * $item->price,
                    'remaining' => $comparePrice - ($quantity * $item->price),
                ];
            }
        }
        
        return Inertia::render('welcome', [
            'items' => $items,
            'compare_price' => $comparePrice,
            'comparisons' => $comparisons,
        ]);
    }
}