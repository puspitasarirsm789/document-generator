# Sitemap
# {{NAMA_PROYEK}}

## Struktur Navigasi

```mermaid
graph TD
    ROOT["{{Nama Sistem}} Home"] --> LOGIN["Login Page\n(Public)"]
    ROOT --> DASH["Dashboard\n(Auth Required)"]
    
    DASH --> MOD1["{{Modul 1}}"]
    DASH --> MOD2["{{Modul 2}}"]
    DASH --> MOD3["{{Modul 3}}"]
    DASH --> USERS["User Management"]
    DASH --> REPORTS["Reports"]
    DASH --> SETTINGS["Settings"]

    MOD1 --> M1_1["{{Sub Menu 1.1}}"]
    MOD1 --> M1_2["{{Sub Menu 1.2}}"]
    MOD1 --> M1_3["{{Sub Menu 1.3}}"]

    MOD2 --> M2_1["{{Sub Menu 2.1}}"]
    MOD2 --> M2_2["{{Sub Menu 2.2}}"]
    MOD2 --> M2_3["{{Sub Menu 2.3}}"]

    MOD3 --> M3_1["{{Sub Menu 3.1}}"]
    MOD3 --> M3_2["{{Sub Menu 3.2}}"]

    USERS --> U1["User List"]
    USERS --> U2["Create User"]
    USERS --> U3["Role Management"]
    USERS --> U4["Audit Log"]

    REPORTS --> R1["Download Reports"]
    REPORTS --> R2["Custom Reports"]
    REPORTS --> R3["Export Data"]

    SETTINGS --> S1["Profile"]
    SETTINGS --> S2["Change Password"]
    SETTINGS --> S3["Notification Preferences"]
```

## Hierarki Halaman

```
{{NAMA_SISTEM}}
├── Login (Public)
├── Forgot Password (Public)
├── Dashboard (Auth: All Roles)
│
├── {{Modul 1}} (Auth: {{Roles yang akses}})
│   ├── {{Sub Menu 1.1}}
│   │   ├── List View
│   │   ├── Create/Edit Form
│   │   └── Detail View
│   ├── {{Sub Menu 1.2}}
│   │   ├── List View
│   │   ├── Create/Edit Form
│   │   └── Detail View
│   └── {{Sub Menu 1.3}}
│
├── {{Modul 2}} (Auth: {{Roles yang akses}})
│   ├── {{Sub Menu 2.1}}
│   ├── {{Sub Menu 2.2}}
│   └── {{Sub Menu 2.3}}
│       ├── List View
│       ├── Create Form
│       └── Preview
│
├── {{Modul 3}} (Auth: {{Roles yang akses}})
│   ├── {{Sub Menu 3.1}}
│   │   ├── List View
│   │   ├── New Form
│   │   └── Detail
│   └── {{Sub Menu 3.2}}
│
├── Reports (Auth: {{Roles}})
│   ├── Download Reports
│   ├── Custom Reports
│   └── Export Data
│
├── User Management (Auth: Administrator)
│   ├── User List
│   ├── Create/Edit User
│   ├── Role Management
│   └── Audit Log
│
└── Settings (Auth: All Roles)
    ├── My Profile
    ├── Change Password
    └── Notification Preferences
```

## Akses per Role

| Halaman | Admin | {{Role 1}} | {{Role 2}} | {{Role 3}} |
|---------|-------|------------|------------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| {{Modul 1}} | ❌ | ✅ ({{level akses}}) | ✅ ({{level akses}}) | ❌ |
| {{Modul 2}} | ❌ | ✅ ({{level akses}}) | ✅ ({{level akses}}) | ❌ |
| {{Modul 3}} | ❌ | ✅ ({{level akses}}) | ✅ ({{level akses}}) | ❌ |
| Reports | ❌ | ✅ | ✅ | ✅ (limited) |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ✅ |
