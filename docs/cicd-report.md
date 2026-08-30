# CI/CD Report — HW06 Newman Pipeline

**MSSV:** 23127044  
**Repo:** https://github.com/Donavfulish/HW06  
**Workflow:** `.github/workflows/api-tests.yml`  
**Actions:** https://github.com/Donavfulish/HW06/actions

---

## 1. Pipeline mô tả

```
push / workflow_dispatch
  → checkout HW06
  → setup Node 20 + npm ci (Newman)
  → clone SUT https://github.com/Donavfulish/eshop-sut-hw02
  → reset-db + start backend (port 3000)
  → health check GET /api/products
  → Newman API1 / API2 / API3 (continue-on-error for known bug TCs)
  → upload HTML reports artifact
```

**Trigger:** `push`, `pull_request`, `workflow_dispatch` trên `main`.

---

## 2. Local vs CI

| Item | Local | CI |
|------|-------|-----|
| SUT | `HW2/testing-seminar-eshop-sut/backend` | Clone `Donavfulish/eshop-sut-hw02` vào `/tmp/eshop-sut` |
| Newman | `npm run test:api*` | Same scripts in Actions |
| Reports | `results/api*/newman-report.html` | Artifact `newman-reports` |

---

## 3. Sample runs (điền sau khi chụp)

### 3.1 All-pass / pipeline xanh (setup + health OK)

- Screenshot: `evidence/ci-pass-screenshot.png`
- Link run: [TODO: dán URL Actions run xanh]

> Job xanh khi checkout/install/SUT/health thành công. Các step Newman dùng `continue-on-error: true` vì một số TC cố ý phát hiện bug (expect 403/400, SUT trả 200).

### 3.2 Fail demo (1 assertion cố ý sai)

- Screenshot: `evidence/ci-fail-screenshot.png`
- Link run: [TODO: dán URL Actions run đỏ]
- Cách tạo: đổi Login expect `200` → `201`, commit message `test: demo failing pipeline run`, push, chụp Actions đỏ, rồi revert.

---

## 4. Health check

`curl -sf http://localhost:3000/api/products` — phải 200 trước khi chạy Newman.

---

## 5. Notes

- Hostname trong Newman report: `localhost:3000` (anti-cheat OK).
- Failures trên bug TC là evidence cho GitHub Issues #1–#3.
