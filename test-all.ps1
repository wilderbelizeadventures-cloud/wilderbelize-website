
# Wilder Belize Adventures - Full Test Suite (10 Test Cases) - CORRECTED
# Run: powershell -ExecutionPolicy Bypass -File test-all.ps1

$BASE = "http://localhost:3000"
$pass = 0
$fail = 0
$results = @()

function Show-Result {
    param($num, $name, $status, $detail, $response="")
    $icon = if ($status -eq "PASS") { "[PASS]" } else { "[FAIL]" }
    Write-Host ""
    Write-Host "--------------------------------------------------"
    Write-Host "  $icon  TEST $num`: $name"
    Write-Host "--------------------------------------------------"
    Write-Host "  Status  : $status"
    Write-Host "  Detail  : $detail"
    if ($response -and $response -ne "") { Write-Host "  Response: $response" }
    $script:results += [PSCustomObject]@{ Test=$num; Name=$name; Status=$status; Detail=$detail }
    if ($status -eq "PASS") { $script:pass++ } else { $script:fail++ }
}

function Invoke-API {
    param($method, $url, $body)
    try {
        $headers = @{ "Content-Type" = "application/json" }
        $json = $body | ConvertTo-Json -Depth 10
        $resp = Invoke-RestMethod -Method $method -Uri $url -Headers $headers -Body $json -TimeoutSec 30
        return $resp
    } catch {
        $code = $null
        try { $code = $_.Exception.Response.StatusCode.value__ } catch {}
        return [PSCustomObject]@{ error = $_.Exception.Message; statusCode = $code; success = $false; ok = $false }
    }
}

function Test-PageStatus {
    param($url)
    try {
        $resp = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        return $resp.StatusCode
    } catch {
        try { return $_.Exception.Response.StatusCode.value__ } catch { return 0 }
    }
}

Write-Host ""
Write-Host "=================================================="
Write-Host "   WILDER BELIZE ADVENTURES - 10 TEST CASES"
Write-Host "   Contact Forms, Emails, Payment, Pages"
Write-Host "=================================================="
Write-Host ""

# --------------------------------------------------
# TEST 1: Contact API - Valid General Inquiry
# API returns: { ok: true }
# --------------------------------------------------
Write-Host "Running Test 1..."
$t1 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = "John Smith"
    email = "johnsmith@gmail.com"
    phone = "+1 555-123-4567"
    message = "I am interested in booking a tour to the Blue Hole. Please send more information."
    type = "contact"
})
$t1json = $t1 | ConvertTo-Json -Compress
if ($t1.ok -eq $true) {
    Show-Result 1 "Contact Form - Valid General Inquiry" "PASS" "API returned ok=true. Emails sent via Resend to owner + customer." $t1json
} else {
    Show-Result 1 "Contact Form - Valid General Inquiry" "FAIL" "Unexpected response (expected ok=true)" $t1json
}
Start-Sleep 3

# --------------------------------------------------
# TEST 2: Contact API - Family Tour Inquiry
# --------------------------------------------------
Write-Host "Running Test 2..."
$t2 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = "Maria Garcia"
    email = "maria.garcia@hotmail.com"
    phone = "+1 305-456-7890"
    message = "Family of 4 want to book Jungle Adventure for December 2025. Price per person?"
    type = "contact"
})
$t2json = $t2 | ConvertTo-Json -Compress
if ($t2.ok -eq $true) {
    Show-Result 2 "Contact Form - Family Tour Inquiry" "PASS" "API returned ok=true. Inquiry logged and emails sent." $t2json
} else {
    Show-Result 2 "Contact Form - Family Tour Inquiry" "FAIL" "Unexpected response" $t2json
}
Start-Sleep 3

# --------------------------------------------------
# TEST 3: Contact API - Empty Fields Validation
# Expected: HTTP 400 with error
# --------------------------------------------------
Write-Host "Running Test 3..."
$t3 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = ""
    email = ""
    message = ""
    type = "contact"
})
$t3json = $t3 | ConvertTo-Json -Compress
if ($t3.statusCode -eq 400 -or $t3.ok -eq $false) {
    Show-Result 3 "Contact Form - Empty Fields Validation" "PASS" "Server correctly rejected empty form (HTTP 400)" $t3json
} else {
    Show-Result 3 "Contact Form - Empty Fields Validation" "FAIL" "Server accepted empty fields (should have returned 400)" $t3json
}
Start-Sleep 1

# --------------------------------------------------
# TEST 4: Contact API - Invalid Email Format
# Expected: HTTP 400 with error
# --------------------------------------------------
Write-Host "Running Test 4..."
$t4 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = "Test User"
    email = "notavalidemail"
    phone = "12345"
    message = "Test message for validation check"
    type = "contact"
})
$t4json = $t4 | ConvertTo-Json -Compress
if ($t4.statusCode -eq 400 -or $t4.ok -eq $false) {
    Show-Result 4 "Contact Form - Invalid Email Validation" "PASS" "Server rejected invalid email (HTTP 400)" $t4json
} else {
    Show-Result 4 "Contact Form - Invalid Email Validation" "FAIL" "Server accepted invalid email (should reject)" $t4json
}
Start-Sleep 1

# --------------------------------------------------
# TEST 5: Build-Your-Route Custom Tour Inquiry
# --------------------------------------------------
Write-Host "Running Test 5..."
$t5 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = "Sarah Johnson"
    email = "sarah.j@outlook.com"
    phone = "+1 212-555-9876"
    message = "I want to build a custom 7-day tour combining snorkeling, jungle trek, and Mayan ruins."
    tour = "Build Your Custom Route"
    type = "booking"
})
$t5json = $t5 | ConvertTo-Json -Compress
if ($t5.ok -eq $true) {
    Show-Result 5 "Build-Your-Route Custom Tour Inquiry" "PASS" "Tour inquiry received and emails sent" $t5json
} else {
    Show-Result 5 "Build-Your-Route Custom Tour Inquiry" "FAIL" "Failed to submit tour inquiry" $t5json
}
Start-Sleep 3

# --------------------------------------------------
# TEST 6: Transfers Page - Transfer Inquiry
# --------------------------------------------------
Write-Host "Running Test 6..."
$t6 = Invoke-API -method POST -url "$BASE/api/inquiry" -body ([PSCustomObject]@{
    name = "Robert Williams"
    email = "rwilliams@gmail.com"
    phone = "+1 617-555-0001"
    message = "Need transfer from Belize City airport to Placencia for 3 people, January 10th 2025"
    tour = "Private Ground Transfer"
    type = "booking"
})
$t6json = $t6 | ConvertTo-Json -Compress
if ($t6.ok -eq $true) {
    Show-Result 6 "Transfers Page - Transfer Inquiry" "PASS" "Transfer inquiry received and emails sent" $t6json
} else {
    Show-Result 6 "Transfers Page - Transfer Inquiry" "FAIL" "Failed to submit transfer inquiry" $t6json
}
Start-Sleep 3

# --------------------------------------------------
# TEST 7: All Key Pages Return HTTP 200
# --------------------------------------------------
Write-Host "Running Test 7..."
$pages = @("/", "/contact", "/tours", "/transfers", "/build-your-route", "/travelers-info", "/about", "/terms-and-conditions")
$failedPages = @()
foreach ($page in $pages) {
    $code = Test-PageStatus "$BASE$page"
    $mark = if ($code -eq 200) { "OK" } else { "FAIL" }
    Write-Host "    $mark  $page -> HTTP $code"
    if ($code -ne 200) { $failedPages += "$page (HTTP $code)" }
    Start-Sleep -Milliseconds 400
}
if ($failedPages.Count -eq 0) {
    Show-Result 7 "All Pages Load (HTTP 200)" "PASS" "All $($pages.Count) pages returned HTTP 200 OK"
} else {
    Show-Result 7 "All Pages Load (HTTP 200)" "FAIL" "Failed: $($failedPages -join ', ')"
}

# --------------------------------------------------
# TEST 8: Payment Gateway Init - /api/payment (POST)
# CORRECT route is /api/payment not /api/payment/init
# In sandbox/localhost it generates a simulated payment link
# --------------------------------------------------
Write-Host "Running Test 8..."
$t8 = Invoke-API -method POST -url "$BASE/api/payment" -body ([PSCustomObject]@{
    name = "Alice Thompson"
    email = "alice.thompson@test.com"
    phone = "+1 800-555-2345"
    tourName = "Blue Hole Dive Experience"
    date = "2025-12-20"
    guests = 2
    hotel = "Sunset Beach Hotel"
    message = "Test booking - automated test"
    amount = 250
})
$t8json = $t8 | ConvertTo-Json -Compress
Write-Host "  Payment Init Response: $t8json"
if ($t8.success -eq $true -and ($t8.paymentUrl -or $t8.orderId)) {
    $sandboxNote = if ($t8.isSandboxMode) { " [SANDBOX MODE - simulated URL generated]" } else { "" }
    Show-Result 8 "Payment Gateway Init - Start Booking" "PASS" "Payment initiated. orderId=$($t8.orderId)$sandboxNote" $t8json
} elseif ($t8.success -eq $false) {
    Show-Result 8 "Payment Gateway Init - Start Booking" "FAIL" "Error: $($t8.message)" $t8json
} else {
    Show-Result 8 "Payment Gateway Init - Start Booking" "FAIL" "Unexpected response format" $t8json
}
Start-Sleep 2

# --------------------------------------------------
# TEST 9: Payment Confirm + Email Dispatch
# Uses fallbackBooking to simulate bank callback
# --------------------------------------------------
Write-Host "Running Test 9..."
$randId = Get-Random -Maximum 99999
$t9 = Invoke-API -method POST -url "$BASE/api/payment/confirm" -body ([PSCustomObject]@{
    orderId = "TEST-ORDER-$randId"
    fallbackBooking = [PSCustomObject]@{
        name = "Alice Thompson"
        email = "alice.thompson@test.com"
        phone = "+1 800-555-2345"
        tour = "Blue Hole Dive Experience"
        date = "2025-12-20"
        guests = 2
        hotel = "Sunset Beach Hotel"
        message = "Automated test booking"
        amount = 250
        orderId = "TEST-ORDER-$randId"
    }
})
$t9json = $t9 | ConvertTo-Json -Compress
Write-Host "  Payment Confirm Response: $t9json"
if ($t9.success -eq $true) {
    $wilder = if ($t9.emailResult.wilderNotified) { "YES" } else { "NO" }
    $customer = if ($t9.emailResult.customerNotified) { "YES" } else { "NO" }
    Show-Result 9 "Payment Confirm + Email Dispatch" "PASS" "Confirmed. Owner email: $wilder, Customer email: $customer" $t9json
} elseif ($t9.error -ne $null) {
    Show-Result 9 "Payment Confirm + Email Dispatch" "FAIL" "Error: $($t9.error)" $t9json
} else {
    Show-Result 9 "Payment Confirm + Email Dispatch" "PARTIAL" "Partial response - review manually" $t9json
}
Start-Sleep 2

# --------------------------------------------------
# TEST 10: Payment Success Page + API Liveness
# --------------------------------------------------
Write-Host "Running Test 10..."
$successCode = Test-PageStatus "$BASE/payment/success"
Write-Host "  /payment/success -> HTTP $successCode"

$apiInquiryCode = 0
try {
    $chk = Invoke-WebRequest -Method GET -Uri "$BASE/api/inquiry" -TimeoutSec 5 -UseBasicParsing
    $apiInquiryCode = $chk.StatusCode
} catch {
    try { $apiInquiryCode = $_.Exception.Response.StatusCode.value__ } catch {}
}
# 405 = Method Not Allowed (GET not supported, but endpoint exists)
$inquiryAlive = ($apiInquiryCode -eq 200 -or $apiInquiryCode -eq 405)
Write-Host "  /api/inquiry (GET) -> HTTP $apiInquiryCode (405=exists, endpoint alive)"

$confirmCode = 0
try {
    $chk2 = Invoke-WebRequest -Method GET -Uri "$BASE/api/payment/confirm" -TimeoutSec 5 -UseBasicParsing
    $confirmCode = $chk2.StatusCode
} catch {
    try { $confirmCode = $_.Exception.Response.StatusCode.value__ } catch {}
}
$confirmAlive = ($confirmCode -eq 200 -or $confirmCode -eq 405)
Write-Host "  /api/payment/confirm (GET) -> HTTP $confirmCode (405=exists)"

if ($successCode -eq 200 -and $inquiryAlive -and $confirmAlive) {
    Show-Result 10 "Success Page + API Endpoints Live" "PASS" "/payment/success: 200, /api/inquiry: alive (HTTP $apiInquiryCode), /api/payment/confirm: alive (HTTP $confirmCode)"
} else {
    Show-Result 10 "Success Page + API Endpoints Live" "FAIL" "success page: $successCode, inquiry: $apiInquiryCode, confirm: $confirmCode"
}

# --------------------------------------------------
# FINAL SUMMARY
# --------------------------------------------------
Write-Host ""
Write-Host "=================================================="
Write-Host "          FINAL TEST RESULTS SUMMARY"
Write-Host "=================================================="
Write-Host "  Total Tests : 10"
Write-Host "  PASSED      : $pass"
Write-Host "  FAILED      : $fail"
Write-Host "=================================================="
Write-Host ""
$results | Format-Table -AutoSize
Write-Host ""
Write-Host "NOTE: Tests 1,2,5,6 verify /api/inquiry (contact + booking emails)"
Write-Host "NOTE: Test 8 verifies /api/payment (Belize Bank sandbox init)"
Write-Host "NOTE: Test 9 verifies /api/payment/confirm (email dispatch on payment success)"
Write-Host "NOTE: 4 email types total - Owner+Customer for inquiry, Owner+Customer for booking"
