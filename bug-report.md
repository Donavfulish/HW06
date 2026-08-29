# Bug Report — HW06 API Testing

**MSSV:** 23127044  
**SUT:** testing-seminar-eshop-sut  
**HW02 Issues reference:** https://github.com/Donavfulish/eshop-sut-hw02/issues

---

## API 1 — FR-04 Profile (`PUT /api/users/me`)

| Bug ID | TC ID | Mô tả | Expected | Actual | HW02 Issue |
|--------|-------|-------|----------|--------|------------|
| BUG-A1 | API1-E-02 | Phone VN `0912345678` bị reject ở frontend | 200 accept | Frontend reject (API test: server accepts) | [#1](https://github.com/Donavfulish/eshop-sut-hw02/issues/1) |
| BUG-A2 | API1-E-01 | `role=admin` trong body → privilege escalation | 403 Forbidden | 200, role đổi thành admin | [#2](https://github.com/Donavfulish/eshop-sut-hw02/issues/2) |
| BUG-A3 | API1-E-03 | `name=""` qua API | 400 validation | 200, name bị xóa | [#3](https://github.com/Donavfulish/eshop-sut-hw02/issues/3) |

---

## API 2 — FR-10 Order State

| Bug ID | TC ID | Mô tả | Expected | Actual | HW02 Issue |
|--------|-------|-------|----------|--------|------------|
| BUG-B1 | API2-E-01 | Admin `canceled → delivered` | 400 invalid transition | 200 updated | [#4](https://github.com/Donavfulish/eshop-sut-hw02/issues/4) |
| BUG-B3 | API2-E-02 | User cancel khi `shipping` | 400 cannot cancel | 200 canceled | [#6](https://github.com/Donavfulish/eshop-sut-hw02/issues/6) |

---

## API 3 — FR-18 Admin Orders (`GET /api/admin/orders`)

| Bug ID | TC ID | Mô tả | Expected | Actual | HW02 Issue |
|--------|-------|-------|----------|--------|------------|
| SEC-no-role | API3-E-01 | User JWT gọi admin list | 403 SEC-03 | 200 + full data | FR18-DT-17 |

---

## Newman evidence

Sau khi chạy `.\run-all.ps1`, các TC expect bug sẽ **FAIL** trong Newman report — đây là bằng chứng phát hiện bug.

- `results/api1/newman-report.html`
- `results/api2/newman-report.html`
- `results/api3/newman-report.html`

---

## GitHub Issues mới (HW06 repo)

> [TODO: Tạo issues trên repo HW06 public với screenshot Newman fail]

| Issue | Bug | Screenshot |
|-------|-----|------------|
| #1 | BUG-A2 role escalation | [TODO] |
| #2 | BUG-B1 canceled→delivered | [TODO] |
| #3 | SEC-03 user admin API | [TODO] |
