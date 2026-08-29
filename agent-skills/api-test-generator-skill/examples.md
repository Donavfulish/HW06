# API Test Generator — Example FR-04 Profile

**Endpoint:** `PUT /api/users/me`  
**MSSV:** 23127044

---

## Session 1 prompt

```
Đọc api_specification.md §2.2 và fr04-profile/domain-testing.md.
Liệt kê 5 input variables (name, phone, shipping_address, role, JWT)
và partitions valid/invalid cho mỗi biến.
Output: bảng partition + ≥15 domain TC.
```

**Sample output (excerpt):**

| Variable | Partition | Representative value |
|----------|-----------|---------------------|
| name | valid | "Nguyen Van A" |
| name | invalid empty | "" |
| phone | valid 9 digit | "912345678" |
| phone | invalid starts 0 | "0912345678" |
| role | attack admin | {"role":"admin"} |

---

## Session 2 prompt (BVA)

```
BVA cho phone regex ^[1-9][0-9]{8,9}$ — ON/OFF/IN/OUT
cho cả chiều length và first character.
Expected theo NGHIỆP VỤ VN (0xxx hợp lệ), không chỉ regex.
```

**AI gap:** AI thường ghi Expected=REJECT cho `0912345678` — audit sửa thành 200 cho API layer.

---

## Session 3 prompt (SEC-06)

```
TC security SEC-06: gửi role=admin trong body với user JWT.
Expected: 403 Forbidden.
```

**Newman result:** FAIL với 200 → BUG-A2 evidence.

---

## Extend example

```csv
API1-E-01,security,EXTEND BUG-A2 role=admin,PUT,/api/users/me,Bearer valid,"{""role"":""admin""}",403,error,EXTEND,AI knows SEC-06 abstractly but misses server.js role update
```

---

## Postman test script snippet

```javascript
pm.test('status ' + pm.iterationData.get('expected_status'), () => {
  pm.response.to.have.status(parseInt(pm.iterationData.get('expected_status')));
});
```

---

## Newman command

```powershell
cd HW06
npm run test:api1
```

Output: `results/api1/newman-report.html`
