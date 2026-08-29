# PLAN HW06 — API Testing (EShop SUT)

**MSSV:** 23127044  
**Mục tiêu:** 100/100 điểm  
**Thời gian ước tính:** 10 giờ (theo đề) — có thể nén ~6–7 giờ nếu tái sử dụng SUT + workflow từ HW02/HW05  
**Deadline:** Theo Moodle  
**SUT:** `HW2/testing-seminar-eshop-sut` (fork GitHub public mới cho HW06)  
**Tool:** Postman + Newman (default)  
**ZIP nộp:** `23127044_HW06_AI_API_100.zip`

---

## 0. Quick Reference

| Item | Value |
|------|-------|
| Base URL | `http://localhost:3000` |
| Start SUT | `cd backend && npm install && npm start` |
| Reset DB | `cd backend && npm run reset-db` |
| Default user | `test@eshop.com` / `Test1234!` |
| Admin | `admin@eshop.com` / `Admin123!` |
| Lockout rule | Sai password → `login_attempts += 2`; `>= 3` → khóa 3 phút (403) |
| Header bắt buộc | `X-Student-Id: 23127044` (pre-request script toàn collection) |
| API spec | `HW2/testing-seminar-eshop-sut/api_specification.md` |
| GitHub HW02 ref | https://github.com/Donavfulish/eshop-sut-hw02 |
| GitHub HW05 ref | repo HW05 (nếu đã push) |

---

## 1. Phân công nhóm — Giữ API HW02, tránh trùng teammate

> **Chiến lược:** Nhóm 5 người — mỗi người chọn bộ API **khác nhau**. Bạn **giữ nguyên 3 feature đã làm HW02** (FR-04, FR-10, FR-18) vì teammate sẽ chọn Login, Checkout, Register… → không ai trùng với bạn.

### 1.1 Chiến lược chọn API — 23127044

| Pool | Feature HW02 (GIỮ LẠI) | Endpoint chính HW06 | Lý do |
|------|------------------------|---------------------|-------|
| A | **FR-04** Profile | `PUT /api/users/me` | Đã có 33 TC DT/BVA, 4 bugs — chuyển sang API testing pipeline |
| B | **FR-10** Order State Machine | `PUT /api/admin/orders/:id/status` | State transitions đầy đủ, 3 bugs — core API của FR-10 |
| C | **FR-18** Order Management Admin | `GET /api/admin/orders` | Admin list + SEC-03, 4 bugs — khác endpoint với API 2 |

**Endpoint phụ (setup trong collection, không tính API thứ 4):**

| API | Pre-step / cleanup |
|-----|-------------------|
| API 1 Profile | `POST /api/login` → lấy user token |
| API 2 Order State | `POST /api/login` (admin) → tạo order qua checkout nếu cần → update status |
| API 2 (user cancel) | Sub-folder: `PUT /api/orders/:id/cancel` — TC state transition phía user |
| API 3 Admin Orders | `POST /api/login` (admin token) |

> **Phân biệt API 2 vs API 3:** Cùng domain “orders” nhưng **endpoint khác nhau** — API 2 test **state machine** (`PUT …/status`), API 3 test **admin list/access** (`GET …/orders`). Đúng yêu cầu “1 feature / pool”.

### 1.2 Tài liệu HW02 tái sử dụng trực tiếp

| HW02 artifact | Path | Dùng cho HW06 |
|---------------|------|---------------|
| Domain partitions FR-04 | `HW2/.../fr04-profile/domain-testing.md` | Seed prompt AI + cross-check audit |
| BVA FR-04 | `HW2/.../fr04-profile/bva.md` | Boundary TC (phone regex, name empty) |
| State machine FR-10 | `HW2/.../fr10-order-state/domain-testing.md` | State transition TC + extend |
| Admin partitions FR-18 | `HW2/.../fr18-order-admin/domain-testing.md` | SEC-03, token partitions |
| Bug reports | `HW2/.../fr*/bug-report.md` | ≥5 TC extend + GitHub Issues (có thể re-open/new HW06 repo) |
| GitHub Issues #1–#14 | eshop-sut-hw02 | Evidence bugs — link lại hoặc tạo issue mới trên repo HW06 |

### 1.3 Bugs HW02 → TC extend gợi ý (AI thường miss lần 2)

| API | Bug HW02 | TC extend HW06 |
|-----|----------|----------------|
| Profile | BUG-A1 phone `091…` reject | Assert 400 + schema error message |
| Profile | BUG-A2 `role=admin` in body | SEC-06 privilege escalation → 403 |
| Profile | BUG-A3 `name=""` → 200 | Schema + business rule assert |
| Order State | BUG-B1 `canceled→delivered` → 200 | Invalid transition → expect 400 |
| Order State | BUG-B3 user cancel khi `shipping` | State + SEC: user vs admin cancel rules |
| Admin Orders | BUG-C1 revenue ×2 | `GET /api/admin/orders` + aggregate assert (nếu response có total) |
| Admin Orders | User token → admin API | SEC-03 → 403 + schema error body |

> **Lưu ý:** HW06 vẫn phải **generate mới bằng AI** (step-by-step), audit, rồi extend — **không** copy nguyên 135 TC HW02. Dùng HW02 làm **reference để audit AI** và viết extend nhanh hơn.

### 1.4 Gợi ý phân chia teammate (4 người còn lại — KHÔNG chọn FR-04/10/18)

| Thành viên | Pool A | Pool B | Pool C |
|------------|--------|--------|--------|
| **23127044 (bạn)** | **FR-04** Profile | **FR-10** Order State | **FR-18** Admin Orders |
| Teammate 2 | FR-01 Register | FR-07 Cart API | FR-15 Product CRUD |
| Teammate 3 | FR-02 Login | FR-08 Checkout | FR-17 Coupon admin |
| Teammate 4 | FR-03 Forgot/Reset | FR-09 Apply coupon | FR-14 Category CRUD |
| Teammate 5 | FR-05 Product search | FR-11 Order history | FR-19 User admin |

### 1.5 Tái sử dụng infra từ HW02/HW05

| Tài nguyên | Cách dùng HW06 |
|------------|----------------|
| SUT `testing-seminar-eshop-sut` | Backend Newman |
| `domain-testing-skill`, `bva-skill` | Input cho **api-test-generator-skill** mới (evolve, không nộp lại skill cũ) |
| Format reports HW02 | Copy structure `main-report.md`, `ai-audit.md` |
| `register_users.js` (HW05) | Tạo user pool cho profile / order tests |
| Postman JWT pattern đã quen | Pre-request auto-login |

---

## 2. Rubric → Deliverables (100 điểm)

| # | Tiêu chí | Điểm | Deliverable |
|---|----------|------|-------------|
| 1 | API 1 — full pipeline | 30 | Generate ≥35 TC + audit + extend ≥5 + Newman + bugs |
| 2 | API 2 — full pipeline | 30 | (tương tự) |
| 3 | API 3 — full pipeline | 30 | (tương tự) |
| 4 | Agent Skill — AI test generator | 10 | Diagram (self-drawn) + pseudocode + optional video |

**Anti-cheat (thiếu = 0 điểm cả bài):**

- Header `X-Student-Id: 23127044` — screenshot console pre-request script
- Newman output hostname khớp deployment (`localhost` OK)
- Diagram test-generator **self-drawn** (không AI-generate diagram)
- Git commit log theo từng bước pipeline

---

## 3. Pipeline cho MỖI API (5 bước × 3 API)

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 1. Generate │ → │  2. Audit   │ → │  3. Extend  │ → │  4. Execute │ → │ 5. Report   │
│  AI step-by │   │ VALID/      │   │  ≥5 TC AI   │   │ Postman +   │   │ bugs GitHub │
│  step ≥35TC │   │ INVALID/    │   │ missed +    │   │ Newman HTML │   │ Issues +    │
│             │   │ INCOMPLETE  │   │ explain why │   │ report      │   │ screenshot  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### 3.1 Coverage bắt buộc mỗi API (≥35 TC)

| Loại | Nội dung | Gợi ý TC cho 3 API (FR-04 / FR-10 / FR-18) |
|------|----------|---------------------------------------------|
| **Domain partitions** | Mọi parameter valid/invalid | Profile: name, phone, shipping_address; Order status: enum `pending/confirmed/…`; Admin list: query params (nếu có) |
| **State transitions** | FR-10 bắt buộc | pending→confirmed→shipping→delivered; cancel rules; terminal states; invalid transitions (BUG-B1) |
| **Security SEC-01–07** | SQLi, IDOR, role escalation, JWT | Profile: SEC-06 `role` in body (BUG-A2); Order: user cancel order người khác (IDOR); Admin: SEC-03 user token (BUG-C*) |
| **Schema validation** | Response shape khớp spec | Profile: user object fields; Status update: order id + status; Admin list: array shape + order fields |

### 3.2 Quy trình AI step-by-step (KHÔNG 1 prompt chung)

**Session mẫu cho API 1 — PUT /api/users/me (FR-04):**

| Step | Prompt AI (ví dụ) | Output mong đợi |
|------|-------------------|-----------------|
| 1 | "Đọc api_specification.md §2.2 + fr04-profile/domain-testing.md. Liệt kê 5 input variables và partitions." | Bảng partitions (name, phone, address, role, JWT) |
| 2 | "BVA cho phone regex `^[1-9][0-9]{8,9}$` — ON/OFF/IN/OUT." | TC boundary (BUG-A1) |
| 3 | "TC security SEC-06: gửi `role=admin` trong body với user JWT." | SEC TC (BUG-A2) |
| 4 | "TC schema: assert response keys sau PUT — id, name, email, phone, role." | Schema TC |
| 5 | "TC auth: missing token, expired token, malformed Bearer." | SEC-02 TC |
| 6 | "Merge ≥35 TC: ID, Scenario, Input, Expected, Type (domain/security/schema)." | Excel-ready |

**Session mẫu cho API 2 — PUT /api/admin/orders/:id/status (FR-10):**

| Step | Prompt | Output |
|------|--------|--------|
| 1 | "Vẽ state machine từ fr10-order-state/domain-testing.md." | Transition table |
| 2 | "TC mỗi valid transition (admin token)." | ~8 TC |
| 3 | "TC invalid transitions: canceled→delivered, delivered→pending, shipping→canceled by user." | State + security |
| 4 | "Domain: status enum invalid value, missing body, order id not found." | Domain TC |
| 5 | "Schema assert response order object after status update." | Schema TC |
| 6 | "Merge ≥35 TC." | Excel |

**Session mẫu cho API 3 — GET /api/admin/orders (FR-18):**

| Step | Prompt | Output |
|------|--------|--------|
| 1 | "Đọc fr18-order-admin/domain-testing.md — partitions admin_token." | SEC-03 partitions |
| 2 | "TC: admin token, user token, no token, expired token." | Auth TC |
| 3 | "Schema: assert array of orders, required fields per order." | Schema TC |
| 4 | "Security: IDOR — user A không gọi được admin list." | SEC TC |
| 5 | "Edge: empty DB, many orders, response content-type." | Domain TC |
| 6 | "Merge ≥35 TC." | Excel |

### 3.3 Audit (human review)

Mỗi TC AI gán nhãn:

| Label | Ý nghĩa | Hành động |
|-------|---------|-----------|
| **VALID** | Đúng spec, executable | Giữ nguyên |
| **INVALID** | Sai expected/status code | Sửa + ghi reasoning |
| **INCOMPLETE** | Thiếu param/assert/security | Bổ sung |

Xuất file: `testcases/api1-profile-audit.xlsx` (sheet Audit với cột Label + Reasoning).

### 3.4 Extend (≥5 TC / API — tập trung security & state)

**Ưu tiên bugs đã biết từ HW02 — đây là lợi thế khi giữ cùng API:**

| API | TC extend (từ HW02) | Lý do AI miss |
|-----|---------------------|---------------|
| Profile | `role=admin` trong body → vẫn 200 (BUG-A2) | AI biết SEC-06 nhưng không đọc server.js cho phép update role |
| Profile | Phone VN `0912345678` bị reject (BUG-A1) | AI dùng regex generic, không biết rule VN |
| Profile | `name=""` qua API → 200 (BUG-A3) | AI assume frontend validation = backend validation |
| Order State | Admin `canceled → delivered` → 200 (BUG-B1) | AI liệt kê terminal state nhưng không viết TC invalid transition |
| Order State | User cancel đơn đang `shipping` (BUG-B3) | AI không phân biệt user cancel vs admin cancel rules |
| Admin Orders | User JWT gọi `GET /api/admin/orders` → phải 403 | AI list SEC-03 abstract, thiếu executable TC |
| Admin Orders | Response schema khi 0 orders vs N orders | AI chỉ test happy path 1 order |

### 3.5 Execute — Postman + Newman

**Collection naming:**

```
postman/
├── environments/
│   └── eshop-local.postman_environment.json
├── collections/
│   ├── 23127044_API1_Profile.postman_collection.json
│   ├── 23127044_API2_OrderState.postman_collection.json
│   └── 23127044_API3_AdminOrders.postman_collection.json
├── data/
│   ├── profile-test-data.csv        ← data-driven PUT /api/users/me
│   ├── order-state-test-data.csv    ← status transitions
│   └── admin-orders-test-data.csv
└── scripts/
    └── pre-request-global.js        ← X-Student-Id header
```

**Pre-request script (collection level):**

```javascript
pm.request.headers.add({
  key: 'X-Student-Id',
  value: '23127044'
});
```

**Newman commands:**

```powershell
# API 1
newman run postman/collections/23127044_API1_Profile.postman_collection.json `
  -e postman/environments/eshop-local.postman_environment.json `
  -d postman/data/profile-test-data.csv `
  -r cli,htmlextra `
  --reporter-htmlextra-export results/api1/newman-report.html

# API 2, 3 — tương tự
```

**Postman features cần dùng (ghi trong report):**

| Feature | Ứng dụng HW06 |
|---------|---------------|
| Workspace | 1 workspace `23127044-HW06` |
| Collections | 3 collections theo API |
| Variables | `{{baseUrl}}`, `{{token}}`, `{{adminToken}}`, `{{orderId}}` |
| Environment | local + (optional) staging |
| Pre-request scripts | X-Student-Id, auto-login |
| Tests scripts | Schema assert, status code, JSON path |
| Collection Runner + CSV | Data-driven ≥35 rows/API |
| Monitors | (optional) schedule daily smoke |
| Mock server | (optional) mock profile/update response cho demo |

---

## 4. CI/CD (GitHub Actions)

**File:** `.github/workflows/api-tests.yml`

```yaml
name: API Tests (Newman)
on: [push, pull_request]
jobs:
  newman:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci && npm run reset-db &
      - run: cd backend && npm start &
      - run: sleep 5
      - run: npm install -g newman newman-reporter-htmlextra
      - run: newman run postman/collections/23127044_API1_Profile.postman_collection.json -e postman/environments/eshop-local.postman_environment.json
```

**2 sample commits bắt buộc:**

| Commit | Mục đích | Evidence |
|--------|----------|----------|
| `test: all API tests passing` | Pipeline xanh 100% | Screenshot Actions + link run |
| `test: inject failing assertion for demo` | 1 TC fail cố ý (vd. expect 201 thay 200) | Screenshot Actions đỏ |

**CI/CD report:** `docs/cicd-report.md` — mô tả pipeline, 2 screenshots, link GitHub Actions.

---

## 5. Agent Skill — AI-driven API Test Generator (10 điểm)

**Path:** `agent-skills/api-test-generator-skill/SKILL.md`

**Deliverables:**

| File | Nội dung |
|------|----------|
| `docs/test-generator-diagram.png` | Self-drawn flowchart (Draw.io / Excalidraw / Mermaid bạn tự vẽ) |
| `docs/test-generator-pseudocode.md` | Pseudocode pipeline |
| `agent-skills/api-test-generator-skill/SKILL.md` | Skill tái sử dụng |
| Video (optional +điểm) | Demo generate TC cho 1 API → YouTube unlisted |

**Diagram logic (gợi ý):**

```
API Spec (md) → Parse endpoints → Extract params
      → AI: domain partitions (per param)
      → AI: security checklist SEC-01..07
      → AI: schema from response examples
      → Human audit gate (VALID/INVALID/INCOMPLETE)
      → Export Excel + Postman collection JSON
      → Newman run
```

> **Khác HW02:** HW02 skill = domain-testing + BVA cho **feature/UI**. HW06 skill = **API spec → Postman TC** tự động.

---

## 6. Cấu trúc repo HW06

```
HW06/
├── PLAN_HW06.md                       ← file này
├── IMPLEMENT_PROMPT.md                ← prompt copy sang agent mới
├── README.md                          ← self-assessment + test summary
├── main-report.md / main-report.pdf
├── ai-audit.md / ai-audit.pdf
├── ai-critique.md / ai-critique.pdf   ← 200–300 từ
├── git-commit-log.txt
├── bug-report.md
├── testcases/
│   ├── api1-profile-generated.xlsx
│   ├── api1-profile-audit.xlsx
│   ├── api1-profile-summary.xlsx
│   ├── api2-order-state-*.xlsx
│   └── api3-admin-orders-*.xlsx
│   └── hw02-ref/                    ← symlink hoặc copy link tới fr04/fr10/fr18
├── postman/
│   ├── collections/                   ← 3 .json
│   ├── environments/
│   ├── data/                          ← CSV data-driven
│   └── scripts/
├── results/
│   ├── api1/  { newman-report.html, console-screenshot.png }
│   ├── api2/
│   └── api3/
├── docs/
│   ├── cicd-report.md
│   ├── test-generator-diagram.png
│   ├── test-generator-pseudocode.md
│   └── postman-features-used.md
├── evidence/
│   └── x-student-id-pre-request-screenshot.png
├── agent-skills/
│   └── api-test-generator-skill/
│       ├── SKILL.md
│       └── examples.md
└── .github/
    └── workflows/
        └── api-tests.yml
```

---

## 7. Lộ trình thực hiện (10 giờ)

### H0:00–0:45 | Phase A — Setup & scaffold

- [ ] Tạo folder `HW06/` theo mục 6
- [ ] Fork GitHub public: `Donavfulish/eshop-sut-hw06` (hoặc `HW06-API-23127044`)
- [ ] Smoke test SUT: login → cart → checkout
- [ ] Cài Newman: `npm install -g newman newman-reporter-htmlextra`
- [ ] Tạo Postman workspace + environment + pre-request X-Student-Id
- [ ] Chụp screenshot pre-request script → `evidence/`
- [ ] Init git + README skeleton (self-assessment table)
- **Commit:** `chore: init HW06 scaffold, Postman env, X-Student-Id script`

### H0:45–2:30 | Phase B — API 1: PUT /api/users/me (FR-04)

| Bước | Thời gian | Output |
|------|-----------|--------|
| Generate (6 AI sessions) | 45 min | `testcases/api1-profile-generated.xlsx` ≥35 TC |
| Audit (đối chiếu HW02) | 30 min | So sánh với `fr04-profile/*.md` — label VALID/INVALID/INCOMPLETE |
| Extend | 20 min | +≥5 TC (BUG-A2 role, BUG-A1 phone, SEC-06) |
| Postman collection | 40 min | Login → PUT profile + tests + CSV |
| Newman run | 15 min | `results/api1/newman-report.html` |
| Bugs | — | Link HW02 Issues #1–#3, #14 hoặc tạo mới trên repo HW06 |

- **Commits:** `feat(api1): generate profile test cases` / `audit(api1): review against HW02 partitions` / `feat(api1): extend SEC-06 role escalation tests` / `test(api1): Postman collection and Newman run`

### H2:30–4:15 | Phase C — API 2: PUT /api/admin/orders/:id/status (FR-10)

- Setup: admin login → tạo order (checkout) → transition tests
- Sub-collection: `PUT /api/orders/:id/cancel` cho user-side cancel
- Coverage: valid/invalid state machine, terminal states (BUG-B1, B3)
- Data-driven CSV ≥35 rows (from_status, to_status, role, expected_code)
- **Commits:** tương tự Phase B (`api2`)

### H4:15–6:00 | Phase D — API 3: GET /api/admin/orders (FR-18)

- Admin vs user token (SEC-03)
- Schema: order array, field types, empty list
- Cross-ref BUG-C1 nếu response có aggregate fields
- **Commits:** tương tự (`api3`)

### H6:00–7:00 | Phase E — CI/CD

- [ ] `.github/workflows/api-tests.yml`
- [ ] Push → verify green run
- [ ] Commit fail demo → screenshot red run
- [ ] Viết `docs/cicd-report.md`
- **Commits:** `ci: add Newman GitHub Actions` / `test: demo failing pipeline run`

### H7:00–8:30 | Phase F — Reports + AI docs

- [ ] `main-report.md` — 3 API × pipeline, Postman features list
- [ ] `ai-audit.md` — log đủ: tool, datetime, prompt, output (mỗi AI session)
- [ ] `ai-critique.md` — 200–300 từ tiếng Việt
- [ ] `bug-report.md` — link GitHub Issues + screenshot
- [ ] Export PDF: main-report, ai-audit, ai-critique
- **Commit:** `docs: main report, AI audit and critique`

### H8:30–9:30 | Phase G — Agent Skill + diagram

- [ ] Vẽ diagram (self-drawn) → PNG
- [ ] Pseudocode → `docs/test-generator-pseudocode.md`
- [ ] `agent-skills/api-test-generator-skill/SKILL.md`
- [ ] (Optional) Video demo 3–5 phút YouTube
- **Commit:** `feat: api-test-generator skill and diagram`

### H9:30–10:00 | Phase H — Finalize & ZIP

- [ ] `git-commit-log.txt`
- [ ] README test summary (APIs, TC generated/extended/executed/pass/fail, bugs)
- [ ] Self-assessment table điền đủ
- [ ] Checklist mục 8
- [ ] ZIP → `23127044_HW06_AI_API_100.zip`

---

## 8. Checklist trước khi nộp Moodle

### Bắt buộc (thiếu = 0 điểm)

- [ ] `23127044_HW06_AI_API_XXX.zip` đúng format
- [ ] Main report (Markdown + PDF)
- [ ] Link GitHub public (collections, scripts, CI)
- [ ] Postman collection `.json` × 3 + Newman HTML report
- [ ] List Postman features đã dùng
- [ ] CI/CD report + 2 pipeline runs (pass + fail) screenshots/links
- [ ] Excel test cases + test summary
- [ ] Diagram + pseudocode test generator (PNG + md)
- [ ] Bug report + GitHub Issues screenshots
- [ ] AI Critique + AI Audit (Markdown + PDF)
- [ ] `git-commit-log.txt`
- [ ] README self-assessment + test summary
- [ ] Screenshot `X-Student-Id` pre-request script

### Chất lượng (để đạt 100)

- [ ] Mỗi API ≥35 TC sau audit (không tính TC INVALID bị loại)
- [ ] Mỗi API ≥5 TC extend có giải thích "why AI missed"
- [ ] Mỗi API có TC security + schema + domain + state (nếu áp dụng)
- [ ] Audit reasoning chi tiết, không chỉ gán label
- [ ] Newman chạy thật trên localhost (hostname khớp)
- [ ] Git commit tách từng bước pipeline

---

## 9. Git commit message template

```
chore: init HW06 scaffold
feat(api1): generate profile PUT test cases with AI
audit(api1): review profile TC against HW02 FR-04 partitions
feat(api1): extend SEC-06 role escalation and phone boundary tests
test(api1): Postman collection and Newman HTML report
feat(api2): generate order state transition test cases
audit(api2): review against HW02 FR-10 state machine
feat(api2): extend invalid transition canceled-to-delivered tests
test(api2): Newman run order state collection
feat(api3): generate admin orders list test cases
audit(api3): review against HW02 FR-18 admin partitions
feat(api3): extend SEC-03 user token access tests
test(api3): Newman run admin orders collection
ci: add Newman GitHub Actions workflow
test: demo failing pipeline for CI report
docs: main report AI audit critique and bug reports
feat: api-test-generator skill diagram and pseudocode
chore: finalize README and git commit log
```

---

## 10. Self-Assessment Template (README)

| No. | Criteria | Max | Self-Assessed |
|-----|----------|-----|---------------|
| 1 | API 1 — Profile (FR-04) full pipeline | 30 | |
| 2 | API 2 — Order State (FR-10) full pipeline | 30 | |
| 3 | API 3 — Admin Orders (FR-18) full pipeline | 30 | |
| 4 | Agent Skill — API test generator | 10 | |
| | **Total** | **100** | |

### Test Summary (điền sau khi chạy xong)

| Metric | API 1 | API 2 | API 3 | Total |
|--------|-------|-------|-------|-------|
| TC generated (AI) | | | | |
| TC after audit (valid) | | | | |
| TC extended (human) | | | | |
| TC executed | | | | |
| Passed | | | | |
| Failed | | | | |
| Bugs found | | | | |

---

## 11. Rủi ro & mitigations

| Rủi ro | Mitigation |
|--------|------------|
| Trùng API với teammate | Bạn giữ FR-04/10/18 — confirm teammate không chọn (mục 1.4) |
| AI generate <35 TC | Session riêng per param + tham chiếu HW02 partitions |
| Order state cần order sẵn | Collection folder "Setup": login → cart → checkout → lưu `orderId` |
| Copy nguyên TC HW02 bị trừ điểm | Generate mới + audit; HW02 chỉ là reference |
| CI không start được backend | `npm run reset-db` + wait + health check step |
| Diagram bị coi AI-generated | Dùng Excalidraw tay + photo/screenshot |

---

## 12. Tham chiếu

- Đề bài: `2026.HW06.API Testing_En.pdf`
- HW02 features đã làm: `HW2/testing-seminar-eshop-sut/submission/README.md`
- API spec: `HW2/testing-seminar-eshop-sut/api_specification.md`
- SEC requirements: `HW2/testing-seminar-eshop-sut/README.md` (SEC-01–SEC-07)
- Plan mẫu format: `HW05/PLAN_HW05.md`
