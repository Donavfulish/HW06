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
- Link run: https://github.com/Donavfulish/HW06/actions/runs/33305798649
- Commit: `133b666` — `ci: fix Actions workflow to clone eshop-sut-hw02 and start backend`
- Status: **Success** (job `newman` ~36s, artifact `newman-reports` uploaded)

> Job xanh khi checkout/install/SUT/health thành công. Các step Newman dùng `continue-on-error: true` vì một số TC cố ý phát hiện bug (expect 403/400, SUT trả 200) — annotations có exit code 1 trên API steps nhưng job vẫn Success.

### 3.2 Fail demo (1 assertion / step cố ý fail)

- Screenshot: `evidence/ci-fail-screenshot.png`
- Link run: [TODO: dán URL Actions run đỏ sau bước fail demo]
- Cách tạo: commit message chứa `demo failing` → step **Demo failing assertion** thoát code 1 → job đỏ. Sau đó commit khác (không có chữ đó) để pipeline xanh lại.

**Cách tạo fail demo:**
1. Push commit với message `test: demo failing pipeline run` (kèm sửa nhỏ workflow hoặc file bất kỳ nếu cần).
2. Chụp Actions tab màu đỏ + copy URL.
3. Push commit tiếp theo không chứa `demo failing` để repo trở lại xanh.
---

## 4. Health check

`curl -sf http://localhost:3000/api/products` — phải 200 trước khi chạy Newman.

---

## 5. Notes

- Hostname trong Newman report: `localhost:3000` (anti-cheat OK).
- Failures trên bug TC là evidence cho GitHub Issues #1–#3.
