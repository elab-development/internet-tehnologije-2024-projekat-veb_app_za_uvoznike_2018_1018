<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    //prepravljena metoda index za react domaci tako da importer vidi samo proizvode od supplier-a povezanih kroz supplier_importers
    public function index(Request $request)
    {
        $q =  Product::query()
        ->with(['supplier:id,name,email,company_name,contact_person,phone,address,country']);
 
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


    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'message' => 'Product retrieved successfully.',
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:products|max:255',
            'name' => 'required|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Ako postoji ulogovani korisnik, koristi njegov ID
        if ($request->user()) {
            $data['supplier_id'] = $request->user()->id;
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:products,code,' . $product->id . '|max:255',
            'name' => 'required|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Ako postoji ulogovani korisnik, koristi njegov ID
        if ($request->user()) {
            $data['supplier_id'] = $request->user()->id;
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => $product,
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
