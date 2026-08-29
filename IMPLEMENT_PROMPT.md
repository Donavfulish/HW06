# IMPLEMENT PROMPT — Copy toàn bộ block dưới sang context window mới

---

## PROMPT (copy từ dòng này)

Bạn là agent implement HW06 API Testing cho sinh viên. Đọc và làm theo plan tại:

**Plan file:** `c:\YEAR 3\Kiểm thử\HW06\PLAN_HW06.md`

**Workspace root:** `c:\YEAR 3\Kiểm thử`

**SUT có sẵn:** `c:\YEAR 3\Kiểm thử\HW2\testing-seminar-eshop-sut`
- Backend: `backend/server.js`, port 3000
- Reset DB: `cd backend && npm run reset-db`
- Start: `cd backend && npm start`
- API spec: `api_specification.md`
- SEC requirements: `README.md` (SEC-01 → SEC-07)
- Users mặc định: `test@eshop.com`/`Test1234!`, `admin@eshop.com`/`Admin123!`

**HW02 reference (TÁI SỬ DỤNG — giữ feature cũ, tránh trùng teammate):**
- `HW2/testing-seminar-eshop-sut/submission/fr04-profile/domain-testing.md` + `bva.md` + `bug-report.md`
- `HW2/testing-seminar-eshop-sut/submission/fr10-order-state/domain-testing.md` + `bug-report.md`
- `HW2/testing-seminar-eshop-sut/submission/fr18-order-admin/domain-testing.md` + `bug-report.md`
- GitHub Issues HW02: https://github.com/Donavfulish/eshop-sut-hw02/issues

**MSSV:** 23127044  
**Thời gian mục tiêu:** 6–7 giờ — ưu tiên deliverables chấm điểm, không over-engineer  
**Mục tiêu:** 100/100 điểm HW06  
**ZIP nộp:** `23127044_HW06_AI_API_100.zip`

### 3 API đã chọn (GIỮ NGUYÊN FEATURE HW02)

| # | Pool | Feature | Endpoint chính | Pre-step |
|---|------|---------|----------------|----------|
| 1 | A | FR-04 Profile | `PUT /api/users/me` | `POST /api/login` (user token) |
| 2 | B | FR-10 Order State | `PUT /api/admin/orders/:id/status` | admin login → checkout tạo order |
| 2b | B | (sub) User cancel | `PUT /api/orders/:id/cancel` | user login + order pending/confirmed |
| 3 | C | FR-18 Admin Orders | `GET /api/admin/orders` | `POST /api/login` (admin token) |

**Header bắt buộc mọi request:** `X-Student-Id: 23127044` (collection pre-request script)

---

### Nhiệm vụ — implement tuần tự theo 8 phase trong PLAN_HW06.md

**Phase A (0:45):** Scaffold folder `HW06/` đúng cấu trúc mục 6 của plan. Tạo:

- `README.md` skeleton — self-assessment table (mục 10 PLAN) + test summary placeholder
- `postman/environments/eshop-local.postman_environment.json`:
  ```json
  { "baseUrl": "http://localhost:3000", "userEmail": "test@eshop.com", "userPassword": "Test1234!", "adminEmail": "admin@eshop.com", "adminPassword": "Admin123!" }
  ```
- Pre-request script (collection level):
  ```javascript
  pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });
  ```
- `evidence/x-student-id-pre-request-screenshot.md` — hướng dẫn user chụp Postman console
- `docs/postman-features-used.md` — template list features
- Init git trong `HW06/` nếu chưa có
- Smoke test: start backend → Postman login OK

**Commit:** `chore: init HW06 scaffold, Postman env, X-Student-Id script`

---

**Phase B (1:45):** API 1 — FR-04 Profile (`PUT /api/users/me`)

**B1 — Generate (AI step-by-step, KHÔNG 1 prompt chung):**
6 sessions riêng theo mục 3.2 PLAN:
1. Liệt kê 5 input variables + partitions (name, phone, shipping_address, role, JWT)
2. BVA phone regex `^[1-9][0-9]{8,9}$`
3. Security SEC-06: `role=admin` in body
4. Auth SEC-02: missing/expired/malformed token
5. Schema validation response keys
6. Merge ≥35 TC

Output: `testcases/api1-profile-generated.csv` (hoặc `.xlsx` nếu có tool; CSV OK cho Newman)

Cột TC: `TC_ID | Type(domain/security/schema/state) | Scenario | Method | URL | Headers | Body | Expected_Status | Expected_Body_Assert | Audit_Label | Audit_Reason`

**B2 — Audit:** Đối chiếu với `fr04-profile/domain-testing.md` + `bva.md`. Gán VALID/INVALID/INCOMPLETE + reasoning. Sửa INVALID/INCOMPLETE.  
Output: `testcases/api1-profile-audit.csv`

**B3 — Extend ≥5 TC** (AI thường miss — từ HW02 bugs):
- BUG-A2: body có `"role":"admin"` với user JWT → expect 403 (actual có thể 200 → fail = bug)
- BUG-A1: phone `0912345678` → expect 200 (actual 400)
- BUG-A3: `name=""` → expect 400 (actual 200)
- Missing Authorization header → 401
- SQLi trong name field → không crash, sanitized response

**B4 — Postman collection:** `postman/collections/23127044_API1_Profile.postman_collection.json`
- Folder Setup: Login user → save `{{userToken}}`
- Folder Tests: data-driven từ `postman/data/profile-test-data.csv`
- Test scripts: `pm.test("status", ...)`, JSON schema check user object
- Variables: `{{baseUrl}}`, `{{userToken}}`

**B5 — Newman run:**
```powershell
cd "c:\YEAR 3\Kiểm thử\HW2\testing-seminar-eshop-sut\backend"
npm run reset-db; npm start   # terminal riêng

cd "c:\YEAR 3\Kiểm thử\HW06"
newman run postman/collections/23127044_API1_Profile.postman_collection.json `
  -e postman/environments/eshop-local.postman_environment.json `
  -d postman/data/profile-test-data.csv `
  -r cli,htmlextra `
  --reporter-htmlextra-export results/api1/newman-report.html
```

**Commits:** `feat(api1): generate profile test cases` / `audit(api1): review against HW02 FR-04` / `feat(api1): extend SEC-06 tests` / `test(api1): Postman and Newman run`

---

**Phase C (1:45):** API 2 — FR-10 Order State (`PUT /api/admin/orders/:id/status`)

**Setup chain (folder Setup trong collection):**
```
POST /api/login (admin) → token
POST /api/login (user) → userToken
POST /api/cart (userToken) → add product
POST /api/checkout (userToken) → save orderId, status=pending
```

**Generate ≥35 TC** covering:
- Valid transitions: pending→confirmed, confirmed→shipping, shipping→delivered, pending→canceled, confirmed→canceled
- Invalid: canceled→delivered (BUG-B1), delivered→pending, shipping→pending
- Domain: invalid status enum, missing body, orderId not found (404)
- Security: user token gọi admin status API → 403
- Sub-folder user cancel: `PUT /api/orders/:id/cancel` — BUG-B3 cancel khi shipping

Output files: `testcases/api2-order-state-generated.csv`, `api2-order-state-audit.csv`  
Collection: `postman/collections/23127044_API2_OrderState.postman_collection.json`  
CSV: `postman/data/order-state-test-data.csv` (columns: from_status, to_status, role, expected_code)  
Newman → `results/api2/newman-report.html`

**Commits:** tương tự api2

---

**Phase D (1:45):** API 3 — FR-18 Admin Orders (`GET /api/admin/orders`)

**Generate ≥35 TC** covering:
- Admin token → 200 + array schema
- User token → 403 (SEC-03)
- No token → 401
- Expired/malformed token → 401
- Schema: each order has id, status, total_amount, shipping_address, user_id, created_at
- Edge: response Content-Type application/json
- Empty orders list (sau reset-db) vs có data

Tham chiếu: `fr18-order-admin/domain-testing.md` partitions V1 (admin_token)

Output: `testcases/api3-admin-orders-*.csv`  
Collection: `postman/collections/23127044_API3_AdminOrders.postman_collection.json`  
Newman → `results/api3/newman-report.html`

**Commits:** tương tự api3

---

**Phase E (1:00):** CI/CD — GitHub Actions

Tạo `.github/workflows/api-tests.yml`:
- Trigger: push, pull_request
- Steps: checkout → setup-node → npm ci backend → reset-db → start server (background) → sleep 5 → install newman → run cả 3 collections
- Health check: `curl http://localhost:3000/api/products` trước Newman

Tạo `docs/cicd-report.md`:
- Mô tả pipeline
- Placeholder 2 screenshots: [TODO: all-pass run] + [TODO: fail demo run]
- Hướng dẫn user tạo commit fail: sửa 1 test expect 201 thay 200 → push → screenshot Actions đỏ

**Commits:** `ci: add Newman GitHub Actions workflow` / `test: demo failing pipeline run`

---

**Phase F (1:30):** Reports + AI docs

Viết đầy đủ (format giống HW02/HW05 submission):

- `main-report.md` — Executive summary + 3 API × (generate/audit/extend/execute/bugs) + list Postman features
- `ai-audit.md` — mỗi AI session: tool name, datetime, prompt, output, human review action
- `ai-critique.md` — 200–300 từ tiếng Việt (AI sai ở đâu, tại sao, bài học)
- `bug-report.md` — link GitHub Issues + mô tả bugs (có thể reference HW02 #1–#14 + bugs mới trên repo HW06)
- `testcases/test-summary.md` — bảng TC generated/audited/extended/executed/pass/fail per API

Ghi ≥3 ví dụ AI misinterpretation trong main-report (cột: AI said | Actual Newman | Correction)

**Commit:** `docs: main report, AI audit, critique and bug reports`

---

**Phase G (1:00):** Agent Skill — API Test Generator (10 điểm)

Tạo:
- `agent-skills/api-test-generator-skill/SKILL.md` — trigger phrase, workflow, audit template
- `agent-skills/api-test-generator-skill/examples.md` — example cho FR-04
- `docs/test-generator-pseudocode.md` — pseudocode pipeline
- `docs/test-generator-diagram.mmd` — Mermaid source (user tự vẽ PNG tay từ đây)
- `docs/test-generator-diagram.md` — note: "Export PNG bằng Excalidraw — anti-cheat self-drawn"

Diagram flow:
```
API Spec → Parse params → AI domain partitions → AI security SEC checklist
→ AI schema asserts → Human audit VALID/INVALID/INCOMPLETE → Extend ≥5
→ Export CSV → Postman collection → Newman → Bug report
```

Placeholder video trong README: `[TODO: YouTube unlisted link — demo skill generate TC cho 1 API]`

**Commit:** `feat: api-test-generator skill, diagram and pseudocode`

---

**Phase H (0:30):** Finalize

- `git-commit-log.txt` — log tất cả commits theo mục 9 PLAN
- README test summary điền số liệu thật (hoặc placeholder nếu chưa chạy Newman)
- Verify checklist mục 8 PLAN_HW06.md
- Script `run-all.ps1`:
  ```powershell
  # Start SUT, run 3 Newman collections, export reports
  ```

---

### Quy tắc code

1. **Minimize scope** — chỉ file trong `HW06/`, không sửa SUT backend
2. **Match format HW02/HW05** — Markdown reports, folder structure rõ, tiếng Việt trong report
3. **Generate TC mới bằng AI** — KHÔNG copy nguyên 135 TC HW02; dùng HW02 để audit + extend
4. **AI step-by-step** — KHÔNG prompt "generate all API tests from spec"
5. **Postman collections** phải là JSON hợp lệ import được Postman v10+
6. **Mỗi API ≥35 TC** sau audit + **≥5 extend** có giải thích "why AI missed"
7. **Header X-Student-Id: 23127044** — pre-request script collection level
8. **Mỗi phase xong → git commit** theo mục 9 PLAN
9. Nếu không chạy được Newman trên máy agent: tạo collection + CSV + script `run-all.ps1` + hướng dẫn user chạy; vẫn tạo đủ folder structure

### User phải tự làm (ghi rõ trong README)

- [ ] Chụp screenshot Postman console hiện `X-Student-Id: 23127044` → `evidence/x-student-id-pre-request-screenshot.png`
- [ ] Chạy Newman local nếu agent chưa chạy được → `results/api*/newman-report.html`
- [ ] Vẽ diagram PNG tay (Excalidraw) từ `docs/test-generator-diagram.mmd` → `docs/test-generator-diagram.png`
- [ ] Export PDF: `main-report.pdf`, `ai-audit.pdf`, `ai-critique.pdf`
- [ ] Push GitHub public + 2 CI runs (pass + fail) screenshots
- [ ] Tạo GitHub Issues bugs mới (screenshot đính kèm) trên repo HW06
- [ ] (Optional) Video demo Agent Skill → YouTube unlisted
- [ ] ZIP nộp Moodle

### Output cuối

Sau khi xong, trả lời user:
1. Tree folder `HW06/` đã tạo
2. File nào user phải chạy/chụp tay (Newman, screenshot, PDF, diagram, CI)
3. Checklist còn thiếu gì trước khi ZIP nộp Moodle
4. Lệnh ZIP:
   ```powershell
   Compress-Archive -Path "c:\YEAR 3\Kiểm thử\HW06\*" -DestinationPath "c:\YEAR 3\Kiểm thử\23127044_HW06_AI_API_100.zip"
   ```

Bắt đầu từ Phase A ngay. Đọc `PLAN_HW06.md` và HW02 `fr04/fr10/fr18` trước khi code.

---

## END PROMPT
