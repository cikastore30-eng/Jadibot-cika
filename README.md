# Wawa Jadi Bot — GitHub

Ini adalah **frontend GitHub**, bukan Tenka SC.

## API
Website menggunakan:
`https://bot.wawa.cika.situ.web.id`

Domain tersebut WAJIB menjadi reverse proxy HTTPS ke Gateway Pterodactyl:
`http://server2.felix-private.web.id:2011`

Gateway di Pterodactyl tetap:
`0.0.0.0:2011`

Jangan mengubah `0.0.0.0` menjadi domain.

## Tes
Buka:
`https://bot.wawa.cika.situ.web.id/api/health`

Harus mengembalikan JSON dari Gateway, misalnya:
`{"ok":true,"service":"wawa-jadi-bot","port":2011}`

Jika yang muncul halaman HTML GitHub/Pterodactyl, reverse proxy domain API belum benar.

## Upload
Upload semua file ke GitHub Pages/static hosting:
- index.html
- style.css
- script.js
- config.js

Tenka + Gateway tetap dijalankan di Pterodactyl.
