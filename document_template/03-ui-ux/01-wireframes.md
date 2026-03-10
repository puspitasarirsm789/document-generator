# Wireframes / Mockups
# {{NAMA_PROYEK}}

## 1. Halaman Login

```
+--------------------------------------------------+
|                                                    |
|              {{NAMA_PROYEK}}                       |
|        {{Tagline / Subtitle}}                      |
|                                                    |
|         +--------------------------------+         |
|         |  Email                         |         |
|         +--------------------------------+         |
|         |  Password                      |         |
|         +--------------------------------+         |
|         |  [x] Remember me               |         |
|         |                                |         |
|         |       [ LOGIN ]                |         |
|         |                                |         |
|         |  Forgot Password?              |         |
|         +--------------------------------+         |
|                                                    |
|          {{Footer / Copyright}}                    |
+--------------------------------------------------+
```

**Elemen UI:**
- Input: Email (text), Password (password)
- Checkbox: Remember me
- Button: Login (primary)
- Link: Forgot Password
- Validasi: Email format, password minimum length

---

## 2. Main Dashboard

```
+------------------------------------------------------------------+
| [Logo]                      Welcome, [User Name]    [Logout]       |
+------------------------------------------------------------------+
| [=] Menu  | Dashboard | {{Menu 1}} | {{Menu 2}} | {{Menu 3}}      |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------+  +--------------------+  +---------------+|
|  | {{KPI Card 1}}     |  | {{KPI Card 2}}     |  | {{KPI Card 3}}||
|  | {{Nilai 1}}        |  | {{Nilai 2}}        |  | {{Nilai 3}}   ||
|  | [===========-------]  | [=====--------------]  | {{%}}        ||
|  +--------------------+  +--------------------+  +---------------+|
|                                                                    |
|  +-------------------------------+  +----------------------------+|
|  | {{Chart 1 Title}}             |  | {{Chart 2 Title}}          ||
|  |                               |  |                            ||
|  | {{Deskripsi Chart 1}}         |  | {{Deskripsi Chart 2}}      ||
|  +-------------------------------+  +----------------------------+|
|                                                                    |
|  +-------------------------------+  +----------------------------+|
|  | {{Widget 1 Title}}            |  | {{Widget 2 Title}}         ||
|  |                               |  |                            ||
|  | {{Konten Widget 1}}           |  | > {{Item 1}}               ||
|  |                               |  | > {{Item 2}}               ||
|  |                               |  | > {{Item 3}}               ||
|  +-------------------------------+  +----------------------------+|
|                                                                    |
+------------------------------------------------------------------+
| {{Footer info}}                                                    |
+------------------------------------------------------------------+
```

**Elemen UI:**
- Header: Logo, user name, logout button
- Navigation: Horizontal menu bar
- KPI Cards: {{daftar KPI}} (dengan progress bar)
- Charts: {{daftar chart dengan tipe: bar/line/pie}}
- Widget: {{daftar widget informatif}}
- Footer: Version, organization

---

## 3. Data List View

```
+------------------------------------------------------------------+
| {{Nama Modul}} > {{Sub Menu}}                    [+ New {{Item}}]  |
+------------------------------------------------------------------+
| Filter: [{{Filter 1}} v] [{{Filter 2}} v] [Status: All v] [Apply]|
+------------------------------------------------------------------+
| ID    | {{Kolom 1}} | {{Kolom 2}} | {{Kolom 3}}   | Status   | Act|
|-------|-------------|-------------|---------------|----------|-----|
| {{ID}}| {{Data}}    | {{Data}}    | {{Data}}      | Active   | [...|
| {{ID}}| {{Data}}    | {{Data}}    | {{Data}}      | Pending  | [...|
| {{ID}}| {{Data}}    | {{Data}}    | {{Data}}      | Draft    | [...|
+------------------------------------------------------------------+
| Showing 1-3 of 3 entries                        < 1 2 3 >        |
+------------------------------------------------------------------+
```

**Elemen UI:**
- Header: Breadcrumb, New item button
- Filters: Dropdown filters, Apply button
- Table: Sortable columns, status badges, action buttons (view/edit/delete)
- Pagination: Bottom navigation

---

## 4. Form Entry

```
+------------------------------------------------------------------+
| {{Modul}} > New {{Item}}                                           |
+------------------------------------------------------------------+
| {{Form Section Title}}                                             |
|                                                                    |
| {{Field 1}}:     [{{dropdown/options}}        v]                   |
| {{Field 2}}:     [_________________________________]               |
| {{Field 3}}:     [_________________________________]               |
| {{Field 4}}:     [{{related entity}}           v]                  |
| {{Field 5}}:     [_________________________________]               |
| {{Field 6}}:     [_________________________________]               |
|                  [_________________________________]               |
|                                                                    |
| Supporting Documents                                               |
| +------------------------------------------------------------+   |
| |  [+] Drag & drop files here or click to upload             |   |
| |                                                              |   |
| |  > {{filename1.pdf}}       {{size}}    [x]                   |   |
| |  > {{filename2.jpg}}       {{size}}    [x]                   |   |
| +------------------------------------------------------------+   |
|                                                                    |
| {{Validation Info}}: {{validation message}}                        |
|                                                                    |
|              [Save Draft]  [Submit for Approval]                   |
+------------------------------------------------------------------+
```

**Elemen UI:**
- Form fields: Dropdown, Text inputs, Textarea
- File upload: Drag & drop area, file list with remove button
- Validation: Real-time validation display
- Buttons: Save Draft (secondary), Submit for Approval (primary)

---

## 5. Approval Queue

```
+------------------------------------------------------------------+
| {{Modul}} > Pending Approvals                    [{{count}} pending]|
+------------------------------------------------------------------+
| +--------------------------------------------------------------+ |
| | {{ID}} | {{Tipe}}                                              | |
| | {{Label}}: {{Value}}  | {{Label}}: {{Value}}                   | |
| | {{Label}}: {{Value}}  | Submitted by: {{User}} | {{time ago}}  | |
| |                                                                | |
| |  [View Details]  [Approve]  [Reject]                           | |
| +--------------------------------------------------------------+ |
| +--------------------------------------------------------------+ |
| | {{ID}} | {{Tipe}}                                              | |
| | {{Label}}: {{Value}}  | {{Label}}: {{Value}}                   | |
| | {{Label}}: {{Value}}  | Submitted by: {{User}} | {{time ago}}  | |
| |                                                                | |
| |  [View Details]  [Approve]  [Reject]                           | |
| +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

## 6. Report / Detail View

```
+------------------------------------------------------------------+
| {{Modul}} > {{Sub Menu}} > Detail                                  |
+------------------------------------------------------------------+
| Period: [{{period}} v]    {{Filter}}: [{{value}} v]                 |
+------------------------------------------------------------------+
| {{Data Table Title}}:                                              |
|                                                                    |
| {{Col 1}} | {{Col 2}}              | {{Col 3}} | {{Col 4}} | Var  |
|-----------|------------------------|-----------|-----------|------|
| {{data}}  | {{data}}               | {{data}}  | {{data}}  | {{}} |
| {{data}}  | {{data}}               | {{data}}  | {{data}}  | {{}} |
|-----------|------------------------|-----------|-----------|------|
| TOTAL     |                        | {{total}} | {{total}} | {{}} |
+------------------------------------------------------------------+
|                                                                    |
|         [Save Draft]  [Generate PDF]  [Submit for Approval]        |
+------------------------------------------------------------------+
```

**Catatan Interaksi:**
- Hover: Row highlight pada tabel
- Click Generate PDF: Preview PDF sebelum submit
- Validasi: {{aturan validasi data}}
