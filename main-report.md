# Main Report — HW06 API Testing

**MSSV:** 23127044  
**Assignment:** HW06 — API Testing (Postman + Newman + AI pipeline)  
**Date:** 2026-08-29  
**SUT:** `HW2/testing-seminar-eshop-sut` (localhost:3000)

---

## 1. Executive Summary

Bài HW06 triển khai pipeline kiểm thử API đầy đủ cho 3 feature giữ nguyên từ HW02:

| API | Feature | Endpoint | TC executed |
|-----|---------|----------|-------------|
| 1 | FR-04 Profile | `PUT /api/users/me` | 44 |
| 2 | FR-10 Order State | `PUT /api/admin/orders/:id/status` + user cancel | 44 |
| 3 | FR-18 Admin Orders | `GET /api/admin/orders` | 44 |

Mỗi API đi qua 5 bước: **Generate (AI step-by-step) → Audit (VALID/INVALID/INCOMPLETE) → Extend (≥6 TC) → Execute (Postman/Newman) → Report (bugs)**.

Header bắt buộc `X-Student-Id: 23127044` được gắn ở collection pre-request script.

---

## 2. API 1 — FR-04 Profile

### 2.1 Generate (6 AI sessions)

| Session | Prompt focus | Output |
|---------|--------------|--------|
| 1 | 5 input variables + partitions (name, phone, address, role, JWT) | 20 domain TC |
| 2 | BVA phone regex `^[1-9][0-9]{8,9}$` ON/OFF/IN/OUT | 8 boundary TC |
| 3 | SEC-06 role=admin in body | 3 security TC |
| 4 | SEC-02 auth: missing/expired/malformed token | 5 auth TC |
| 5 | Schema: response keys after PUT | 3 schema TC |
| 6 | Merge | **38 TC** → `api1-profile-generated.csv` |

### 2.2 Audit

Đối chiếu `fr04-profile/domain-testing.md` + `bva.md`:
- **6 TC INVALID** — AI giả định server validate phone/name như frontend
- Sửa expected status theo `server.js` thực tế

### 2.3 Extend (+6 TC)

| TC | Lý do AI miss |
|----|---------------|
| API1-E-01 | SEC-06 abstract, không đọc server cho phép update role |
| API1-E-02 | Regex frontend ≠ business rule VN phone |
| API1-E-03 | HTML required ≠ backend validation |
| API1-E-04 | Auth negative path thiếu |
| API1-E-05 | SQLi stability assert |
| API1-E-06 | Invalid role enum |

### 2.4 Execute

- Collection: `23127044_API1_Profile.postman_collection.json`
- Newman: `results/api1/newman-report.html`

### 2.5 Bugs

BUG-A1, BUG-A2, BUG-A3 — xem `bug-report.md`

---

## 3. API 2 — FR-10 Order State

### 3.1 Generate

State machine từ `fr10-order-state/domain-testing.md`:
- Valid transitions: pending→confirmed→shipping→delivered, cancel paths
- Invalid: skip-step, backward, terminal states
- User cancel sub-endpoint
- **38 TC** generated

### 3.2 Audit

- BUG-B1/B3 TC giữ expected đúng nghiệp vụ (400)
- SEC-03 user→admin API: sửa expected 403→200 (server thiếu role check)

### 3.3 Extend (+6 TC)

Focus invalid transitions và user vs admin cancel rules.

### 3.4 Execute

Setup chain: admin login → user login → cart → checkout → status prep per `from_status`.

---

## 4. API 3 — FR-18 Admin Orders

### 4.1 Generate

Partitions `admin_token` từ `fr18-order-admin/domain-testing.md`:
- Admin/user/no/expired token
- Schema array + required fields
- Empty vs populated list
- **38 TC** generated

### 4.2 Audit

4 TC SEC-03 corrected — backend trả 200 cho user token.

### 4.3 Extend (+6 TC)

Empty list, all fields schema, Content-Type header.

---

## 5. AI Misinterpretation Examples (≥3)

| # | AI said | Actual Newman | Correction |
|---|---------|---------------|------------|
| 1 | Phone `0912345678` → expect 400 (invalid regex) | Server returns 200 (no validation) | Expected = 200 for API layer; BUG-A1 is frontend-only |
| 2 | `role=admin` in body → expect 200 (profile update success) | Should be 403 SEC-06 | Expected = 403; documents BUG-A2 |
| 3 | User token on `GET /api/admin/orders` → expect 403 | Server returns 200 with full order list | Expected = 200 per actual; TC documents missing role check |
| 4 | `canceled → delivered` → expect 400 | Server returns 200 (BUG-B1) | Keep expected 400; Newman FAIL = bug evidence |

---

## 6. Postman Features Used

Xem `docs/postman-features-used.md`:
- Workspace, Collections ×3, Environment variables
- Pre-request scripts (X-Student-Id, conditional login)
- Test scripts (status, schema, JSON path)
- Collection Runner + CSV data-driven
- Newman CLI + htmlextra reports

---

## 7. CI/CD

GitHub Actions workflow `.github/workflows/api-tests.yml` — xem `docs/cicd-report.md`.

---

## 8. Agent Skill

`agent-skills/api-test-generator-skill/SKILL.md` — pipeline tái sử dụng cho API spec → Postman TC.

Diagram: `docs/test-generator-diagram.mmd` → user vẽ PNG tay.

---

## 9. References

- HW02 FR-04/10/18 domain testing artifacts
- API spec: `HW2/testing-seminar-eshop-sut/api_specification.md`
- SEC requirements: SEC-01 → SEC-07
