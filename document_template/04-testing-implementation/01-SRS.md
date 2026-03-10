# Software Requirements Specification (SRS)
# {{NAMA_PROYEK}}

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan spesifikasi kebutuhan perangkat lunak untuk {{NAMA_PROYEK}}, yang mencakup kebutuhan fungsional, non-fungsional, dan batasan sistem.

### 1.2 Ruang Lingkup Produk
{{Jelaskan ruang lingkup produk secara ringkas: apa yang dilakukan sistem, untuk siapa, dan modul apa saja yang dicakup.}}

### 1.3 Referensi
- {{Dokumen referensi 1 (TOR, kontrak, dll)}}
- {{Dokumen referensi 2}}
- {{Dokumen referensi 3}}

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk
{{Jelaskan perspektif produk: apakah ini aplikasi baru, bagian dari sistem yang lebih besar, atau pengganti sistem lama. Sertakan platform dan teknologi utama.}}

### 2.2 Fungsi Produk

| ID | Fungsi | Modul |
|----|--------|-------|
| SRS-F01 | {{Deskripsi fungsi 1}} | {{Modul}} |
| SRS-F02 | {{Deskripsi fungsi 2}} | {{Modul}} |
| SRS-F03 | {{Deskripsi fungsi 3}} | {{Modul}} |
| SRS-F04 | {{Deskripsi fungsi 4}} | {{Modul}} |
| SRS-F05 | {{Deskripsi fungsi 5}} | {{Modul}} |

### 2.3 Karakteristik Pengguna

| Tipe User | Jumlah Estimasi | Skill Level | Akses |
|-----------|-----------------|-------------|-------|
| Administrator | {{jumlah}} | Teknis tinggi | {{Deskripsi akses}} |
| {{Role 1}} | {{jumlah}} | {{level}} | {{Deskripsi akses}} |
| {{Role 2}} | {{jumlah}} | {{level}} | {{Deskripsi akses}} |
| {{Role 3}} | {{jumlah}} | {{level}} | {{Deskripsi akses}} |

### 2.4 Lingkungan Operasi
- **Server:** {{Cloud provider / On-premise}}
- **Web Server:** {{Teknologi web server}}
- **Database:** {{Tipe database}}
- **Browser:** {{Browser yang didukung}}
- **Device:** {{Perangkat yang didukung}}

---

## 3. Kebutuhan Spesifik

### 3.1 Kebutuhan Fungsional

#### SRS-F01: {{Nama Fungsi}}
| Atribut | Nilai |
|---------|-------|
| Deskripsi | {{Deskripsi lengkap fungsi}} |
| Input | {{Daftar input}} |
| Proses | {{Logika pemrosesan}} |
| Output | {{Output yang diharapkan}} |
| Prioritas | {{Essential/Important/Nice-to-have}} |

#### SRS-F02: {{Nama Fungsi}}
| Atribut | Nilai |
|---------|-------|
| Deskripsi | {{Deskripsi}} |
| Input | {{Input}} |
| Proses | {{Proses}} |
| Output | {{Output}} |
| Prioritas | {{Prioritas}} |

### 3.2 Kebutuhan Non-Fungsional

#### SRS-NF01: Performance
| Atribut | Requirement |
|---------|-------------|
| Response time | {{Target response time}} |
| Concurrent users | {{Jumlah user concurrent}} |
| Database queries | {{Target query performance}} |
| Report generation | {{Target waktu generate report}} |

#### SRS-NF02: Security
| Atribut | Requirement |
|---------|-------------|
| Authentication | {{Mekanisme autentikasi}} |
| Authorization | {{Mekanisme otorisasi}} |
| Data encryption | {{Standar enkripsi}} |
| Transport | {{Protokol transport}} |
| Session | {{Kebijakan session}} |
| Password | {{Kebijakan password}} |
| Audit | {{Kebijakan audit trail}} |

#### SRS-NF03: Reliability
| Atribut | Requirement |
|---------|-------------|
| Availability | {{Target uptime}} |
| Backup | {{Kebijakan backup}} |
| Recovery | {{RPO dan RTO}} |
| Error handling | {{Kebijakan error handling}} |

#### SRS-NF04: Scalability
| Atribut | Requirement |
|---------|-------------|
| Horizontal | {{Skalabilitas horizontal}} |
| Modular | {{Arsitektur modular}} |
| Storage | {{Skalabilitas storage}} |

#### SRS-NF05: Compatibility
| Atribut | Requirement |
|---------|-------------|
| Browsers | {{Browser yang didukung}} |
| Devices | {{Perangkat yang didukung}} |
| Resolution | {{Resolusi minimum}} |

---

## 4. Batasan Desain

| ID | Batasan | Deskripsi |
|----|---------|-----------|
| DC-01 | {{Batasan 1}} | {{Deskripsi}} |
| DC-02 | {{Batasan 2}} | {{Deskripsi}} |
| DC-03 | {{Batasan 3}} | {{Deskripsi}} |

---

## 5. Matriks Kebutuhan

| Requirement ID | Kategori | Prioritas | Modul | Status |
|----------------|----------|-----------|-------|--------|
| SRS-F01 | Fungsional | {{prioritas}} | {{modul}} | To Do |
| SRS-F02 | Fungsional | {{prioritas}} | {{modul}} | To Do |
| SRS-F03 | Fungsional | {{prioritas}} | {{modul}} | To Do |
| SRS-NF01 | Non-Fungsional | {{prioritas}} | {{modul}} | To Do |
| SRS-NF02 | Non-Fungsional | {{prioritas}} | {{modul}} | To Do |
