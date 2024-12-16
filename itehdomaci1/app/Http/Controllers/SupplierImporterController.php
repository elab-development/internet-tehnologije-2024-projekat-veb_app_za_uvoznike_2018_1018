<?php

namespace App\Http\Controllers;

use App\Models\SupplierImporter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierImporterController extends Controller
{
    public function index()
    {
        $supplierImporters = SupplierImporter::all();
        return response()->json($supplierImporters, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_id' => 'required|exists:users,id',
            'importer_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplierImporter = SupplierImporter::create($request->all());

        return response()->json([
            'message' => 'Relationship created successfully',
            'data' => $supplierImporter,
        ], 201);
    }

    public function destroy($id)
    {
        $supplierImporter = SupplierImporter::findOrFail($id);
        $supplierImporter->delete();

        return response()->json(['message' => 'Relationship deleted successfully'], 200);
    }

    public function getImportersBySupplier($supplierId)
    {
        $importers = SupplierImporter::where('supplier_id', $supplierId)
            ->with('importer')
            ->get()
            ->pluck('importer');

        return response()->json($importers, 200);
    }

    public function getSuppliersByImporter($importerId)
    {
        $suppliers = SupplierImporter::where('importer_id', $importerId)
            ->with('supplier')
            ->get()
            ->pluck('supplier');

        return response()->json($suppliers, 200);
    }
}
