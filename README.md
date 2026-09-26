# Wawa Jadi Bot — GitHub

Upload **isi ZIP ini** ke repository GitHub. Ini hanya panel website, bukan source Tenka.

## Backend
`config.js` berisi URL API Pterodactyl:
`https://bot.wawa.cika.situ.web.id`

Jika domain API berbeda, ubah `window.WAWA_API_BASE` di `config.js`.

Website memanggil:
- `POST /api/create`
- `GET /api/status/:sessionId`
- `POST /api/stop/:sessionId`

Pairing code yang ditampilkan berasal dari `requestPairingCode()` Tenka melalui API Pterodactyl.
