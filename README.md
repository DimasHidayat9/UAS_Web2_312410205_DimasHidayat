# E-Inventory — Sistem Manajemen Inventaris Barang

Proyek ini merupakan tugas Ujian Akhir Semester (UAS) mata kuliah **Pemrograman Web 2**.

## Deskripsi Proyek

**E-Inventory** adalah aplikasi sistem informasi manajemen inventaris barang berbasis web
yang dibangun menggunakan arsitektur *decoupled* (terpisah antara backend dan frontend).
Aplikasi ini mengelola data barang, kategori, supplier, stok, serta histori barang masuk
dan keluar secara real-time.

Tema studi kasus yang dipilih: **Sistem Manajemen Inventaris Barang (E-Inventory)**

---

## Screenshot Skema Relasi Tabel Database (Desainer database phpMyAdmin).

<img width="380" height="304" alt="Cuplikan layar 2026-06-23 165824" src="https://github.com/user-attachments/assets/1a8cdc80-4780-44bf-90da-14a4e6a95e9e" />

---

## Screenshot Antarmuka Aplikasi

### Halaman Login
<img width="1920" height="1080" alt="Screenshot (492)" src="https://github.com/user-attachments/assets/6859eece-e53b-476f-b2cb-cb7f2a8f82e1" />

### Dashboard Admin
<img width="1920" height="1080" alt="Screenshot (493)" src="https://github.com/user-attachments/assets/bdfe0471-6f46-406a-8b6d-9e3313d49467" />

### Tampilan Form Modal Tambah/Edit Data
<img width="1920" height="1080" alt="Screenshot (494)" src="https://github.com/user-attachments/assets/f2a85493-af3f-431f-a314-4696247ad0c6" />

---

## Petunjuk Instalasi & Menjalankan Proyek di Komputer Lokal

### Prasyarat
- XAMPP (PHP 8.x + MySQL/MariaDB aktif)
- Composer
- Browser modern (Chrome / Edge / Firefox)

---

### Langkah 1 — Persiapan Database
1. Buka **XAMPP Control Panel**, klik **Start** pada **MySQL**
2. Buka browser, akses `http://localhost/phpmyadmin`
3. Buat database baru bernama `e_inventory`
4. Klik tab **Import**, pilih file `e_inventory.sql` dari folder proyek
5. Klik **Go** untuk mengimpor

---

### Langkah 2 — Konfigurasi Backend
1. Salin folder `backend-api` ke dalam folder XAMPP:
2. Buka folder `backend-api`, salin file `env` menjadi `.env`:
```bash
cp env .env
```
3. Buka file `.env`, sesuaikan bagian database:
```env
database.default.hostname = localhost
database.default.database = e_inventory
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
```
4. Install dependency via terminal:
```bash
cd C:\xampp\htdocs\UAS_WEB2\backend-api
composer install
```

---

### Langkah 3 — Menjalankan Backend
Buka terminal, jalankan perintah berikut:
```bash
cd C:\xampp\htdocs\UAS_WEB2\backend-api
php spark serve
```
Backend API akan berjalan di:
> Biarkan terminal ini tetap terbuka selama menggunakan aplikasi.

---

### Langkah 4 — Menjalankan Frontend
1. Salin folder `frontend-spa` ke dalam folder XAMPP:
2. Pastikan **Apache** pada XAMPP sudah **Start**
3. Buka browser, akses:
---

### Langkah 5 — Login Aplikasi
Gunakan akun berikut untuk masuk sebagai administrator:

| Username | Password |
|----------|----------|
| admin    | password |


Link demo presenatsi  :

Link demo proyek      :
