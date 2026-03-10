# Sequence Diagram
# {{NAMA_PROYEK}}

## 1. Sequence: Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Web as Web Portal
    participant Auth as Auth Service
    participant DB as Database

    User->>Web: Input credentials
    Web->>Auth: POST /api/auth/login
    Auth->>DB: Query user
    DB-->>Auth: User record
    Auth->>Auth: Validate password
    alt Password valid
        Auth->>Auth: Generate token
        Auth-->>Web: 200 OK + token
        Web-->>User: Redirect to Dashboard
    else Password invalid
        Auth->>DB: Increment failed attempts
        Auth-->>Web: 401 Unauthorized
        Web-->>User: Error message
    end
```

## 2. Sequence: {{Nama Proses Utama 1}}

```mermaid
sequenceDiagram
    actor Actor1 as {{Nama Aktor 1}}
    actor Actor2 as {{Nama Aktor 2 / Approver}}
    participant Web as Web Portal
    participant API as API Server
    participant DB as Database
    participant Email as Email Service

    Actor1->>Web: {{Aksi 1}}
    Web->>API: POST /api/{{endpoint}}
    API->>DB: {{Query/validasi}}
    DB-->>API: {{Response data}}
    alt {{Kondisi sukses}}
        API->>DB: Save data (status: Draft)
        DB-->>API: {{ID record}}
        API-->>Web: {{Response sukses}}
        Actor1->>Web: {{Upload/input tambahan}}
        Web->>API: POST /api/{{endpoint}}/documents
        Actor1->>Web: Submit for approval
        Web->>API: PATCH /api/{{endpoint}}/{id}/submit
        API->>DB: Update status: Pending Approval
        API->>Email: Send notification to {{Approver}}
        Email-->>Actor2: Notification email
        Actor2->>Web: Review data
        alt Approve
            Actor2->>Web: Click Approve
            Web->>API: PATCH /api/{{endpoint}}/{id}/approve
            API->>DB: Update status: Approved
            API->>Email: Notify {{Aktor 1}}
        else Reject
            Actor2->>Web: Click Reject + reason
            Web->>API: PATCH /api/{{endpoint}}/{id}/reject
            API->>DB: Update status: Rejected
            API->>Email: Notify {{Aktor 1}} with reason
        end
    else {{Kondisi gagal}}
        API-->>Web: 400 Error
        Web-->>Actor1: Warning message
    end
```

## 3. Sequence: {{Nama Proses Utama 2}}

```mermaid
sequenceDiagram
    actor Actor1 as {{Nama Aktor}}
    actor Approver1 as {{Approver Level 1}}
    actor Approver2 as {{Approver Level 2}}
    participant Web as Web Portal
    participant API as API Server
    participant DB as Database
    participant Email as Email Service

    Actor1->>Web: {{Aksi inisiasi}}
    Web->>API: POST /api/{{endpoint}}
    API->>DB: {{Validasi data}}
    API->>DB: Save request
    API-->>Web: Request created
    Actor1->>Web: Submit for approval
    API->>Email: Notify {{Approver 1}}
    Approver1->>Web: Review
    alt {{Approver 1}} approves
        Approver1->>Web: Approve
        API->>DB: Update status: Pending {{Approver 2}}
        API->>Email: Notify {{Approver 2}}
        Approver2->>Web: Review
        alt {{Approver 2}} approves
            Approver2->>Web: Approve
            API->>DB: Apply changes
            API->>DB: Record audit trail
            API->>Email: Notify all stakeholders
        else {{Approver 2}} rejects
            Approver2->>Web: Reject + feedback
            API->>Email: Notify {{Aktor 1}}
        end
    else {{Approver 1}} rejects
        Approver1->>Web: Reject + feedback
        API->>Email: Notify {{Aktor 1}}
    end
```

## 4. Sequence: Dashboard Data Loading

```mermaid
sequenceDiagram
    actor User
    participant Web as Web Portal
    participant API as API Server
    participant DB as Database
    participant Cache as Cache Layer

    User->>Web: Open Dashboard
    Web->>API: GET /api/dashboard/summary
    API->>Cache: Check cached data
    alt Cache valid
        Cache-->>API: Cached summary
    else Cache miss
        API->>DB: Query aggregated data
        DB-->>API: Aggregated data
        API->>Cache: Store in cache
    end
    API-->>Web: Dashboard JSON
    Web-->>User: Render dashboard
```

> [!NOTE]
> Tambahkan atau ubah sequence diagram sesuai proses bisnis utama dari proyek. Pastikan setiap sequence menunjukkan interaksi antar aktor, sistem, dan database.
