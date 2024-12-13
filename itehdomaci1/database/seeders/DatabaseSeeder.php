<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create Admin User
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'company_name' => 'AdminCorp',
            'contact_person' => $faker->name,
            'phone' => $faker->phoneNumber,
            'address' => $faker->address,
            'country' => $faker->country,
        ]);

        // Create Supplier Users
        for ($i = 0; $i < 5; $i++) {
            DB::table('users')->insert([
                'name' => $faker->company,
                'email' => $faker->unique()->companyEmail,
                'password' => Hash::make('password'),
                'role' => 'supplier',
                'company_name' => $faker->company,
                'contact_person' => $faker->name,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'country' => $faker->country,
            ]);
        }

        // Create Importer Users
        for ($i = 0; $i < 5; $i++) {
            DB::table('users')->insert([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'role' => 'importer',
                'company_name' => $faker->company,
                'contact_person' => $faker->name,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'country' => $faker->country,
            ]);
        }

        // Create Products
        for ($i = 0; $i < 20; $i++) {
            DB::table('products')->insert([
                'code' => Str::upper(Str::random(8)),
                'name' => $faker->word,
                'image_path' => $faker->imageUrl,
                'dimensions' => $faker->randomNumber(2) . 'x' . $faker->randomNumber(2) . 'x' . $faker->randomNumber(2) . ' cm',
                'features' => $faker->sentence,
                'price' => $faker->randomFloat(2, 10, 1000),
                'category' => $faker->word,
                'supplier_id' => rand(2, 6), // Assuming Supplier IDs start from 2
            ]);
        }

        // Create Offers
        for ($i = 0; $i < 10; $i++) {
            DB::table('offers')->insert([
                'description' => $faker->paragraph,
                'valid_until' => $faker->dateTimeBetween('+1 week', '+1 month'),
                'supplier_id' => rand(2, 6), // Assuming Supplier IDs start from 2
            ]);
        }

        // Create Containers
        for ($i = 0; $i < 10; $i++) {
            DB::table('containers')->insert([
                'name' => $faker->word . ' Container',
                'max_capacity' => $faker->numberBetween(100, 1000),
                'max_dimensions' => $faker->randomNumber(2) . 'x' . $faker->randomNumber(2) . 'x' . $faker->randomNumber(2) . ' cm',
                'total_import_cost' => $faker->randomFloat(2, 1000, 10000),
                'importer_id' => rand(7, 11), // Assuming Importer IDs start from 7
                'status' => $faker->randomElement(['pending', 'shipped', 'delivered']),
            ]);
        }

        // Create Supplier-Importer Relationships
        for ($i = 0; $i < 10; $i++) {
            DB::table('supplier_importers')->insert([
                'supplier_id' => rand(2, 6), // Assuming Supplier IDs start from 2
                'importer_id' => rand(7, 11), // Assuming Importer IDs start from 7
            ]);
        }
    }
}
