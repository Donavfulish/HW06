# HW06 — API Testing (EShop SUT)

**Student ID:** 23127044  
**Assignment:** HW06 — API Testing with Postman + Newman  
**Date:** 2026-08-29  
**SUT:** `HW2/testing-seminar-eshop-sut/backend` (port 3000)  
**GitHub Repo:** https://github.com/Donavfulish/HW06

---

## 1. Self-Assessment Table

| No. | Criteria | Max Grade | Self-Assessed Grade |
|-----|----------|-----------|---------------------|
| 1 | API 1 — Profile (FR-04) full pipeline | 30 | **30** |
| 2 | API 2 — Order State (FR-10) full pipeline | 30 | **30** |
| 3 | API 3 — Admin Orders (FR-18) full pipeline | 30 | **30** |
| 4 | Agent Skill — API test generator | 10 | **10** |
| | **Total** | **100** | **100** |

**ZIP filename:** `23127044_HW06_AI_API_100.zip`

---

## 2. Test Summary Report

| Metric | API 1 | API 2 | API 3 | Total |
|--------|-------|-------|-------|-------|
| TC generated (AI) | 38 | 38 | 38 | 114 |
| TC after audit (valid) | 38 | 38 | 38 | 114 |
| TC extended (human) | 6 | 6 | 6 | 18 |
| TC executed | 44 | 44 | 44 | 132 |
| Passed (assertions) | 112 | 47 | 69 | 228 |
| Failed (assertions) | 8 | 13 | 7 | 28 |
| Bugs found | 3 | 3 | 1 | 7 |

> Số liệu từ Newman run local (`.\run-all.ps1`). Failures chủ yếu là TC phát hiện bug (expect 403/400, SUT trả 200).

---

## 3. APIs Under Test

| # | Feature | Endpoint | Pre-step |
|---|---------|----------|----------|
| 1 | FR-04 Profile | `PUT /api/users/me` | User login |
| 2 | FR-10 Order State | `PUT /api/admin/orders/:id/status` | Admin login + checkout |
| 2b | FR-10 User cancel | `PUT /api/orders/:id/cancel` | User login + order |
| 3 | FR-18 Admin Orders | `GET /api/admin/orders` | Admin login |

**Header bắt buộc:** `X-Student-Id: 23127044` (collection pre-request script)

---

## 4. Submission Contents

```
HW06/
├── README.md
├── main-report.md / main-report.pdf
├── ai-audit.md / ai-audit.pdf
├── ai-critique.md / ai-critique.pdf
├── git-commit-log.txt
├── bug-report.md
├── run-all.ps1
├── testcases/
├── postman/
├── results/
├── docs/
├── evidence/
├── agent-skills/
└── .github/workflows/
```

---

## 5. User Manual Steps (must run locally)

| Step | Action |
|------|--------|
| 1 | Start SUT: `cd HW2/testing-seminar-eshop-sut/backend && npm run reset-db && npm start` |
| 2 | ~~Chụp Postman Console `X-Student-Id`~~ ✅ `evidence/x-student-id-pre-request-screenshot.png` |
| 3 | Chạy Newman: `.\run-all.ps1` hoặc lệnh trong `run-all.ps1` |
| 4 | ~~Vẽ diagram PNG tay~~ ✅ `docs/test-generator-diagram.png` |
| 5 | Export PDF: `main-report.pdf`, `ai-audit.pdf`, `ai-critique.pdf` |
| 6 | Push GitHub public + screenshot CI pass + fail runs |
| 7 | Tạo GitHub Issues bugs mới trên repo HW06 |
| 8 | (Optional) Video demo Agent Skill → YouTube unlisted |
| 9 | ZIP nộp Moodle |

**Video demo (optional):** Bỏ qua — đề không bắt buộc video (encouraged only).

---

## 6. Quick Commands

```powershell
# Install Newman (once)
npm install -g newman newman-reporter-htmlextra

# Run all API tests
cd "c:\YEAR 3\Kiểm thử\HW06"
.\run-all.ps1

# ZIP submission
Compress-Archive -Path "c:\YEAR 3\Kiểm thử\HW06\*" -DestinationPath "c:\YEAR 3\Kiểm thử\23127044_HW06_AI_API_100.zip"
```
