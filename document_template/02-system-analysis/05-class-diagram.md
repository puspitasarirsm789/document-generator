# Class Diagram
# {{NAMA_PROYEK}}

## Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string passwordHash
        +string role
        +boolean isActive
        +datetime lastLogin
        +datetime createdAt
        +login()
        +logout()
        +resetPassword()
    }

    class {{Entity1}} {
        +int id
        +string name
        +string code
        +string description
        +boolean isActive
        +{{method1}}()
        +{{method2}}()
    }

    class {{Entity2}} {
        +int id
        +string {{field1}}
        +string {{field2}}
        +decimal {{field3}}
        +string status
        +datetime createdAt
        +create()
        +update()
        +delete()
    }

    class {{Entity3}} {
        +int id
        +int {{foreignKeyId}}
        +string description
        +decimal amount
        +string status
        +int createdBy
        +int approvedBy
        +datetime submittedAt
        +submit()
        +approve()
        +reject()
    }

    class {{Entity4}} {
        +int id
        +string type
        +datetime date
        +string description
        +decimal debit
        +decimal credit
        +int createdBy
        +record()
    }

    class SupportingDocument {
        +int id
        +int {{parentId}}
        +string fileName
        +string filePath
        +string fileType
        +int uploadedBy
        +boolean isEncrypted
        +upload()
        +download()
    }

    class Notification {
        +int id
        +int userId
        +string type
        +string subject
        +string body
        +boolean isRead
        +datetime sentAt
        +send()
        +markAsRead()
    }

    class AuditLog {
        +int id
        +int userId
        +string action
        +string entity
        +int entityId
        +string oldValue
        +string newValue
        +datetime timestamp
        +string ipAddress
        +log()
    }

    User "1" --> "*" {{Entity1}} : belongsTo
    {{Entity1}} "1" --> "*" {{Entity2}} : has
    {{Entity2}} "1" --> "*" {{Entity3}} : contains
    {{Entity3}} "1" --> "*" SupportingDocument : attachedTo
    User "1" --> "*" Notification : receives
    User "1" --> "*" AuditLog : generates
```

## Penjelasan Relasi

| Relasi | Tipe | Deskripsi |
|--------|------|-----------|
| User → {{Entity1}} | Association (N:1) | {{Deskripsi relasi}} |
| {{Entity1}} → {{Entity2}} | Composition (1:N) | {{Deskripsi relasi}} |
| {{Entity2}} → {{Entity3}} | Association (1:N) | {{Deskripsi relasi}} |
| {{Entity3}} → SupportingDocument | Aggregation (1:N) | {{Deskripsi relasi}} |
| User → AuditLog | Association (1:N) | Setiap aksi user tercatat |

> [!NOTE]
> Sesuaikan class dan relasi dengan kebutuhan domain proyek. Gunakan tipe relasi yang tepat:
> - **Association**: hubungan umum antar objek
> - **Composition**: bagian yang tidak bisa berdiri sendiri tanpa parent
> - **Aggregation**: bagian yang bisa berdiri sendiri tanpa parent
> - **Generalization**: pewarisan (inheritance)
