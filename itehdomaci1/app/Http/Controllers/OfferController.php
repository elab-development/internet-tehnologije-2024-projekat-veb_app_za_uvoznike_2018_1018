<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::all();
        return response()->json($offers, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'valid_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $offer = Offer::create(array_merge($request->all(), [
            'supplier_id' => Auth::id(),
        ]));

        return response()->json(['message' => 'Offer created successfully', 'data' => $offer], 201);
    }

    public function show($id)
    {
        $offer = Offer::findOrFail($id);
        return response()->json($offer, 200);
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'valid_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $offer->update($request->all());

        return response()->json(['message' => 'Offer updated successfully', 'data' => $offer], 200);
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully'], 200);
    }
}
