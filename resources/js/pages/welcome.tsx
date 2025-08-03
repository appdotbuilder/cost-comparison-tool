import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Calculator, DollarSign, ShoppingCart } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    price: number;
}

interface Comparison {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total_cost: number;
    remaining: number;
}

interface Props {
    items: Item[];
    compare_price: number;
    comparisons: Comparison[];
    success?: string;
    [key: string]: unknown;
}

export default function Welcome({ items, compare_price, comparisons, success }: Props) {
    const [comparePrice, setComparePrice] = useState<string>(compare_price.toString());
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '' });
    const [editForm, setEditForm] = useState({ name: '', price: '' });

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                // Success message will fade automatically
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCompare = () => {
        const price = parseFloat(comparePrice);
        if (price > 0) {
            router.get('/', { compare_price: price }, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const handleAddItem = () => {
        if (newItem.name && newItem.price) {
            router.post('/items', {
                name: newItem.name,
                price: parseFloat(newItem.price)
            }, {
                onSuccess: () => {
                    setNewItem({ name: '', price: '' });
                    setShowAddForm(false);
                }
            });
        }
    };

    const handleEditItem = (item: Item) => {
        setEditingItem(item);
        setEditForm({ name: item.name, price: item.price.toString() });
    };

    const handleUpdateItem = () => {
        if (editingItem && editForm.name && editForm.price) {
            router.patch(`/items/${editingItem.id}`, {
                name: editForm.name,
                price: parseFloat(editForm.price)
            }, {
                onSuccess: () => {
                    setEditingItem(null);
                    setEditForm({ name: '', price: '' });
                }
            });
        }
    };

    const handleDeleteItem = (item: Item) => {
        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
            router.delete(`/items/${item.id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                        <Calculator className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">💰 Cost Comparison</h1>
                    </div>
                    <p className="text-gray-600">See what else you could buy for that price!</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Price Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>Enter Price to Compare</span>
                        </CardTitle>
                        <CardDescription>
                            How much are you thinking of spending?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={comparePrice}
                                onChange={(e) => setComparePrice(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={handleCompare} className="bg-indigo-600 hover:bg-indigo-700">
                                Compare
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Comparison Results */}
                {comparisons.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <ShoppingCart className="h-5 w-5" />
                                <span>What You Could Buy Instead</span>
                            </CardTitle>
                            <CardDescription>
                                For {formatCurrency(compare_price)}, you could get:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {comparisons.map((comparison) => (
                                    <div
                                        key={comparison.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {comparison.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatCurrency(comparison.price)} each
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={comparison.quantity > 0 ? "default" : "secondary"}>
                                                {comparison.quantity}x
                                            </Badge>
                                            {comparison.quantity > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatCurrency(comparison.remaining)} left
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Item Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Manage Items ({items.length})</span>
                            <Button
                                size="sm"
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Add Item Form */}
                        {showAddForm && (
                            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                <Input
                                    placeholder="Item name (e.g., 🍕 Pizza)"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Price"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                />
                                <div className="flex space-x-2">
                                    <Button onClick={handleAddItem} size="sm" className="flex-1">
                                        Add Item
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewItem({ name: '', price: '' });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id}>
                                    {editingItem?.id === item.id ? (
                                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <Input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                            />
                                            <div className="flex space-x-2">
                                                <Button onClick={handleUpdateItem} size="sm" className="flex-1">
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingItem(null);
                                                        setEditForm({ name: '', price: '' });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {formatCurrency(item.price)}
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditItem(item)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(item)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No items yet. Add some to get started!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 pt-4">
                    💡 Tip: Add emojis to your item names to make them more fun!
                </div>
            </div>
        </div>
    );
}