import * as XLSX from 'xlsx';

const calculateTimeDifference = (currentDate, previousDate) => {
    const current = new Date(currentDate);
    const previous = new Date(previousDate);
    const diffTime = Math.abs(current - previous);

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    return `${diffDays} hari ${diffHours} jam ${diffMinutes} menit ${diffSeconds} detik`;
};

export const exportToExcel = (santri, akademiks, hafalans) => {
    // Data Diri Sheet
    const dataDiriSheet = [
        ['NIS', santri.nis],
        ['Nama', santri.nama],
        ['Tahun Lulus', santri.tahun_lulus],
        ['Tempat Lahir', santri.tempat_lahir],
        ['Tanggal Lahir', santri.tanggal_lahir],
        ['Anak Ke', santri.anak_ke],
        ['Status Yatim/Piatu', santri.status_yatim_piatu],
        ['Nama Bapak', santri.nama_bapak],
        ['Pekerjaan Bapak', santri.pekerjaan_bapak],
        ['No HP Bapak', santri.no_telpon_bapak],
        ['Nama Ibu', santri.nama_ibu],
        ['Pekerjaan Ibu', santri.pekerjaan_ibu],
        ['No HP Ibu', santri.no_telpon_ibu],
        [
            'Alamat',
            `${santri.alamat}, ${santri.kelurahan}, ${santri.kecamatan}, ${santri.kabupaten_kota}, ${santri.provinsi} - ${santri.kode_pos}`
        ]
    ];

    // Akademik Sheet
    const akademikSheet = [
        ['Kitab', 'Bab', 'Tanggal', 'Rentang Waktu']
    ];

    akademiks.forEach((akademik, index) => {
        const previous = akademiks[index + 1];
        const timeDiff = previous ? calculateTimeDifference(akademik.created_at, previous.created_at) : 'Bidayah';
        akademikSheet.push([akademik.kitab, akademik.bab, new Date(akademik.created_at).toLocaleDateString("id-ID"), timeDiff]);
    });

    // Hafalan Sheet
    const hafalanSheet = [
        ['Juz', 'Bulan', 'Tanggal', 'Rentang Waktu']
    ];

    hafalans.forEach((hafalan, index) => {
        const previous = hafalans[index + 1];
        const timeDiff = previous ? calculateTimeDifference(hafalan.created_at, previous.created_at) : 'Bidayah';
        hafalanSheet.push([hafalan.juz, hafalan.month, new Date(hafalan.created_at).toLocaleDateString("id-ID"), timeDiff]);
    });

    // Membuat workbook dan menambahkan sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dataDiriSheet), 'Data Diri');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(akademikSheet), 'Akademik');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(hafalanSheet), 'Hafalan');

    // Mengekspor file Excel
    XLSX.writeFile(wb, `Data Santri ${santri.nama}.xlsx`);
};