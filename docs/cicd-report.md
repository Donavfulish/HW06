# CI/CD Report — HW06 Newman Pipeline

**MSSV:** 23127044  
**Workflow:** `.github/workflows/api-tests.yml`

---

## 1. Pipeline mô tả

```
push/PR → checkout → setup Node 20 → npm ci (Newman)
       → install SUT backend → reset-db → start server (background)
       → health check GET /api/products
       → Newman API1 → reset-db → Newman API2 → reset-db → Newman API3
       → upload HTML reports artifact
```

**Trigger:** `push`, `pull_request` trên branch `main`/`master`.

**Tools:** Newman 6.x, newman-reporter-htmlextra.

---

## 2. Local vs CI

| Item | Local | CI |
|------|-------|-----|
| SUT path | `HW2/testing-seminar-eshop-sut/backend` | Clone hoặc sibling path |
| Newman | `node_modules/.bin/newman` | `npm run test:api*` |
| Reports | `results/api*/newman-report.html` | Artifact upload |

---

## 3. Screenshots (TODO — user)

### 3.1 All-pass run

[TODO: Screenshot GitHub Actions green run — commit `test: all API tests passing`]

Link run: [TODO: GitHub Actions URL]

### 3.2 Fail demo run

[TODO: Screenshot GitHub Actions red run — commit `test: demo failing pipeline run`]

**Cách tạo fail demo:**
1. Sửa 1 test script expect status 201 thay vì 200 (vd. API1 login test).
2. Commit + push.
3. Chụp Actions tab màu đỏ.
4. Revert commit.

---

## 4. Health check

Workflow dùng `curl -f http://localhost:3000/api/products` trước Newman để đảm bảo backend sẵn sàng.

---

## 5. Notes

- Một số TC **cố ý expect bug behavior** (403, 400) sẽ fail trên SUT hiện tại — workflow dùng `continue-on-error: true` để pipeline không block hoàn toàn.
- Hostname trong Newman report phải khớp `localhost:3000` (anti-cheat).
