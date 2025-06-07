
# KTP 

KTP (KAF Tunnels Project) adalah proyek **open source** yang memungkinkan siapa saja untuk mengekspose server lokal (localhost) dari internet **tanpa memerlukan IP publik atau domain pribadi**. Proyek ini sangat cocok untuk developer, tester, atau siapa pun yang ingin membagikan aplikasi lokalnya dengan cepat dan aman ke publik.

---

## ✨ Fitur Utama

- 🚀 **Tanpa IP publik atau domain pribadi**
- 🔐 **Aman dan terenkripsi**
- 🌐 **Subdomain custom untuk setiap user**
- 🧩 **Dukungan multi-gateway (pilih server gateway sesuai kebutuhan)**
- 🤝 **Siapa pun bisa berkontribusi sebagai user atau penyedia server gateway**
- 📂 **Struktur folder sederhana: `client/` dan `server/`**
---

## 🧠 Cara Kerja Singkat

-  **Client** akan terhubung ke **Server Gateway** melalui jaringan privat ter-enkripsi.
-  Setiap **Server Gateway** menyediakan **domain/subdomain** untuk pengguna.
-  Pengguna bisa mengatur **subdomain sendiri**, selama belum dipakai orang lain.
-  Semakin banyak yang menjalankan `server`, semakin banyak pilihan gateway bagi user.

---

## 📁 Struktur Proyek

```bash
├── client/
│ ├── bin/ # File statis khusus client (CSS, JS, gambar)
│ ├── cfg/ # Konfigurasi client
│ ├── Routes/ # Route handler client
│ ├── Utils/ # Utilitas client
│ ├── tampilan/ # Template HTML client
│ └── v1.py # Program client utama
├── server/
│ ├── bin/ # File statis khusus server
│ ├── cfg/ # Konfigurasi server
│ ├── Routes/ # Route handler server
│ ├── Utils/ # Utilitas server
│ ├── tampilan/ # Template HTML server
│ └── v1.py # Program server utama
├── requirements.txt # Dependencies Python untuk keduanya
└── README.md # Dokumentasi ini
```

---

## Konfigurasi Client

File konfigurasi client ada di **client/cfg/server_cfg.min** dengan format :

```json
  {
    "system":{
		"import_config":true,
		"builder_log":false
	},
	"log":{
		"show_log":true,
		"path":"./",
		"notif":{
			"status":false,
			"token":"",
			"id_account":"",
			"static_text":"⚠️ Terjadi Error ‼️ \n\n"
		}
	},
	"gateway":{
		"peers":[
			{
				"url":"tls://103.189.235.209:9001",
				"endpoint":"ktp.kaf.web.id"
			}
		],
		"admin_port":9001,
		"req_domain":"test",
		"engine":1
	},
	"server": {
		"https":false,
		"ws_host":"",
        "port": 5758,
        "host": "::",
        "secret_key": "J2S-KAF-Server",
        "static_path": "bin",
        "template_path": "tampilan",
		"expose":{
			"url":"http://localhost:8000",
			"timeout":30.0
		}
    },
	"database":{
		"host":"",
		"source":""
	},
    "routes": {
        "modul_name": "Routes.routes",
        "class_name": "Routes",
		"Utama":{
			"url":"/{path:path}",
			"methods":["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
			"function": "Utama"
		}
	}
}

```

---

###### Keterangan:
BAGIAN       | KEY           | TIPE             | DESKRIPSI
-------------|---------------|------------------|--------------------------------------------------------------
log          | show_log         | bool             | Tampilkan log ke console (true/false)
|            | path             | string           | Direktori tempat menyimpan log
|            | notif.status     | bool             | Aktifkan notifikasi error ke Telegram (true/false)
|           | notif.token      | string           | Token bot Telegram
|           | notif.id_account | string           | ID Telegram tujuan notifikasi
|           | notif.static_text| string           | Teks notifikasi default saat error
|            | notif.static_text | string      | Pesan notifikasi saat error terjadi
gateway      | peers        | list of object   | Daftar gateway yang tersedia untuk dikoneksi
|            | peers[].url      | string           | Alamat protokol gateway (contoh: tls://ip:port)
|            | peers[].endpoint | string           | Domain endpoint milik server gateway
|            | admin_port   | int             | Port admin untuk ambil ipv6 dan status koneksi
|            | req_domain   | string           | Subdomain yang akan di request / digunakan
|            | engine       | int              | Jenis Engine Sementara Pilih No 1
server       | https            | bool             | Aktifkan HTTPS untuk endpoint expose (true/false)
|            | ws_host          | string           | Host untuk WebSocket (opsional, bisa kosong)
|            | port             | int              | Port lokal untuk expose aplikasi
|            | host             | string           | IP lokal harus (::) Karena Untuk Terima Requests Dari Server Gateway
|            | secret_key       | string           | Kunci autentikasi aplikasi (opsional, bisa kosong)
|            | static_path      | string           | Direktori untuk file statis
|            | template_path    | string           | Direktori untuk template HTML
|            | expose.url       | string           | URL lokal aplikasi yang ingin di-expose. Contohnya http://127.0.0.1:8000 Maka Port 8000 Pada localhost Yang Akan Di expose
|            | expose.timeout   | float            | Timeout koneksi expose dalam detik
| routes     | modul_name       | string           | Nama modul file routing Python
|            | class_name       | string           | Nama class di modul routing
|            | Utama.url        | string           | Url Yang Di Set Untuk Suatu Routes 
|            | Utama.methods    | list[string]     | Daftar metode HTTP yang diterima Oleh Suatu Routes
|            | Utama.function   | string           | Fungsi Yang Akan Dijalankan Pada Suatu Routes

---

## Konfigurasi Server

File konfigurasi client ada di **server/cfg/server_cfg.min** dengan format :

```json
  {
    "system":{
		"import_config":true,
		"builder_log":false
	},
	"log":{
		"show_log":true,
		"path":"./",
		"notif":{
			"status":false,
			"token":"<<token_bot_telegram>>",
			"id_account":"<<id_akun_telegram>>",
			"static_text":"⚠️ Terjadi Error ‼️ \n\n"
		}
	},
	"server": {
		"https":false,
		"ws_host":"",
        "port": 8000,
        "host": "127.0.0.1",
        "secret_key": "<<secret_key>>",
        "static_path": "bin",
        "template_path": "tampilan",
		"cf_token":"<<token_cloudflare>>",
		"zone_name":"<<domain_yang_dipilih>>",
		"interval_check":60
		
    },
    "routes": {
        "modul_name": "Routes.routes",
        "class_name": "Routes",
		"Api":{
			"url":"/api/{version}/{mode}",
			"methods":["POST", "GET"],
			"function": "API"
		},
		"Home":{
			"url":"/",
			"methods":["GET"],
			"function": "Home"
		},
		"Node":{
			"url":"/node",
			"methods":["GET"],
			"function": "Node"
		}
	}
}

```

###### Keterangan
BAGIAN       | KEY           | TIPE             | DESKRIPSI
-------------|---------------|------------------|--------------------------------------------------------------
log          | show_log         | bool             | Tampilkan log ke console (true/false)
|            | path             | string           | Direktori tempat menyimpan log
|            | notif.status     | bool             | Aktifkan notifikasi error ke Telegram (true/false)
|           | notif.token      | string           | Token bot Telegram
|           | notif.id_account | string           | ID Telegram tujuan notifikasi
|           | notif.static_text| string           | Teks notifikasi default saat error
|            | notif.static_text | string      | Pesan notifikasi saat error terjadi
gateway      | peers        | list of object   | Daftar gateway yang tersedia untuk dikoneksi
|            | peers[].url      | string           | Alamat protokol gateway (contoh: tls://ip:port)
|            | peers[].endpoint | string           | Domain endpoint milik server gateway
|            | admin_port   | int             | Port admin untuk ambil ipv6 dan status koneksi
|            | req_domain   | string           | Subdomain yang akan di request / digunakan
|            | engine       | int              | Jenis Engine Sementara Pilih No 1
server       | https            | bool             | Aktifkan protokol HTTPS (true/false)
|            | ws_host          | string           | Host WebSocket jika digunakan
|             | port             | int              | Port publik yang akan digunakan server gateway
|            | host             | string           | Host listener (contoh: 127.0.0.1)
|            | secret_key       | string           | Kunci rahasia 
|            | static_path      | string           | Folder berisi file statis (js, css, dsb)
|            | template_path    | string           | Folder HTML frontend server
|            | cf_token         | string           | Token API Cloudflare untuk kelola DNS
|            | zone_name        | string           | Domain/zone yang digunakan gateway
|            | interval_check   | int              | Interval pengecekan status koneksi tiap node (detik)|

---

## ⚙️ Cara Menggunakan

### 1. 📥 Clone Repository
```bash
  git clone https://github.com/staykimin/KTP.git
  cd KTP
```
---

### 2. 📦 Siapkan Lingkungan Python

###### Buat virtual environment
```python
  python -m venv venv
```
###### Aktifkan virtualenv

**Windows**
```python
  venv\Scripts\activate
```

**Linux**
```python
  source venv/bin/activate
```

###### Install dependensi
```python
  pip install -r req.min
```

### 3. 🚀 Jalankan Program
```
  python v1.py
```
---

## 🌍 Melihat koneksi Node

Status Koneksi Tiap Node Bisa Diakses di :

🔗 https://ktp.kaf.web.id
