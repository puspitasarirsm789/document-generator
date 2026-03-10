# Business Process Model and Notation (BPMN)
# {{NAMA_PROYEK}}

## 1. Alur Proses Utama (To-Be)

### 1.1 Flow Umum — {{Nama Proses Utama}}

```mermaid
flowchart TD
    A["Mulai"] --> B["{{Langkah 1}}"]
    B --> C["{{Langkah 2}}"]
    C --> D{"{{Decision Point}}"}
    D -->|Disetujui| E["{{Langkah jika disetujui}}"]
    D -->|Ditolak| B
    E --> F["{{Langkah selanjutnya}}"]
    F --> G["Selesai"]
```

### 1.2 Flow {{Nama Sub-Proses 1}}

```mermaid
flowchart TD
    A["Mulai"] --> B["{{Langkah 1}}"]
    B --> C["{{Langkah 2}}"]
    C --> D["{{Langkah 3}}"]
    D --> E{"{{Review/Verifikasi}}"}
    E -->|Lengkap| F{"{{Approval}}"}
    E -->|Tidak lengkap| C
    F -->|Disetujui| G["{{Langkah setelah approval}}"]
    F -->|Ditolak| C
    G --> H["{{Langkah berikutnya}}"]
    H --> I["Selesai"]
```

### 1.3 Flow {{Nama Sub-Proses 2}}

```mermaid
flowchart TD
    A["Mulai"] --> B["{{Langkah 1}}"]
    B --> C["{{Langkah 2}}"]
    C --> D{"{{Review}}"}
    D -->|Valid| E{"{{Approval Level 1}}"}
    D -->|Tidak valid| B
    E -->|Disetujui| F{"{{Approval Level 2}}"}
    E -->|Ditolak| B
    F -->|Disetujui| G["{{Proses selanjutnya}}"]
    F -->|Ditolak| B
    G --> H["Selesai"]
```

## 2. Alur Approval — {{Nama Proses Approval}}

```mermaid
flowchart TD
    A["{{Initiator}} membuat\n{{nama request}}"] --> B["Input detail"]
    B --> C["Upload supporting\ndocuments"]
    C --> D{"Sistem validasi:\n{{Validasi apa?}}"}
    D -->|Ya| E["Submit untuk\napproval"]
    D -->|Tidak| F["Warning:\n{{Pesan warning}}"]
    F --> B
    E --> G["Email notification\nke {{Approver}}"]
    G --> H{"{{Approver}} review\ndan approval"}
    H -->|Approve| I["{{Proses selesai}}"]
    H -->|Reject| J["Notify {{Initiator}}\ndengan alasan"]
    J --> B
    I --> K["Selesai"]
```

## 3. Alur User Registration & Access (To-Be)

```mermaid
flowchart TD
    A["Admin membuat\nuser baru"] --> B["Input user data:\nNama, Email, Role"]
    B --> C{"Role assignment"}
    C -->|"{{Role 1}}"| D["Assign: {{Permissions role 1}}"]
    C -->|"{{Role 2}}"| E["Assign: {{Permissions role 2}}"]
    C -->|"{{Role 3}}"| F["Assign: {{Permissions role 3}}"]
    D --> G["Kirim email invitation"]
    E --> G
    F --> G
    G --> H["User login\npertama kali"]
    H --> I["Forced password\nchange"]
    I --> J["User aktif\ndi sistem"]
```

> [!NOTE]
> Diagram As-Is (proses saat ini) dapat ditambahkan jika informasi tersedia. Gunakan format mermaid flowchart yang sama untuk konsistensi.
