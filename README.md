<p align="center">
  <img src="https://raw.githubusercontent.com/fauziwd/boarding-management-school-ppsalmanalfarisi/main/public/Logo/logo1.png" width="200" alt="Pesment Logo">
</p>

<h1 align="center">Boarding Management School - PP Salman Al Farisi</h1>

<p align="center">
  <strong>Pesment</strong> adalah sistem manajemen pondok pesantren modern yang dirancang untuk menjadi solusi digital terpadu bagi Pondok Pesantren Salman Al Farisi. Dibangun dengan teknologi
  <a href="https://laravel.com/" target="_blank">Laravel</a>, <a href="https://react.dev/" target="_blank">React.js</a>, dan <a href="https://inertiajs.com/" target="_blank">Inertia.js</a>,
  sistem ini bertujuan untuk menyederhanakan dan mengoptimalkan berbagai aspek manajemen, mulai dari data santri hingga pelaporan akademik.
</p>

<p align="center">
  <a href="https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi/actions"><img src="https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi/workflows/tests/badge.svg" alt="Build Status"></a>
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20.svg?style=flat-square" alt="Laravel Version">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat-square" alt="React Version">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License">
</p>

---

## 🚀 Fitur Unggulan

Pesment dilengkapi dengan serangkaian fitur yang dirancang khusus untuk memenuhi kebutuhan pesantren modern:

* **👨‍🎓 Manajemen Data Santri:**
    * **Biodata Lengkap:** Kelola informasi detail santri, termasuk data pribadi, informasi orang tua, dan alamat.
    * **Pencarian & Filter Canggih:** Temukan data santri dengan cepat berdasarkan NIS, nama, atau status.
    * **Import Data Massal:** Impor ratusan data santri sekaligus menggunakan template Excel.

* **📚 Pencatatan Akademik & Hafalan:**
    * **Progres Akademik (Durus):** Catat pencapaian santri dalam pembelajaran kitab, lengkap dengan nilai dan catatan pengajar.
    * **Progres Hafalan (Hifdz):** Monitor setoran hafalan Al-Quran santri, termasuk juz, halaman, dan nilai.
    * **Visualisasi Data:** Lihat progres hafalan melalui grafik interaktif yang informatif.

* **👨‍🏫 Manajemen Tenaga Pendidik:**
    * **Profil Guru Terpusat:** Setiap guru memiliki profil yang menampilkan data dan kelompok yang diampu.
    * **Manajemen Peran Ganda:** Seorang guru dapat memegang beberapa peran (Murobbi, Muhafidz, Mudaris) secara bersamaan.

* **👥 Manajemen Kelompok & Kelas:**
    * **Usroh & Halaqoh:** Kelola kelompok pembinaan dan kelompok hafalan dengan mudah.
    * **Kelas Belajar:** Atur kelas belajar berdasarkan kitab yang diajarkan dan tahun ajaran.

* **📊 Laporan & Analitik:**
    * **Generate Rapor Otomatis:** Buat rapor semesteran untuk semua santri dengan sekali klik.
    * **Statistik Absensi:** Dapatkan insight mengenai tingkat kehadiran santri secara keseluruhan.

* **🔐 Manajemen Akses & Peran:**
    * **Hak Akses Dinamis:** Sistem secara otomatis menyesuaikan menu dan fitur yang dapat diakses berdasarkan peran pengguna (Admin, Guru, dll).

## 🛠️ Cara Penggunaan

### Prasyarat

* PHP >= 8.2
* Composer
* Node.js & NPM
* Database (MySQL/MariaDB direkomendasikan)

### Langkah Instalasi

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi.git](https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi.git)
    cd boarding-management-school-ppsalmanalfarisi
    ```

2.  **Instalasi Dependensi:**
    ```bash
    composer install
    npm install
    ```

3.  **Konfigurasi Lingkungan:**
    * Salin file `.env.example` menjadi `.env`.
        ```bash
        cp .env.example .env
        ```
    * Buat kunci aplikasi baru.
        ```bash
        php artisan key:generate
        ```
    * Konfigurasikan koneksi database Anda di dalam file `.env`.

4.  **Migrasi & Seeding Database:**
    * Jalankan migrasi untuk membuat tabel-tabel yang dibutuhkan.
        ```bash
        php artisan migrate
        ```
    * (Opsional) Jalankan seeder untuk mengisi data awal.
        ```bash
        php artisan db:seed
        ```

5.  **Jalankan Aplikasi:**
    * Jalankan server development Vite dan Laravel.
        ```bash
        npm run dev
        ```
    * Di terminal lain, jalankan server PHP.
        ```bash
        php artisan serve
        ```

Aplikasi sekarang dapat diakses di `http://localhost:8000`.

## 📄 Hak Cipta & Lisensi

Proyek **Boarding Management School - PP Salman Al Farisi** ini dilisensikan di bawah **Lisensi MIT**.

**Pernyataan Hak Cipta:**

© 2024, Fauzi Dwi Prasetyo. Hak Cipta Dilindungi.

Berdasarkan Undang-Undang Hak Cipta yang berlaku di Indonesia (UU No. 28 Tahun 2014), seluruh kode sumber, desain, dan aset dalam repositori ini adalah milik intelektual dari **Fauzi Dwi Prasetyo**.

Lisensi MIT memberikan Anda kebebasan untuk:
* **Menggunakan:** Anda bebas menggunakan perangkat lunak ini untuk tujuan apa pun, baik pribadi, komersial, maupun pendidikan.
* **Memodifikasi:** Anda bebas mengubah dan menyesuaikan kode sumber sesuai kebutuhan Anda.
* **Mendistribusikan:** Anda bebas membagikan salinan perangkat lunak ini.
* **Sublisensi:** Anda bebas memberikan sublisensi kepada pihak lain dengan syarat yang sama.

**Kewajiban:**
Satu-satunya kewajiban Anda adalah **menyertakan pemberitahuan hak cipta dan izin lisensi asli** di semua salinan atau bagian penting dari perangkat lunak.

**Batasan:**
Perangkat lunak ini disediakan "SEBAGAIMANA ADANYA", tanpa jaminan apa pun. Pengembang tidak bertanggung jawab atas klaim, kerusakan, atau kewajiban lainnya yang timbul dari penggunaan perangkat lunak ini.

Untuk detail lengkap, silakan merujuk ke file [LICENSE](https://opensource.org/licenses/MIT) yang terdapat dalam repositori ini.

---

Terima kasih telah menggunakan dan berkontribusi pada proyek ini!
