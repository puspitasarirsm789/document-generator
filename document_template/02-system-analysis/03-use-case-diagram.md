# Use Case Diagram
# {{NAMA_PROYEK}}

## Daftar Aktor

| Aktor | Deskripsi | Tipe |
|-------|-----------|------|
| {{Aktor 1}} | {{Deskripsi peran}} | Primary |
| {{Aktor 2}} | {{Deskripsi peran}} | Primary |
| {{Aktor 3}} | {{Deskripsi peran}} | Primary |
| {{Aktor Eksternal 1}} | {{Deskripsi sistem eksternal}} | Secondary |

## Use Case Diagram

```mermaid
graph LR
    subgraph "Actors"
        ACTOR1["{{Aktor 1}}"]
        ACTOR2["{{Aktor 2}}"]
        ACTOR3["{{Aktor 3}}"]
        ACTOR_EXT["{{Aktor Eksternal}}"]
    end

    subgraph "{{Nama Sistem}} - {{Modul 1}}"
        UC01["UC-01: {{Use Case 1}}"]
        UC02["UC-02: {{Use Case 2}}"]
        UC03["UC-03: {{Use Case 3}}"]
    end

    subgraph "{{Nama Sistem}} - {{Modul 2}}"
        UC04["UC-04: {{Use Case 4}}"]
        UC05["UC-05: {{Use Case 5}}"]
        UC06["UC-06: {{Use Case 6}}"]
    end

    subgraph "{{Nama Sistem}} - {{Modul 3}}"
        UC07["UC-07: {{Use Case 7}}"]
        UC08["UC-08: {{Use Case 8}}"]
    end

    ACTOR1 --> UC01
    ACTOR1 --> UC02
    ACTOR2 --> UC03
    ACTOR2 --> UC04
    ACTOR3 --> UC05
    ACTOR3 --> UC06
    ACTOR_EXT --> UC07
    ACTOR_EXT --> UC08
```

## Detail Use Case

### UC-01: {{Nama Use Case}}
- **Aktor Utama:** {{Aktor}}
- **Pre-condition:** {{Kondisi yang harus terpenuhi sebelum use case dijalankan}}
- **Post-condition:** {{Kondisi setelah use case berhasil dijalankan}}
- **Main Flow:** {{Langkah utama: Login → Aksi 1 → Aksi 2 → Hasil}}

### UC-02: {{Nama Use Case}}
- **Aktor Utama:** {{Aktor}}
- **Include:** {{UC terkait yang selalu dijalankan (opsional)}}
- **Pre-condition:** {{Kondisi prasyarat}}
- **Post-condition:** {{Kondisi akhir}}

### UC-03: {{Nama Use Case}}
- **Aktor Utama:** {{Aktor}}
- **Extend:** {{UC terkait yang opsional dijalankan (opsional)}}
- **Pre-condition:** {{Kondisi prasyarat}}
- **Post-condition:** {{Kondisi akhir}}
- **Generalization:** {{Variasi berdasarkan role, jika ada}}

> [!NOTE]
> Tambahkan use case sesuai kebutuhan proyek. Gunakan relasi **Include** untuk use case yang selalu dipanggil, **Extend** untuk yang opsional, dan **Generalization** untuk variasi berdasarkan role.
