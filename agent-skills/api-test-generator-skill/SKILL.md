---
name: api-test-generator
description: Generate API test cases from spec through AI step-by-step pipeline to Postman/Newman. Use when the user asks to generate API tests, create Postman collections from API spec, audit AI-generated test cases, or build Newman data-driven test suites for REST APIs.
---

# API Test Generator Skill — HW06

**MSSV template:** 23127044  
**Trigger phrases:**
- "generate API tests for [endpoint]"
- "create Postman tests from api_spec"
- "audit test cases against HW02"
- "run Newman pipeline for [feature]"

---

## Prerequisites

- API spec markdown (`api_specification.md`)
- HW02 domain-testing reference (audit only — do NOT copy TC)
- SUT backend running on `localhost:3000`
- Postman/Newman installed
- Header `X-Student-Id: [MSSV]` on all requests

---

## Workflow (5 steps × each API)

### Step 1 — Generate (AI step-by-step, NOT one prompt)

Run **6 separate AI sessions** per API:

1. List input variables + domain partitions
2. BVA for bounded variables (regex, length)
3. Security SEC-01..07 checklist
4. Auth token partitions (missing/malformed/expired)
5. Response schema assertions
6. Merge ≥35 TC → CSV

**Output:** `testcases/{api}-generated.csv`

**CSV columns:**
```
TC_ID | Type | Scenario | Method | URL | Headers | Body | Expected_Status | Expected_Body_Assert | Audit_Label | Audit_Reason
```

### Step 2 — Audit

Compare each TC against:
- HW02 `domain-testing.md` / `bva.md`
- `backend/server.js` (ground truth)

Labels:
| Label | Action |
|-------|--------|
| VALID | Keep |
| INVALID | Fix expected status/assert |
| INCOMPLETE | Add missing param/security |

**Output:** `testcases/{api}-audit.csv`

### Step 3 — Extend (≥5 TC)

Add TC from known bugs AI typically misses:
- Privilege escalation fields hidden in API body
- Frontend vs backend validation gaps
- Invalid state transitions that exist as bugs
- SEC-03 without role middleware

Document **why AI missed** in `Audit_Reason`.

**Output:** `testcases/{api}-extended.csv`

### Step 4 — Execute

1. Build Postman collection v2.1 JSON
2. Collection pre-request: `X-Student-Id`
3. Setup folder: login, checkout (if needed)
4. Tests folder: data-driven from CSV
5. Run Newman:

```powershell
newman run postman/collections/{MSSV}_API{N}_{Name}.postman_collection.json `
  -e postman/environments/eshop-local.postman_environment.json `
  -d postman/data/{name}-test-data.csv `
  -r cli,htmlextra `
  --reporter-htmlextra-export results/api{N}/newman-report.html
```

### Step 5 — Report

- Failures on bug TC = evidence → GitHub Issues
- Update `bug-report.md`, `test-summary.md`

---

## Audit template

```markdown
| TC_ID | AI Expected | Code Truth | Label | Corrected Expected | Reason |
|-------|-------------|------------|-------|-------------------|--------|
| ... | 400 | 200 (no validation) | INVALID | 200 | server.js has no phone check |
```

---

## Anti-patterns

- ❌ One prompt: "generate all API tests from spec"
- ❌ Copy HW02 TC verbatim
- ❌ Skip audit against server.js
- ❌ Expect frontend validation on API-only tests without checking backend

---

## Related files

- Examples: [examples.md](examples.md)
- Pseudocode: `docs/test-generator-pseudocode.md`
- Diagram: `docs/test-generator-diagram.mmd`
