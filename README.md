# WebComic Reader — GitHub Pages

Website reader manga/manhwa/manhua berbasis HTML/CSS/JavaScript.

## Fitur

- Home/catalog demo
- Search
- Library dengan localStorage
- Riwayat dasar
- Halaman detail comic
- Chapter list
- Load CBZ/ZIP dari URL
- Reader Webtoon / Single Page / Two Page
- Slider halaman
- Keyboard navigation
- Dark / Light theme
- Responsive mobile/tablet/desktop
- Siap dipasang di GitHub Pages

## Struktur

```text
webcomic-reader/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Deploy

1. Buat repository GitHub, misalnya `webcomic-reader`.
2. Upload semua file.
3. Settings -> Pages.
4. Source: Deploy from a branch.
5. Branch: `main`, folder `/root`.
6. Save.
7. Buka `https://USERNAME.github.io/webcomic-reader/`.

## CBZ

Tombol `Buka URL` menerima URL CBZ/ZIP yang dapat di-fetch oleh browser. Server tempat CBZ berada harus mengizinkan CORS.

Contoh URL:

```text
https://example.com/comics/chapter-01.cbz
```

Untuk file CBZ milik sendiri di GitHub, gunakan URL raw:

```text
https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/comics/chapter-01.cbz
```

## Catatan

Versi ini sengaja tidak meng-hardcode scraper/sumber pihak ketiga. Untuk katalog online, buat adapter/API milik sendiri dan pastikan penggunaan sumber serta kontennya sesuai hak dan ketentuan situs yang bersangkutan.
