# Pembuat Link WhatsApp

Web app statis buat bikin link `wa.me` lengkap dengan pesan pembuka otomatis — cocok buat penjual online yang mau pasang link chat di bio Instagram, katalog, status WA, atau kartu nama digital. Pembeli tinggal klik, WhatsApp langsung kebuka ke nomor tujuan dan kolom chatnya sudah terisi.

## Fitur

- **Normalisasi nomor otomatis** — nomor ditulis format apa pun langsung dirapikan ke format internasional: `0812…` → `62812…`, `812…` → `62812…`, `+62 812…` → `62812…`. Hasil normalisasi ditampilkan langsung saat mengetik.
- **Validasi ramah** — nomor divalidasi 10–15 digit; kalau kependekan atau kepanjangan muncul pesan error yang jelas, bukan diam-diam gagal.
- **Template pesan siap pakai** — tiga chip template: *Tanya Produk*, *Order*, dan *Booking*. Klik, lalu edit bagian `[Nama]`, `[Produk]`, atau `[Tanggal]` (placeholder pertama otomatis tersorot).
- **Link live** — link `https://wa.me/<nomor>?text=<pesan ter-encode>` diperbarui setiap ketikan, lengkap dengan tombol **Salin Link** (ada feedback "Tersalin!") dan **Buka WhatsApp** buat ngetes langsung.
- **Pratinjau bubble chat** — tampilan ala HP pembeli: bubble hijau berisi persis pesan yang akan muncul, lengkap dengan jam saat ini dan centang dua.
- **Penghitung karakter** pesan (maksimal 1000).

## Cara Menjalankan

Nggak ada build step dan nggak ada dependensi. Cukup buka `index.html` di browser:

```bash
# opsi 1: langsung
open index.html

# opsi 2: lewat server lokal
npx serve .
```

Bisa juga langsung di-hosting statis (GitHub Pages, Netlify, Vercel) — semua proses berjalan di browser pengunjung, tidak ada data yang dikirim ke server.

## Teknologi

- HTML, CSS, dan JavaScript murni (vanilla) — tanpa framework, tanpa library eksternal selain Google Fonts.
- `encodeURIComponent` buat encoding pesan di URL, Clipboard API (dengan fallback `execCommand`) buat menyalin link.
- Desain mengikuti Remike Web Style: krem `#FFF8EC`, border 2px hitam, shadow offset keras, font Space Grotesk + Space Mono + Caveat.

## Dibuat Oleh

Remike Dev — [github.com/kirax-12](https://github.com/kirax-12)
