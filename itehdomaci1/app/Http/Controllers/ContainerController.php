<?php

namespace App\Http\Controllers;

use App\Models\Container;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ContainerController extends Controller
{
    public function index()
    {
        $containers = Container::all();
        return response()->json($containers, 200);
    }

    public function show($id)
    {
        $container = Container::findOrFail($id);
        return response()->json($container, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'max_capacity' => 'required|numeric|min:0',
            'max_dimensions' => 'required|string|max:255',
            'total_import_cost' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,shipped,delivered',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $container = Container::create(array_merge($request->all(), [
            'importer_id' => Auth::id(),
        ]));

        return response()->json(['message' => 'Container created successfully', 'data' => $container], 201);
    }

    public function update(Request $request, $id)
    {
        $container = Container::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'max_capacity' => 'required|numeric|min:0',
            'max_dimensions' => 'required|string|max:255',
            'total_import_cost' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,shipped,delivered',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $container->update($request->all());

        return response()->json(['message' => 'Container updated successfully', 'data' => $container], 200);
    }

    public function destroy($id)
    {
        $container = Container::findOrFail($id);

        $container->delete();

        return response()->json(['message' => 'Container deleted successfully'], 200);
    }
}
