# Postman Features Used — HW06

**MSSV:** 23127044  
**Workspace:** `23127044-HW06`

| Feature | Ứng dụng HW06 |
|---------|---------------|
| Workspace | 1 workspace chứa 3 collections theo API |
| Collections | `23127044_API1_Profile`, `API2_OrderState`, `API3_AdminOrders` |
| Environment variables | `baseUrl`, `userToken`, `adminToken`, `orderId`, credentials |
| Collection variables | Token cache, orderId per iteration |
| Pre-request scripts | `X-Student-Id: 23127044`; conditional login |
| Test scripts | Status code, JSON schema, body assertions |
| Collection Runner + CSV | Data-driven ≥40 rows/API via Newman `-d` |
| Folder structure | Setup (login/checkout) + Tests (data-driven) |
| Newman CLI | Automated run + htmlextra HTML reports |
| GitHub Actions | CI pipeline chạy 3 collections |

## Optional (not required)

| Feature | Note |
|---------|------|
| Monitors | Có thể schedule daily smoke — chưa dùng |
| Mock server | Không dùng — test trực tiếp SUT localhost |
