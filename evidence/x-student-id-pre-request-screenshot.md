# Evidence: X-Student-Id Pre-request Script

**MSSV:** 23127044  
**Requirement:** Header `X-Student-Id: 23127044` trên mọi request (anti-cheat)

## Cách chụp screenshot

1. Mở Postman → import collection `23127044_API1_Profile` (hoặc bất kỳ collection HW06).
2. Click collection → tab **Scripts** → **Pre-request**.
3. Xác nhận script:
   ```javascript
   pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });
   ```
4. Mở **Postman Console** (View → Show Postman Console hoặc `Alt+Ctrl+C`).
5. Gửi bất kỳ request trong collection (vd. Login User).
6. Trong Console, mở request details → tab **Headers** → tìm `X-Student-Id: 23127044`.
7. Chụp màn hình Console hiển thị header → lưu:
   ```
   evidence/x-student-id-pre-request-screenshot.png
   ```

## Newman verification

Khi chạy Newman, hostname trong report phải là `localhost:3000` (khớp deployment local).

```powershell
newman run postman/collections/23127044_API1_Profile.postman_collection.json `
  -e postman/environments/eshop-local.postman_environment.json
```
