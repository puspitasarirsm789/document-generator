# UAT Plan
# {{NAMA_PROYEK}}

---

## 1. Informasi Umum

| Item | Detail |
|------|--------|
| Proyek | {{Nama proyek}} |
| Versi Dokumen | 1.0 |
| Tujuan UAT | {{Tujuan UAT: memvalidasi bahwa sistem memenuhi kebutuhan bisnis dan siap untuk production}} |
| Periode UAT | {{Estimasi durasi: X minggu / X hari kerja}} |
| Lingkungan | {{Staging/UAT Environment}} |

## 2. Ruang Lingkup UAT

### 2.1 Dalam Ruang Lingkup
- {{Modul/fitur yang akan di-test 1}}
- {{Modul/fitur yang akan di-test 2}}
- Cross-platform testing: {{daftar platform}}
- Role-based access testing untuk semua role
- Workflow approval testing
- Data security testing

### 2.2 Di Luar Ruang Lingkup
- {{Item yang tidak termasuk 1}}
- {{Item yang tidak termasuk 2}}
- {{Item yang tidak termasuk 3}}

## 3. Tim UAT

| Role | Nama/Organisasi | Tanggung Jawab |
|------|-----------------|----------------|
| UAT Lead | {{Nama}} | Koordinasi keseluruhan UAT |
| Business Tester 1 | {{Nama / Role}} | Test modul {{modul}} |
| Business Tester 2 | {{Nama / Role}} | Test modul {{modul}} |
| Approval Tester | {{Nama / Role}} | Test approval workflow |
| Admin Tester | {{Nama / Role}} | Test user management & security |

## 4. Prasyarat UAT

| No | Prasyarat | PIC | Status |
|----|-----------|-----|--------|
| 1 | UAT environment deployed | {{PIC}} | ☐ |
| 2 | Test data (dummy) sudah di-load | {{PIC}} | ☐ |
| 3 | User accounts untuk semua tester dibuat | {{PIC}} | ☐ |
| 4 | UAT test cases sudah di-review oleh stakeholder | {{PIC}} | ☐ |
| 5 | Training untuk tester sudah dilaksanakan | {{PIC}} | ☐ |
| 6 | Akses ke UAT environment sudah dikonfirmasi | All Testers | ☐ |

## 5. Kriteria Masuk & Keluar

### 5.1 Entry Criteria (Syarat Memulai UAT)
- ☐ Semua fitur sudah selesai development
- ☐ System testing (SIT) oleh vendor sudah pass 100%
- ☐ UAT environment stabil dan accessible
- ☐ Test data tersedia dan valid
- ☐ Semua tester sudah mendapat training

### 5.2 Exit Criteria (Syarat Menyelesaikan UAT)
- ☐ Semua test case critical dan high priority sudah executed
- ☐ 100% critical bugs sudah fixed dan re-tested
- ☐ 90% high priority bugs sudah fixed
- ☐ Tidak ada outstanding critical/blocker issues
- ☐ UAT sign-off dari semua stakeholder

## 6. Skenario UAT

### Skenario 1: {{Nama Modul 1}} (Hari {{range}})

| UAT ID | Skenario | Steps | Expected Result | Priority |
|--------|----------|-------|-----------------|----------|
| UAT-001 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | Critical |
| UAT-002 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | Critical |
| UAT-003 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | High |

### Skenario 2: {{Nama Modul 2}} (Hari {{range}})

| UAT ID | Skenario | Steps | Expected Result | Priority |
|--------|----------|-------|-----------------|----------|
| UAT-004 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | Critical |
| UAT-005 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | High |
| UAT-006 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | High |

### Skenario 3: {{Nama Modul 3}} (Hari {{range}})

| UAT ID | Skenario | Steps | Expected Result | Priority |
|--------|----------|-------|-----------------|----------|
| UAT-007 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | Critical |
| UAT-008 | {{Deskripsi skenario}} | {{Langkah-langkah}} | {{Hasil yang diharapkan}} | High |

### Skenario 4: Dashboard & Reporting (Hari {{range}})

| UAT ID | Skenario | Steps | Expected Result | Priority |
|--------|----------|-------|-----------------|----------|
| UAT-009 | View dashboard | Login → Dashboard | KPI cards, charts tampil akurat | Critical |
| UAT-010 | Download report | Reports → Filter → Download | File terdownload (PDF/Excel) | High |

### Skenario 5: Security & User Management (Hari {{range}})

| UAT ID | Skenario | Steps | Expected Result | Priority |
|--------|----------|-------|-----------------|----------|
| UAT-011 | Create user | Admin → Users → New → Assign role | User terbuat, email invitation | Critical |
| UAT-012 | Role access check | Login per role → Cek menu access | Access sesuai role permission | Critical |
| UAT-013 | Auto-logout | Login → Idle {{durasi}} | User ter-logout otomatis | High |
| UAT-014 | Password recovery | Forgot Password → Input email | Reset link terkirim via email | High |
| UAT-015 | Security check | Cek HTTPS, enkripsi data | Data aman dan terenkripsi | Critical |

## 7. Defect Management

### 7.1 Severitas Defect

| Level | Definisi | Target Fix |
|-------|----------|------------|
| **Critical** | Sistem crash, data loss, security breach | Dalam 24 jam |
| **High** | Fitur utama tidak berfungsi | Dalam 48 jam |
| **Medium** | Fitur berfungsi tapi tidak optimal | Dalam 1 minggu |
| **Low** | Isu kosmetik, minor inconvenience | Sebelum go-live |

### 7.2 Template Defect Report

| Field | Deskripsi |
|-------|-----------|
| Defect ID | Auto-generated |
| Title | Judul singkat masalah |
| UAT ID | Reference ke UAT scenario |
| Severity | Critical / High / Medium / Low |
| Steps to Reproduce | Langkah detail untuk mereproduksi |
| Expected Result | Hasil yang diharapkan |
| Actual Result | Hasil aktual |
| Screenshot | Lampiran bukti |
| Environment | Browser, device, OS |
| Status | New / In Progress / Fixed / Re-test / Closed |

## 8. Timeline UAT

| Hari | Aktivitas | PIC |
|------|-----------|-----|
| Hari 1-2 | Skenario 1: {{Modul 1}} | {{PIC}} |
| Hari 3-4 | Skenario 2: {{Modul 2}} | {{PIC}} |
| Hari 5-6 | Skenario 3: {{Modul 3}} | {{PIC}} |
| Hari 7-8 | Skenario 4: Dashboard & Reporting | {{PIC}} |
| Hari 9-10 | Skenario 5: Security & User Management | {{PIC}} |
| Hari 11 | Bug fixing & re-test | Vendor + All Testers |
| Hari 12 | UAT sign-off | UAT Lead + All Stakeholders |

## 9. Approval / Sign-Off

| Stakeholder | Nama | Tanda Tangan | Tanggal |
|-------------|------|-------------|---------|
| UAT Lead | ________________ | ________________ | ______ |
| {{Stakeholder 1}} | ________________ | ________________ | ______ |
| {{Stakeholder 2}} | ________________ | ________________ | ______ |
| {{Stakeholder 3}} | ________________ | ________________ | ______ |
