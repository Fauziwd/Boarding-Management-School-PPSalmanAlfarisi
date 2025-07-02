<p align="center">
  <img src="https://raw.githubusercontent.com/fauziwd/boarding-management-school-ppsalmanalfarisi/main/public/Logo/logo1.png" width="200" alt="Pesment Logo">
</p>

<h1 align="center">Boarding Management School - PP Salman Al Farisi</h1>

<p align="center">
  <a href="https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi/actions"><img src="https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi/workflows/tests/badge.svg" alt="Build Status"></a>
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20.svg?style=flat-square" alt="Laravel Version">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat-square" alt="React Version">
  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg?style=flat-square" alt="License"></a>
</p>

---

<p align="center">
  <strong>(ID)</strong> <strong>Pesment</strong> adalah sistem manajemen pondok pesantren modern yang dirancang untuk menjadi solusi digital terpadu bagi Pondok Pesantren Salman Al Farisi. Dibangun dengan teknologi <a href="https://laravel.com/" target="_blank">Laravel</a>, <a href="https://react.dev/" target="_blank">React.js</a>, dan <a href="https://inertiajs.com/" target="_blank">Inertia.js</a>, sistem ini bertujuan untuk menyederhanakan dan mengoptimalkan berbagai aspek manajemen, mulai dari data santri hingga pelaporan akademik.
</p>
<p align="center">
  <strong>(EN)</strong> <strong>Pesment</strong> is a modern Islamic boarding school management system designed as an integrated digital solution for Pondok Pesantren Salman Al Farisi. Built with <a href="https://laravel.com/" target="_blank">Laravel</a>, <a href="https://react.dev/" target="_blank">React.js</a>, and <a href="https://inertiajs.com/" target="_blank">Inertia.js</a>, this system aims to simplify and optimize various management aspects, from student data to academic reporting.
</p>

---

## 🚀 Key Features / Fitur Unggulan

<details>
<summary><strong>English</strong></summary>

* **👨‍🎓 Student Management:**
    * **Complete Biodata:** Manage detailed student information, including personal data, parent information, and addresses.
    * **Advanced Search & Filter:** Quickly find student data by student ID (NIS), name, or status.
    * **Bulk Data Import:** Import hundreds of student records at once using a provided Excel template.

* **📚 Academic & Memorization Tracking:**
    * **Academic Progress (Durus):** Record students' achievements in their book studies, complete with grades and teacher notes.
    * **Quran Memorization Progress (Hifdz):** Monitor students' Quran memorization submissions, including juz, page, and scores.
    * **Data Visualization:** View memorization progress through informative and interactive charts.

* **👨‍🏫 Teacher Management:**
    * **Centralized Teacher Profiles:** Each teacher has a profile page displaying their data and assigned groups.
    * **Multiple Role Management:** A teacher can hold several roles simultaneously (e.g., Murobbi, Muhafidz, Mudaris).

* **👥 Group & Class Management:**
    * **Usroh & Halaqoh:** Easily manage coaching groups and memorization circles.
    * **Study Classes:** Organize classes based on the books being taught and the academic year.

* **📊 Reporting & Analytics:**
    * **Automatic Report Card Generation:** Create semester report cards for all students with a single click.
    * **Attendance Statistics:** Gain insights into overall student attendance rates.

* **🔐 Access & Role Management:**
    * **Dynamic Access Control:** The system automatically adjusts menus and features based on the user's role (Admin, Teacher, etc.).

</details>

<details>
<summary><strong>Bahasa Indonesia</strong></summary>

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

</details>

## 🛠️ Getting Started / Cara Penggunaan

### Prerequisites / Prasyarat

* PHP >= 8.2
* Composer
* Node.js & NPM
* Database (MySQL/MariaDB is recommended)

### Installation Steps / Langkah Instalasi

1.  **Clone the repository / Clone repositori:**
    ```bash
    git clone [https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi.git](https://github.com/fauziwd/boarding-management-school-ppsalmanalfarisi.git)
    cd boarding-management-school-ppsalmanalfarisi
    ```

2.  **Install dependencies / Instalasi dependensi:**
    ```bash
    composer install
    npm install
    ```

3.  **Environment configuration / Konfigurasi lingkungan:**
    * Copy `.env.example` to `.env`.
        ```bash
        cp .env.example .env
        ```
    * Generate a new application key.
        ```bash
        php artisan key:generate
        ```
    * Configure your database connection in the `.env` file.

4.  **Database migration & seeding / Migrasi & seeding database:**
    * Run migrations to create the necessary tables.
        ```bash
        php artisan migrate
        ```
    * (Optional) Run seeders to populate initial data.
        ```bash
        php artisan db:seed
        ```

5.  **Run the application / Jalankan aplikasi:**
    * Run the Vite and Laravel development servers.
        ```bash
        npm run dev
        ```
    * In another terminal, run the PHP server.
        ```bash
        php artisan serve
        ```

The application is now accessible at `http://localhost:8000`.

## 📄 Copyright & License / Hak Cipta & Lisensi

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />
Copyright © 2024, Fauzi Adi Wijaya. All Rights Reserved.

<details>
<summary><strong>View License Details (English)</strong></summary>

This license allows you to:
* **Share** — copy and redistribute the material in any medium or format.
* **Adapt** — remix, transform, and build upon the material.

Under the following terms:
* **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
* **NonCommercial** — You may not use the material for commercial purposes.
* **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

**Restriction:**
You are **not permitted** to sell this software or its derivatives.

For full details, please refer to the [legal code of the CC BY-NC-SA 4.0 license](http://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).
</details>

<details>
<summary><strong>Lihat Detail Lisensi (Bahasa Indonesia)</strong></summary>

Berdasarkan lisensi ini, Anda bebas untuk:
* **Berbagi** — menyalin dan menyebarluaskan materi dalam media atau format apa pun.
* **Adaptasi** — menggubah, mengubah, dan membuat turunan dari materi.

Dengan syarat berikut:
* **Atribusi (Attribution)** — Anda harus memberikan kredit yang sesuai, menyediakan tautan ke lisensi, dan menunjukkan jika ada perubahan yang dilakukan.
* **NonKomersial (NonCommercial)** — Anda tidak dapat menggunakan materi ini untuk tujuan komersial.
* **BerbagiSerupa (ShareAlike)** — Jika Anda mengubah atau membuat turunan dari materi ini, Anda harus mendistribusikan kontribusi Anda di bawah lisensi yang sama dengan aslinya.

**Larangan:**
Anda **tidak diizinkan** untuk menjual perangkat lunak ini atau karya turunannya.

Untuk detail lengkap, silakan merujuk ke [teks legal lisensi CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/).
</details>

---

Thank you for using and contributing to this project!
