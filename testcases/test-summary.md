# Test Case Summary — HW06

**MSSV:** 23127044  
**Date:** 2026-08-29

| Metric | API 1 Profile | API 2 Order State | API 3 Admin Orders | Total |
|--------|---------------|-------------------|--------------------|-------|
| TC generated (AI) | 38 | 38 | 38 | 114 |
| TC after audit (valid) | 38 | 38 | 38 | 114 |
| TC extended (human) | 6 | 6 | 6 | 18 |
| TC executed (Newman) | 44 | 44 | 44 | 132 |
| Passed (assertions) | 112 | 47 | 69 | 228 |
| Failed (assertions) | 8 | 13 | 7 | 28 |
| Bugs found | 3 | 3 | 1 | 7 |

## Audit label distribution (per API)

| Label | API 1 | API 2 | API 3 |
|-------|-------|-------|-------|
| VALID | 32 | 36 | 34 |
| INVALID (corrected) | 6 | 2 | 4 |
| EXTEND | 6 | 6 | 6 |

## Coverage by type

| Type | API 1 | API 2 | API 3 |
|------|-------|-------|-------|
| domain | 22 | 12 | 14 |
| security | 12 | 8 | 14 |
| schema | 4 | 2 | 10 |
| state | — | 22 | — |

## Files

| API | Generated | Audit | Extended | Newman CSV |
|-----|-----------|-------|----------|------------|
| API 1 | `api1-profile-generated.csv` | `api1-profile-audit.csv` | `api1-profile-extended.csv` | `profile-test-data.csv` |
| API 2 | `api2-order-state-generated.csv` | `api2-order-state-audit.csv` | `api2-order-state-extended.csv` | `order-state-test-data.csv` |
| API 3 | `api3-admin-orders-generated.csv` | `api3-admin-orders-audit.csv` | `api3-admin-orders-extended.csv` | `admin-orders-test-data.csv` |
