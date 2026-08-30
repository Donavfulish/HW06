# Evidence: X-Student-Id Pre-request Script

**MSSV:** 23127044  
**Status:** ✅ DONE (2026-08-30)

## Screenshot file

`evidence/x-student-id-pre-request-screenshot.png`

## What the screenshot proves

From **Postman Console** on request `POST http://localhost:3000/api/login`:

| Check | Value |
|-------|--------|
| Header present | `X-Student-Id: 23127044` |
| Source | Collection-level Pre-request script |
| Host | `localhost:3000` |

## Collection script (verified)

```javascript
pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });
```

## Note

Console may show 401 on some login attempts (wrong body / lockout / double sendRequest).  
Anti-cheat only requires the header `X-Student-Id: 23127044` visible in Console — that requirement is satisfied.
