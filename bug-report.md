# Bug Report — HW06 API Testing

**MSSV:** 23127044  
**SUT:** testing-seminar-eshop-sut  
**GitHub Repo:** https://github.com/Donavfulish/HW06  
**HW02 Issues reference:** https://github.com/Donavfulish/eshop-sut-hw02/issues

---

## API 1 — FR-04 Profile (`PUT /api/users/me`)

| Bug ID | TC ID | Mô tả | Expected | Actual (Newman) | GitHub Issue |
|--------|-------|-------|----------|-----------------|--------------|
| BUG-A2 | API1-G-21, API1-E-01 | `role=admin` trong body → privilege escalation | 403 | 200 (iter 21, 39) | [#1](https://github.com/Donavfulish/HW06/issues/1) |
| BUG-A3 | API1-G-10, API1-E-03 | `name=""` qua API | 400 | 200 (iter 10, 41) | [#1](https://github.com/Donavfulish/HW06/issues/1) |

Newman API1: **8 failures** — `results/api1/newman-report.html`  
Evidence: `evidence/issue-api1-newman-failures.png`

---

## API 2 — FR-10 Order State

| Bug ID | TC ID | Mô tả | Expected | Actual (Newman) | GitHub Issue |
|--------|-------|-------|----------|-----------------|--------------|
| BUG-B1 | API2-G-15, API2-E-01 | Admin `canceled → delivered` | 400 | 200 (iter 15, 39) | [#2](https://github.com/Donavfulish/HW06/issues/2) |
| BUG-B3 | API2-G-29, API2-E-02 | User cancel khi `shipping` | 400 | 200 (iter 29, 40) | [#2](https://github.com/Donavfulish/HW06/issues/2) |

Newman API2: **13 failures** — `results/api2/newman-report.html`  
Evidence: `evidence/issue-api2-newman-failures.png`

---

## API 3 — FR-18 Admin Orders (`GET /api/admin/orders`)

| Bug ID | TC ID | Mô tả | Expected | Actual (Newman) | GitHub Issue |
|--------|-------|-------|----------|-----------------|--------------|
| SEC-03 | API3-E-01 | User JWT gọi admin list | 403 | 200 (iter 39) | [#3](https://github.com/Donavfulish/HW06/issues/3) |

Newman API3: **7 failures** — `results/api3/newman-report.html`  
Evidence: `evidence/issue-api3-newman-failures.png`

---

## GitHub Issues (HW06)

| Issue | Bug | URL |
|-------|-----|-----|
| #1 | BUG-A2 (+ BUG-A3 related) | https://github.com/Donavfulish/HW06/issues/1 |
| #2 | BUG-B1 + BUG-B3 | https://github.com/Donavfulish/HW06/issues/2 |
| #3 | SEC-03 | https://github.com/Donavfulish/HW06/issues/3 |

Issue list: https://github.com/Donavfulish/HW06/issues
