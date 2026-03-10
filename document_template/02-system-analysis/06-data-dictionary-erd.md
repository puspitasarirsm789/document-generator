# Data Dictionary & Entity Relationship Diagram
# {{NAMA_PROYEK}}

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ {{entity_utama}} : creates
    users ||--o{ audit_logs : generates
    users ||--o{ notifications : receives

    {{entity_parent}} ||--o{ {{entity_child1}} : has
    {{entity_parent}} ||--o{ {{entity_child2}} : owns

    {{entity_child1}} ||--o{ {{entity_grandchild}} : contains

    {{entity_utama}} ||--o{ supporting_documents : attachedTo

    users {
        int id PK
        string name
        string email UK
        string password_hash
        enum role
        int {{fk_field}} FK
        boolean is_active
        datetime last_login
        datetime created_at
        datetime updated_at
    }

    {{entity_parent}} {
        int id PK
        string name
        string code UK
        string description
        boolean is_active
    }

    {{entity_child1}} {
        int id PK
        string {{field_1}}
        string {{field_2}}
        decimal amount
        int {{parent_id}} FK
        enum status
        int created_by FK
        datetime created_at
    }

    {{entity_child2}} {
        int id PK
        int {{parent_id}} FK
        decimal {{field_numeric}}
        string description
        enum status
        int created_by FK
        datetime created_at
    }

    {{entity_utama}} {
        int id PK
        enum type
        string payee
        decimal amount
        enum status
        int {{fk_field}} FK
        int created_by FK
        int approved_by FK
        datetime submitted_at
        datetime approved_at
        datetime created_at
    }

    supporting_documents {
        int id PK
        int {{parent_id}} FK
        string file_name
        string file_path
        string file_type
        int file_size
        int uploaded_by FK
        boolean is_encrypted
        datetime uploaded_at
    }

    notifications {
        int id PK
        int user_id FK
        enum type
        string subject
        string body
        boolean is_read
        datetime sent_at
    }

    audit_logs {
        int id PK
        int user_id FK
        string action
        string entity
        int entity_id
        text old_value
        text new_value
        datetime timestamp
        string ip_address
    }
```

## Data Dictionary

### Tabel: users

| Kolom | Tipe Data | Panjang | Nullable | Default | Deskripsi |
|-------|-----------|---------|----------|---------|-----------|
| id | INT | - | No | AUTO_INCREMENT | Primary key |
| name | VARCHAR | 255 | No | - | Nama lengkap user |
| email | VARCHAR | 255 | No | - | Email (unique) |
| password_hash | VARCHAR | 255 | No | - | Password ter-hash |
| role | ENUM | - | No | '{{default_role}}' | Role: {{daftar role}} |
| {{fk_field}} | INT | - | Yes | NULL | FK ke {{tabel parent}} |
| is_active | BOOLEAN | - | No | TRUE | Status aktif user |
| last_login | DATETIME | - | Yes | NULL | Timestamp login terakhir |
| created_at | DATETIME | - | No | CURRENT_TIMESTAMP | Waktu pembuatan |
| updated_at | DATETIME | - | No | CURRENT_TIMESTAMP | Waktu update terakhir |

### Tabel: {{entity_parent}}

| Kolom | Tipe Data | Panjang | Nullable | Default | Deskripsi |
|-------|-----------|---------|----------|---------|-----------|
| id | INT | - | No | AUTO_INCREMENT | Primary key |
| name | VARCHAR | 255 | No | - | {{Deskripsi field}} |
| code | VARCHAR | 10 | No | - | {{Kode singkat}} |
| description | TEXT | - | Yes | NULL | {{Deskripsi}} |
| is_active | BOOLEAN | - | No | TRUE | Status aktif |

### Tabel: {{entity_utama}}

| Kolom | Tipe Data | Panjang | Nullable | Default | Deskripsi |
|-------|-----------|---------|----------|---------|-----------|
| id | INT | - | No | AUTO_INCREMENT | Primary key |
| type | ENUM | - | No | - | Tipe: {{daftar tipe}} |
| {{field_text}} | VARCHAR | 255 | No | - | {{Deskripsi}} |
| amount | DECIMAL | 15,2 | No | - | {{Deskripsi jumlah}} |
| status | ENUM | - | No | 'draft' | Status: {{daftar status}} |
| {{fk_field}} | INT | - | No | - | FK ke {{tabel}} |
| created_by | INT | - | No | - | FK ke user pembuat |
| approved_by | INT | - | Yes | NULL | FK ke user approver |
| created_at | DATETIME | - | No | CURRENT_TIMESTAMP | Waktu pembuatan |

### Tabel: audit_logs

| Kolom | Tipe Data | Panjang | Nullable | Default | Deskripsi |
|-------|-----------|---------|----------|---------|-----------|
| id | INT | - | No | AUTO_INCREMENT | Primary key |
| user_id | INT | - | No | - | FK ke user |
| action | VARCHAR | 50 | No | - | Aksi: CREATE, UPDATE, DELETE, LOGIN, APPROVE, REJECT |
| entity | VARCHAR | 100 | No | - | Nama entitas yang diubah |
| entity_id | INT | - | No | - | ID entitas yang diubah |
| old_value | TEXT | - | Yes | NULL | Nilai sebelum perubahan (JSON) |
| new_value | TEXT | - | Yes | NULL | Nilai setelah perubahan (JSON) |
| timestamp | DATETIME | - | No | CURRENT_TIMESTAMP | Waktu aksi |
| ip_address | VARCHAR | 45 | Yes | NULL | IP address user |

> [!NOTE]
> Tambahkan tabel sesuai kebutuhan domain proyek. Setiap tabel harus memiliki primary key, timestamp, dan foreign key yang jelas. Gunakan konvensi penamaan snake_case untuk nama tabel dan kolom.
