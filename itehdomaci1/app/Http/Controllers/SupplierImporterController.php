<?php

namespace App\Http\Controllers;

use App\Models\SupplierImporter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SupplierImporterController extends Controller
{
    public function index()
    {
        $relationships = SupplierImporter::with([
            'supplier:id,name,email,company_name,role',
            'importer:id,name,email,company_name,role',
        ])->latest()->get();

        return response()->json([
            'message' => 'Relationships retrieved successfully.',
            'data' => $relationships,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_id' => [
                'required',
                'exists:users,id',
            ],
            'importer_id' => [
                'required',
                'exists:users,id',
                'different:supplier_id',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier = User::findOrFail($request->supplier_id);
        $importer = User::findOrFail($request->importer_id);

        if ($supplier->role !== 'supplier') {
            return response()->json([
                'errors' => [
                    'supplier_id' => ['Izabrani korisnik nije supplier.']
                ]
            ], 422);
        }

        if ($importer->role !== 'importer') {
            return response()->json([
                'errors' => [
                    'importer_id' => ['Izabrani korisnik nije importer.']
                ]
            ], 422);
        }

        $alreadyExists = SupplierImporter::where('supplier_id', $request->supplier_id)
            ->where('importer_id', $request->importer_id)
            ->exists();

        if ($alreadyExists) {
            return response()->json([
                'errors' => [
                    'relationship' => ['Ova relacija već postoji.']
                ]
            ], 422);
        }

        $relationship = SupplierImporter::create([
            'supplier_id' => $request->supplier_id,
            'importer_id' => $request->importer_id,
        ]);

        $relationship->load([
            'supplier:id,name,email,company_name,role',
            'importer:id,name,email,company_name,role',
        ]);

        return response()->json([
            'message' => 'Relationship created successfully.',
            'data' => $relationship,
        ], 201);
    }

    public function show($id)
    {
        $relationship = SupplierImporter::with([
            'supplier:id,name,email,company_name,role',
            'importer:id,name,email,company_name,role',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Relationship retrieved successfully.',
            'data' => $relationship,
        ], 200);
    }

    public function destroy($id)
    {
        $relationship = SupplierImporter::findOrFail($id);
        $relationship->delete();

        return response()->json([
            'message' => 'Relationship deleted successfully.'
        ], 200);
    }

    public function getImportersBySupplier($supplierId)
    {
        $importers = SupplierImporter::where('supplier_id', $supplierId)
            ->with('importer:id,name,email,company_name,role')
            ->get()
            ->pluck('importer')
            ->filter()
            ->values();

        return response()->json([
            'message' => 'Importers retrieved successfully.',
            'data' => $importers,
        ], 200);
    }

    public function getSuppliersByImporter($importerId)
    {
        $suppliers = SupplierImporter::where('importer_id', $importerId)
            ->with('supplier:id,name,email,company_name,role')
            ->get()
            ->pluck('supplier')
            ->filter()
            ->values();

        return response()->json([
            'message' => 'Suppliers retrieved successfully.',
            'data' => $suppliers,
        ], 200);
    }
}