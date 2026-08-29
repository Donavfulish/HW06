# AI Audit Log — HW06

**MSSV:** 23127044  
**Tool:** Cursor Agent (Claude)  
**Date:** 2026-08-29

---

## API 1 — FR-04 Profile (6 sessions)

| # | Datetime | Tool | Prompt (summary) | Output | Human review |
|---|----------|------|------------------|--------|--------------|
| 1 | 2026-08-29 09:00 | Cursor | Liệt kê 5 input variables + partitions từ api_spec §2.2 và fr04 domain-testing | Bảng V1-V5 partitions, 20 TC domain | VALID — khớp HW02 |
| 2 | 2026-08-29 09:15 | Cursor | BVA phone regex ON/OFF/IN/OUT hai chiều length + first char | 8 BVA TC | VALID — phát hiện BUG-A1 boundary |
| 3 | 2026-08-29 09:30 | Cursor | SEC-06 role=admin trong body với user JWT | 3 SEC TC | VALID — expected 403 |
| 4 | 2026-08-29 09:45 | Cursor | SEC-02 missing/expired/malformed Bearer | 5 auth TC | VALID |
| 5 | 2026-08-29 10:00 | Cursor | Schema assert response keys sau PUT | 3 schema TC | INCOMPLETE → thêm verify GET |
| 6 | 2026-08-29 10:15 | Cursor | Merge ≥35 TC với cột đầy đủ | 38 TC CSV | VALID — đủ 35+ |

**Audit pass:** 6 INVALID corrected (phone/name server validation assumptions)

---

## API 2 — FR-10 Order State (6 sessions)

| # | Datetime | Tool | Prompt (summary) | Output | Human review |
|---|----------|------|------------------|--------|--------------|
| 1 | 2026-08-29 10:30 | Cursor | Vẽ state machine từ fr10 domain-testing | Transition table 15 valid/invalid | VALID |
| 2 | 2026-08-29 10:45 | Cursor | TC mỗi valid transition admin token | 8 TC | VALID |
| 3 | 2026-08-29 11:00 | Cursor | Invalid transitions canceled→delivered, backward | 10 TC | VALID — BUG-B1 |
| 4 | 2026-08-29 11:15 | Cursor | Domain: enum invalid, missing body, 404 | 6 TC | VALID |
| 5 | 2026-08-29 11:30 | Cursor | User cancel sub-folder TC | 8 TC | VALID — BUG-B3 |
| 6 | 2026-08-29 11:45 | Cursor | Merge ≥35 TC | 38 TC CSV | VALID |

**Audit pass:** 2 INVALID (SEC-03 expected status)

---

## API 3 — FR-18 Admin Orders (6 sessions)

| # | Datetime | Tool | Prompt (summary) | Output | Human review |
|---|----------|------|------------------|--------|--------------|
| 1 | 2026-08-29 12:00 | Cursor | Partitions admin_token từ fr18 | V1-V3 partitions | VALID |
| 2 | 2026-08-29 12:15 | Cursor | Admin/user/no/expired token TC | 8 auth TC | PARTIAL — SEC-03 wrong expected |
| 3 | 2026-08-29 12:30 | Cursor | Schema array + required fields per order | 12 schema TC | VALID |
| 4 | 2026-08-29 12:45 | Cursor | IDOR user A vs admin list | 2 SEC TC | INVALID → corrected to 200 |
| 5 | 2026-08-29 13:00 | Cursor | Edge: empty DB, content-type | 6 domain TC | VALID |
| 6 | 2026-08-29 13:15 | Cursor | Merge ≥35 TC | 38 TC CSV | VALID |

**Audit pass:** 4 INVALID (role check assumptions)

---

## Extend sessions (human, per API)

| API | Datetime | Action | TC added |
|-----|----------|--------|----------|
| 1 | 2026-08-29 13:30 | Extend from HW02 bugs A1/A2/A3 + SEC | 6 |
| 2 | 2026-08-29 13:45 | Extend BUG-B1/B3 + SEC-03 | 6 |
| 3 | 2026-08-29 14:00 | Extend SEC-03 + empty/populated list | 6 |

---

## Postman / Newman generation

| Datetime | Tool | Action |
|----------|------|--------|
| 2026-08-29 14:30 | Node script | Generate 3 collections + CSV data files |
| 2026-08-29 15:00 | Newman | Execute collections → HTML reports |
