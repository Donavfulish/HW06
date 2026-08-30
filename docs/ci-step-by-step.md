# Hướng dẫn CI — làm theo từng bước

## Vì sao trước đây toàn đỏ?

Workflow cũ tìm SUT ở `../HW2/...` (không có trên GitHub) và clone nhầm repo.
Đã sửa: clone `https://github.com/Donavfulish/eshop-sut-hw02` (có `npm run reset-db`) rồi chạy Newman.

## Bước A — Push workflow đã sửa

Mở PowerShell, chạy:

Set-Location -LiteralPath "c:\YEAR 3\Kiểm thử\HW06"
git add .github/workflows/api-tests.yml docs/cicd-report.md
$msg = "ci: fix Actions workflow to clone eshop-sut and start backend"
$msg | Out-File .git\COMMIT_EDITMSG_TEMP.txt -Encoding utf8
git commit -F .git\COMMIT_EDITMSG_TEMP.txt
Remove-Item .git\COMMIT_EDITMSG_TEMP.txt -Force
git push

## Bước B — Xem run mới (pass / xanh)

1. Vào https://github.com/Donavfulish/HW06/actions
2. Đợi run mới của commit "ci: fix Actions workflow..." (khoảng 1–3 phút, không còn ~20s).
3. Click vào run đó.
4. Thấy job newman — các step Clone SUT, Start backend, Health check phải tick xanh.
5. Newman steps có thể có dấu cảnh báo (continue-on-error) vì TC bug — job vẫn có thể xanh.
6. Chụp toàn màn hình trang run (thấy dấu tick / chữ Success) → lưu:
   evidence/ci-pass-screenshot.png
7. Copy URL thanh địa chỉ (dạng .../actions/runs/123456789) → ghi vào docs/cicd-report.md mục 3.1

Nếu vẫn đỏ: click step đỏ → đọc log → gửi mình screenshot log.

## Bước C — Tạo run fail demo (đỏ cố ý)

1. Mở file:
   postman/collections/23127044_API1_Profile.postman_collection.json
2. Tìm trong Login User test script dòng:
   pm.response.to.have.status(200)
3. Đổi thành:
   pm.response.to.have.status(201)
4. Commit + push:

Set-Location -LiteralPath "c:\YEAR 3\Kiểm thử\HW06"
git add postman/collections/23127044_API1_Profile.postman_collection.json
$msg = "test: demo failing pipeline run"
$msg | Out-File .git\COMMIT_EDITMSG_TEMP.txt -Encoding utf8
git commit -F .git\COMMIT_EDITMSG_TEMP.txt
Remove-Item .git\COMMIT_EDITMSG_TEMP.txt -Force
git push

5. Vào Actions → run mới → phải đỏ (hoặc step Login/API1 fail rõ).
6. Chụp → evidence/ci-fail-screenshot.png
7. Copy URL run → ghi cicd-report.md mục 3.2

## Bước D — Revert về đúng (sau khi đã chụp fail)

Đổi lại status(201) → status(200), rồi:

git add postman/collections/23127044_API1_Profile.postman_collection.json
$msg = "fix: restore login expect 200 after CI fail demo"
$msg | Out-File .git\COMMIT_EDITMSG_TEMP.txt -Encoding utf8
git commit -F .git\COMMIT_EDITMSG_TEMP.txt
Remove-Item .git\COMMIT_EDITMSG_TEMP.txt -Force
git push

## Bước E — Điền docs/cicd-report.md

Thay 2 dòng [TODO] bằng URL thật + xác nhận đã có 2 file PNG trong evidence/.
