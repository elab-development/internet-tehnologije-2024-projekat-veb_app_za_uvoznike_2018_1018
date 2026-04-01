# Supplier–Importer Management System

Ova aplikacija predstavlja web sistem za upravljanje odnosima između
dobavljača i uvoznika, kao i za upravljanje proizvodima, kontejnerima i
poslovnim vezama između kompanija. Sistem omogućava različitim tipovima
korisnika da na jednostavan način upravljaju podacima i organizuju
poslovne procese.

Aplikacija je implementirana kao full-stack web aplikacija koja se
sastoji iz dva dela:

-   Laravel backend aplikacija – itehdomaci1
-   React frontend aplikacija – itehdomaci2

Frontend i backend međusobno komuniciraju putem REST API-ja.

## FUNKCIONALNOSTI

Administrator: 
  - pregled svih korisnika
  - kreiranje veze između dobavljača i uvoznika
  - brisanje veze između dobavljača i uvoznika

Dobavljač (Supplier): 
  - pregled dashboard-a
  - upravljanje proizvodima
  - dodavanje proizvoda
  - izmena proizvoda
  - brisanje proizvoda
  - pregled
  - povezanih uvoznika

Uvoznik (Importer): 
  - pregled dashboard-a
  - upravljanje kontejnerima
  - dodavanje kontejnera
  - izmena kontejnera
  - brisanje kontejnera
  - pregled
  - povezanih dobavljača

## TEHNOLOGIJE

Backend: 
  - Laravel
  - PHP
  - MySQL
  - Laravel Sanctum

Frontend:
  - React
  - JavaScript
  - CSS

 

## INSTALACIJA

1.  Kloniranje repozitorijuma: git clone <LINK_DO_PROJEKTA>
   

2.  Pokretanje backend aplikacije:
   
         cd itehdomaci1
         composer install
         cp .env.example .env
         php artisan key:generate
         php artisan migrate –seed
         php artisan serve

Backend aplikacija će biti dostupna na: http://127.0.0.1:8000

3.  Pokretanje frontend aplikacije:
   
          cd itehdomaci2
          npm install
          npm start

Frontend aplikacija će biti dostupna na: http://localhost:3000

 

Projekat je razvijen kao deo seminarskog rada iz predmeta Internet
tehnologije (ITEH).
