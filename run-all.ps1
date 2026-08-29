# HW06 — Run All Newman API Tests
# Usage: .\run-all.ps1 [-SkipReset]

param([switch]$SkipReset)

$ErrorActionPreference = "Stop"
$HW06Root = $PSScriptRoot
$MSSV = "23127044"
$SutBackend = Join-Path (Split-Path $HW06Root -Parent) "HW2\testing-seminar-eshop-sut\backend"
$Newman = Join-Path $HW06Root "node_modules\.bin\newman.cmd"

function Stop-Backend {
    Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_.OwningProcess -gt 0) {
            Write-Host "  Stopping backend PID $($_.OwningProcess) ..."
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 2
}

function Start-Backend {
    Stop-Backend
    Write-Host "  Starting backend on port 3000 ..."
    $global:BackendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" `
        -WorkingDirectory $SutBackend -PassThru -WindowStyle Hidden
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -UseBasicParsing -TimeoutSec 2
            if ($r.StatusCode -eq 200) { Write-Host "  Backend ready." -ForegroundColor Green; return }
        } catch {}
    }
    throw "Backend failed to start on port 3000"
}

function Reset-Sut {
    Write-Host "`n=== Reset SUT DB ===" -ForegroundColor Cyan
    Stop-Backend
    Push-Location $SutBackend
    npm run reset-db 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "reset-db failed" }
    Pop-Location
    Start-Backend
}

function Run-Newman {
    param([string]$Name, [string]$Collection, [string]$DataFile, [string]$ReportDir)
    Write-Host "`n=== Newman: $Name ===" -ForegroundColor Green
    New-Item -ItemType Directory -Force -Path (Join-Path $HW06Root $ReportDir) | Out-Null
    $reportPath = Join-Path $HW06Root "$ReportDir\newman-report.html"
    & $Newman run (Join-Path $HW06Root $Collection) `
        -e (Join-Path $HW06Root "postman\environments\eshop-local.postman_environment.json") `
        -d (Join-Path $HW06Root $DataFile) `
        -r cli,htmlextra `
        --reporter-htmlextra-export $reportPath
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "$Name finished with failures (expected for bug-detection TCs)"
    }
    Write-Host "  Report: $reportPath"
}

# --- Main ---
Write-Host "HW06 API Test Runner - MSSV $MSSV" -ForegroundColor White

if (-not (Test-Path $Newman)) {
    Write-Host "Installing Newman locally..."
    Set-Location $HW06Root
    npm install 2>&1 | Out-Host
}

if (-not $SkipReset) { Reset-Sut } else {
    if (-not (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) {
        Start-Backend
    }
}

Run-Newman -Name "API1 Profile" `
    -Collection "postman\collections\${MSSV}_API1_Profile.postman_collection.json" `
    -DataFile "postman\data\profile-test-data.csv" `
    -ReportDir "results\api1"

if (-not $SkipReset) { Reset-Sut }
Run-Newman -Name "API2 Order State" `
    -Collection "postman\collections\${MSSV}_API2_OrderState.postman_collection.json" `
    -DataFile "postman\data\order-state-test-data.csv" `
    -ReportDir "results\api2"

if (-not $SkipReset) { Reset-Sut }
Run-Newman -Name "API3 Admin Orders" `
    -Collection "postman\collections\${MSSV}_API3_AdminOrders.postman_collection.json" `
    -DataFile "postman\data\admin-orders-test-data.csv" `
    -ReportDir "results\api3"

Write-Host "`n=== ALL NEWMAN RUNS COMPLETE ===" -ForegroundColor Green
Write-Host "Reports in results/api1, api2, api3"
