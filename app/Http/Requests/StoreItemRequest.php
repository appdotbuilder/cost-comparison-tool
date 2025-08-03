<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0.01|max:999999.99',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Item name is required.',
            'name.max' => 'Item name cannot exceed 255 characters.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price must be at least $0.01.',
            'price.max' => 'Price cannot exceed $999,999.99.',
        ];
    }
}