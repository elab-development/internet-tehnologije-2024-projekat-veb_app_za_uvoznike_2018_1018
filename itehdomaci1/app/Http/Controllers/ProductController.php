<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $q = Product::query()
            ->with(['supplier:id,name,email,company_name,contact_person,phone,address,country']);

        if ($user && $user->role === 'supplier') {
            $q->where('supplier_id', $user->id);
        }

        if ($s = $request->query('q')) {
            $q->where(function ($w) use ($s) {
                $w->where('name', 'like', "%$s%")
                  ->orWhere('code', 'like', "%$s%")
                  ->orWhere('dimensions', 'like', "%$s%");
            });
        }

        if ($cat = $request->query('category')) {
            $q->where('category', $cat);
        }

        if ($min = $request->query('price_min')) {
            $q->where('price', '>=', (float) $min);
        }

        if ($max = $request->query('price_max')) {
            $q->where('price', '<=', (float) $max);
        }

        $products = $q->latest()->get();

        return response()->json([
            'message' => 'Products retrieved successfully.',
            'data' => $products,
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $q = Product::with([
            'supplier:id,name,email,company_name,contact_person,phone,address,country'
        ]);

        if ($user && $user->role === 'supplier') {
            $q->where('supplier_id', $user->id);
        }

        $product = $q->findOrFail($id);

        return response()->json([
            'message' => 'Product retrieved successfully.',
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'supplier') {
            return response()->json([
                'message' => 'Only suppliers can create products.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:products|max:255',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'dimensions' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        unset($data['image']);

        $data['supplier_id'] = $user->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = $path;
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product->load('supplier:id,name,email,company_name,contact_person,phone,address,country'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'supplier') {
            return response()->json([
                'message' => 'Only suppliers can update products.'
            ], 403);
        }

        $product = Product::where('supplier_id', $user->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:products,code,' . $product->id . '|max:255',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'dimensions' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        unset($data['image']);

        $data['supplier_id'] = $user->id;

        if ($request->hasFile('image')) {
            if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
                Storage::disk('public')->delete($product->image_path);
            }

            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = $path;
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => $product->load('supplier:id,name,email,company_name,contact_person,phone,address,country'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'supplier') {
            return response()->json([
                'message' => 'Only suppliers can delete products.'
            ], 403);
        }

        $product = Product::where('supplier_id', $user->id)->findOrFail($id);

        if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}