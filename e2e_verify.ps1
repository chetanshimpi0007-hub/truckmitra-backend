
# ============================================================
# TruckMitra E2E Verification Script
# ============================================================
$BASE = "http://localhost:8080"
$RESULTS = @()

function Log($step, $status, $code, $body, $extra="") {
    $obj = [PSCustomObject]@{
        Step   = $step
        Status = $status
        Code   = $code
        Body   = ($body | Select-Object -First 800)
        Extra  = $extra
    }
    $script:RESULTS += $obj
    Write-Host ""
    Write-Host "========================================"
    Write-Host "STEP: $step"
    Write-Host "STATUS: $status  |  HTTP: $code"
    if ($extra) { Write-Host "NOTE: $extra" }
    Write-Host "RESPONSE: $($body | Select-Object -First 600)"
    return $obj
}

function Invoke-API($method, $url, $token, $body=$null, $contentType="application/json") {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    try {
        if ($body) {
            $r = Invoke-WebRequest -Uri $url -Method $method -Headers $headers -Body $body -ContentType $contentType -UseBasicParsing
        } else {
            $r = Invoke-WebRequest -Uri $url -Method $method -Headers $headers -UseBasicParsing
        }
        return @{ Code=$r.StatusCode; Body=$r.Content; OK=$true }
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd()
        } catch { $errBody = $_.Exception.Message }
        return @{ Code=$code; Body=$errBody; OK=$false }
    }
}

Write-Host ""
Write-Host "=================================================="
Write-Host "  TruckMitra Full E2E Verification"
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "=================================================="

# ============================================================
# STEP 1: Login as Admin (to query DB)
# ============================================================
Write-Host "`n[1/12] Admin Login..."
$r = Invoke-API "POST" "$BASE/api/auth/login" $null '{"email":"admin@truckmitra.com","password":"Admin@123","loginType":"ADMIN"}'
Log "Admin Login" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body
$adminData = $r.Body | ConvertFrom-Json
$ADMIN_TOKEN = $adminData.data.token
Write-Host "Admin Token: $($ADMIN_TOKEN.Substring(0,30))..."

# ============================================================
# STEP 2: Get all users via test endpoint to find driver
# ============================================================
Write-Host "`n[2/12] Fetching users to find DRIVER..."
$r = Invoke-API "GET" "$BASE/api/admin/users?role=DRIVER" $ADMIN_TOKEN
Log "Get Users" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body

# Parse driver from response
$DRIVER_EMAIL = $null
$DRIVER_ID = $null
$DRIVER_TOKEN = $null
if ($r.OK) {
    try {
        $usersResponse = $r.Body | ConvertFrom-Json
        $driver = $usersResponse.data.content | Where-Object { $_.role -eq "DRIVER" } | Select-Object -First 1
        if ($driver) {
            $DRIVER_EMAIL = $driver.email
            $DRIVER_ID = $driver.id
            Write-Host "Found driver: $DRIVER_EMAIL (ID: $DRIVER_ID)"
        }
    } catch {}
}

# If no driver found from query, try known test accounts
if (-not $DRIVER_TOKEN) {
    $knownDrivers = @(
        @{email="snehal@gmail.com"; pass="snehal@123"},
        @{email="driver@truckmitra.com"; pass="Driver@123"},
        @{email="rajan@test.com"; pass="password123"},
        @{email="testdriver@test.com"; pass="Test@1234"},
        @{email="driver@test.com"; pass="Test@1234"},
        @{email="d1@test.com"; pass="Test@1234"}
    )
    foreach ($d in $knownDrivers) {
        $loginBody = "{`"email`":`"$($d.email)`",`"password`":`"$($d.pass)`",`"loginType`":`"DRIVER`"}"
        $r2 = Invoke-API "POST" "$BASE/api/auth/login" $null $loginBody
        if ($r2.OK -and ($r2.Body -like "*DRIVER*")) {
            Write-Host "Found working driver login: $($d.email)"
            $driverLoginData = $r2.Body | ConvertFrom-Json
            $DRIVER_TOKEN = $driverLoginData.data.token
            $DRIVER_ID = $driverLoginData.data.id
            $DRIVER_EMAIL = $d.email
            Log "Driver Login (found)" "PASS" $r2.Code $r2.Body "Using: $($d.email)"
            break
        }
    }
}

# ============================================================
# STEP 3: Login as Driver via mobile-based search
# ============================================================
if (-not $DRIVER_TOKEN) {
    Write-Host "`n[3/12] Trying mobile-based driver login..."
    $mobileDrivers = @("8888888888","9090909090","9876543210","8000000001","8000000002")
    foreach ($mob in $mobileDrivers) {
        $loginBody = "{`"mobile`":`"$mob`",`"password`":`"Test@1234`",`"loginType`":`"DRIVER`"}"
        $r3 = Invoke-API "POST" "$BASE/api/auth/login" $null $loginBody
        if ($r3.OK) {
            $driverLoginData = $r3.Body | ConvertFrom-Json
            $DRIVER_TOKEN = $driverLoginData.data.token
            $DRIVER_ID = $driverLoginData.data.id
            Write-Host "Driver via mobile $mob (ID: $DRIVER_ID)"
            Log "Driver Login (mobile)" "PASS" $r3.Code $r3.Body "Mobile: $mob"
            break
        }
    }
}

# ============================================================
# STEP 4: Register a fresh test driver if none found
# ============================================================
if (-not $DRIVER_TOKEN) {
    Write-Host "`n[4/12] Registering new test driver..."
    $regBody = '{"fullName":"Test Driver E2E","mobile":"9800000099","email":"e2edriver@test.com","password":"Test@1234","role":"DRIVER","preferredLoginType":"EMAIL_PASSWORD"}'
    $r4 = Invoke-API "POST" "$BASE/api/auth/register" $null $regBody
    Log "Register Driver" $(if($r4.OK){"PASS"}else{"FAIL"}) $r4.Code $r4.Body

    if ($r4.OK) {
        # Login with new driver
        $r5 = Invoke-API "POST" "$BASE/api/auth/login" $null '{"email":"e2edriver@test.com","password":"Test@1234","loginType":"DRIVER"}'
        if ($r5.OK) {
            $driverLoginData = $r5.Body | ConvertFrom-Json
            $DRIVER_TOKEN = $driverLoginData.data.token
            $DRIVER_ID = $driverLoginData.data.id
            Log "Driver Login (new)" "PASS" $r5.Code $r5.Body "New driver ID: $DRIVER_ID"
        }
    } else {
        # Fallback in case registration fails (e.g. user already exists)
        Write-Host "Registration failed, attempting login directly..."
        $r5 = Invoke-API "POST" "$BASE/api/auth/login" $null '{"email":"e2edriver@test.com","password":"Test@1234","loginType":"DRIVER"}'
        if ($r5.OK) {
            $driverLoginData = $r5.Body | ConvertFrom-Json
            $DRIVER_TOKEN = $driverLoginData.data.token
            $DRIVER_ID = $driverLoginData.data.id
            Log "Driver Login (fallback)" "PASS" $r5.Code $r5.Body "Logged in as existing driver ID: $DRIVER_ID"
        }
    }
}

if (-not $DRIVER_TOKEN) {
    Write-Host "ERROR: Could not obtain driver token. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "`nDriver ID: $DRIVER_ID | Token obtained: YES"

# ============================================================
# STEP 5: Get driver's assigned trips
# ============================================================
Write-Host "`n[5/12] Getting driver trips..."
$r = Invoke-API "GET" "$BASE/api/trips/driver/$DRIVER_ID" $DRIVER_TOKEN
Log "Get Driver Trips" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body

$TRIP_ID = $null
if ($r.OK) {
    try {
        $trips = $r.Body | ConvertFrom-Json
        # Find ACCEPTED trip
        $acceptedTrip = $trips | Where-Object { $_.status -eq "ACCEPTED" } | Select-Object -First 1
        if ($acceptedTrip) {
            $TRIP_ID = $acceptedTrip.id
            Write-Host "Found ACCEPTED trip ID: $TRIP_ID (Status: $($acceptedTrip.status))"
            Log "Trip Found - ACCEPTED" "PASS" 200 ($acceptedTrip | ConvertTo-Json -Depth 2) "Trip: $TRIP_ID | Status: ACCEPTED"
        } else {
            # Look for any trip to work with
            $anyTrip = $trips | Select-Object -First 1
            if ($anyTrip) {
                $TRIP_ID = $anyTrip.id
                Write-Host "Using trip ID: $TRIP_ID (Status: $($anyTrip.status))"
                Log "Trip Found" "WARN" 200 ($anyTrip | ConvertTo-Json -Depth 2) "Trip: $TRIP_ID | Status: $($anyTrip.status)"
            }
        }
    } catch { Write-Host "Parse error: $_" }
}

if (-not $TRIP_ID) {
    Write-Host "No trip found for driver $DRIVER_ID. Checking all trips via admin..." -ForegroundColor Yellow
    # Try getting trips via admin
    $r = Invoke-API "GET" "$BASE/api/test/query/trips" $ADMIN_TOKEN
    if ($r.OK) {
        try {
            $trips = $r.Body | ConvertFrom-Json
            $t = $trips | Where-Object { $_.status -eq "ACCEPTED" } | Select-Object -First 1
            if ($t) { $TRIP_ID = $t.id }
        } catch {}
    }
}

if (-not $TRIP_ID) {
    Write-Host "WARNING: No trip ID found. Some tests will be skipped." -ForegroundColor Yellow
}

# ============================================================
# STEP 6: DB state BEFORE (fetch trip details)
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[6/12] DB State BEFORE - Trip $TRIP_ID..."
    $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $DRIVER_TOKEN
    if (-not $r.OK) { $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $ADMIN_TOKEN }
    Log "DB State BEFORE" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "Trip $TRIP_ID before any actions"
    if ($r.OK) {
        $tripBefore = $r.Body | ConvertFrom-Json
        Write-Host "Trip Status BEFORE: $($tripBefore.status)"
        Write-Host "pickupReceiptUrl BEFORE: $($tripBefore.pickupReceiptUrl)"
        Write-Host "locationEnabled BEFORE: $($tripBefore.locationEnabled)"
    }
}

# ============================================================
# STEP 7: Upload Pickup Receipt
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[7/12] Upload Pickup Receipt..."
    $receiptUrl = "https://res.cloudinary.com/test/image/upload/v1234567890/e2e_pickup_receipt_test.jpg"
    $r = Invoke-API "POST" "$BASE/api/trips/$TRIP_ID/upload-pickup-receipt?receiptUrl=$([Uri]::EscapeDataString($receiptUrl))" $DRIVER_TOKEN
    Log "Upload Pickup Receipt" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "POST /upload-pickup-receipt | receiptUrl: $receiptUrl"

    # Verify DB
    $r2 = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $DRIVER_TOKEN
    if (-not $r2.OK) { $r2 = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $ADMIN_TOKEN }
    if ($r2.OK) {
        $tripAfterReceipt = $r2.Body | ConvertFrom-Json
        Write-Host "pickupReceiptUrl AFTER upload: $($tripAfterReceipt.pickupReceiptUrl)"
        if ($tripAfterReceipt.pickupReceiptUrl) {
            Log "Receipt Persisted in DB" "PASS" 200 "pickupReceiptUrl = $($tripAfterReceipt.pickupReceiptUrl)" "receiptUrl persisted [OK]"
        } else {
            Log "Receipt Persisted in DB" "FAIL" 200 "pickupReceiptUrl = NULL" "receiptUrl NOT persisted [FAIL]"
        }
    }
}

# ============================================================
# STEP 8: Enable Live Location
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[8/12] Enable Live Location..."
    $r = Invoke-API "POST" "$BASE/api/trips/$TRIP_ID/location-enabled" $DRIVER_TOKEN
    Log "Enable Live Location" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "POST /location-enabled"

    if ($r.OK) {
        $tripAfterLoc = $r.Body | ConvertFrom-Json
        Write-Host "locationEnabled AFTER: $($tripAfterLoc.locationEnabled)"
        if ($tripAfterLoc.locationEnabled -eq $true) {
            Log "locationEnabled in DB" "PASS" 200 "locationEnabled = true" "locationEnabled persisted [OK]"
        } else {
            Log "locationEnabled in DB" "FAIL" 200 "locationEnabled = $($tripAfterLoc.locationEnabled)" "locationEnabled NOT set [FAIL]"
        }
    }
}

# ============================================================
# STEP 9: START TRIP (ACCEPTED → STARTED)
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[9/12] START TRIP..."
    $r = Invoke-API "POST" "$BASE/api/trips/$TRIP_ID/start" $DRIVER_TOKEN
    Log "START TRIP" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "POST /start | Expected: ACCEPTED -> STARTED"

    if ($r.OK) {
        $tripStarted = $r.Body | ConvertFrom-Json
        $newStatus = $tripStarted.status
        Write-Host "Trip status AFTER start: $newStatus"
        if ($newStatus -eq "STARTED") {
            Log "Status Transition ACCEPTED->STARTED" "PASS" 200 "status = STARTED [OK]" "Trip $TRIP_ID successfully started"
        } else {
            Log "Status Transition ACCEPTED→STARTED" "FAIL" 200 "status = $newStatus (expected STARTED)" "Status transition incorrect"
        }
    } else {
        Write-Host "START TRIP failed: $($r.Body)"
    }
}

# ============================================================
# STEP 10: DB State AFTER
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[10/12] DB State AFTER..."
    $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $DRIVER_TOKEN
    if (-not $r.OK) { $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $ADMIN_TOKEN }
    Log "DB State AFTER" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "Trip $TRIP_ID after all actions"
    if ($r.OK) {
        $tripAfter = $r.Body | ConvertFrom-Json
        Write-Host "Trip Status AFTER: $($tripAfter.status)"
        Write-Host "pickupReceiptUrl AFTER: $($tripAfter.pickupReceiptUrl)"
        Write-Host "locationEnabled AFTER: $($tripAfter.locationEnabled)"
        Write-Host "startedAt AFTER: $($tripAfter.startedAt)"
    }
}

# ============================================================
# STEP 11: Digital LR Verification
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[11/12] Digital LR Verification..."

    # GET /api/lr/trip/{tripId}
    $r = Invoke-API "GET" "$BASE/api/lr/trip/$TRIP_ID" $DRIVER_TOKEN
    Log "GET /api/lr/trip/{tripId}" $(if($r.OK){"PASS"}else{"FAIL"}) $r.Code $r.Body "LR metadata endpoint"

    if ($r.OK) {
        $lrData = $r.Body | ConvertFrom-Json
        Write-Host "LR Number: $($lrData.lrNumber)"
        Write-Host "LR PDF URL: $($lrData.pdfUrl)"
        Write-Host "LR QR Code URL: $($lrData.qrCodeUrl)"
        Write-Host "LR Generated At: $($lrData.generatedAt)"

        if ($lrData.lrNumber) {
            Log "LR Metadata" "PASS" 200 "lrNumber=$($lrData.lrNumber) | pdfUrl exists=$(($lrData.pdfUrl -ne $null))" "LR metadata OK [OK]"
        } else {
            Log "LR Metadata" "FAIL" 200 "lrNumber is null" "LR not generated [FAIL]"
        }
    }

    # GET /api/lr/trip/{tripId}/pdf
    Write-Host "Testing LR PDF endpoint..."
    $r2 = Invoke-API "GET" "$BASE/api/lr/trip/$TRIP_ID/pdf" $DRIVER_TOKEN
    $pdfOk = ($r2.Code -eq 200 -and $r2.Body.Length -gt 100)
    Log "GET /api/lr/trip/{tripId}/pdf" $(if($pdfOk){"PASS"}else{"FAIL"}) $r2.Code "PDF bytes: $($r2.Body.Length) | First 50: $($r2.Body | Select-Object -First 50)" "LR PDF endpoint"
    if ($pdfOk) {
        Write-Host "PDF returned $($r2.Body.Length) bytes [OK]"
    }
}

# ============================================================
# STEP 12: Route Intelligence Verification
# ============================================================
if ($TRIP_ID) {
    Write-Host "`n[12/12] Route Intelligence Verification..."
    $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $DRIVER_TOKEN
    if (-not $r.OK) { $r = Invoke-API "GET" "$BASE/api/trips/$TRIP_ID" $ADMIN_TOKEN }

    if ($r.OK) {
        $trip = $r.Body | ConvertFrom-Json
        $routeFields = @{
            "distance"              = $trip.distance
            "estimatedTravelTimeMins" = $trip.estimatedTravelTimeMins
            "tollPlazaCount"        = $trip.tollPlazaCount
            "estimatedTollCost"     = $trip.estimatedTollCost
            "totalTollCost"         = $trip.totalTollCost
            "fuelEstimateLiters"    = $trip.fuelEstimateLiters
            "fuelCost"              = $trip.fuelCost
            "carbonEmission"        = $trip.carbonEmission
        }

        Write-Host "`nRoute Intelligence Values:"
        $allSet = $true
        foreach ($f in $routeFields.GetEnumerator()) {
            $val = $f.Value
            $ok = ($val -ne $null -and $val -ne 0)
            Write-Host "  $($f.Key): $val $(if($ok){'[OK]'}else{'[FAIL]'})"
            if (-not $ok) { $allSet = $false }
        }
        Log "Route Intelligence Data" $(if($allSet){"PASS"}else{"PARTIAL"}) 200 ($routeFields | ConvertTo-Json) "Route fields in Trip DB record"
    }
}

# ============================================================
# SUMMARY
# ============================================================
Write-Host ""
Write-Host "=================================================="
Write-Host "  VERIFICATION SUMMARY"
Write-Host "=================================================="
foreach ($result in $RESULTS) {
    $emoji = if ($result.Status -eq "PASS") { "[OK]" } elseif ($result.Status -eq "FAIL") { "[FAIL]" } else { "[WARN]" }
    Write-Host "  $emoji $($result.Step) (HTTP $($result.Code))"
}
Write-Host "=================================================="
Write-Host "Total: $($RESULTS.Count) steps"
$passed = ($RESULTS | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($RESULTS | Where-Object { $_.Status -eq "FAIL" }).Count
Write-Host "PASSED: $passed | FAILED: $failed"
Write-Host "=================================================="
