$ErrorActionPreference = "Stop"

try {
    Write-Host "Logging in as Transporter..."
    $loginBody = '{"loginType":"EMAIL_PASSWORD","email":"transporter@test.com","password":"Password123"}'
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Token obtained: $($token.Substring(0, 10))..."
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    Write-Host "Fetching Transporter Trips..."
    $tripsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/trips/transporter/4" -Method Get -Headers $headers
    $tripId = $null
    if ($tripsResponse.Count -gt 0) {
        $tripId = $tripsResponse[0].id
        Write-Host "Found Trip ID: $tripId"
    } else {
        Write-Host "No trips found for transporter 4. Creating a fake one via DB or waiting for user."
        exit
    }

    # Use Driver 2 (Test Driver) and Vehicle 1 (assuming it exists, we can use DB test query to find it)
    $dbData = Invoke-RestMethod -Uri "http://localhost:8080/api/test-db" -Method Get
    $driverId = $dbData.drivers[0].user_id
    $vehicleId = $dbData.vehicles[0].id

    Write-Host "Driver ID: $driverId"
    Write-Host "Vehicle ID: $vehicleId"
    
    $assignBody = @{
        driverId = $driverId
        vehicleId = $vehicleId
    } | ConvertTo-Json

    Write-Host "Calling Assign Fleet API..."
    try {
        $assignResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/trips/$tripId/assign-fleet" -Method Post -Body $assignBody -Headers $headers
        Write-Host "Response Status: 200 OK"
        Write-Host "Response Body:"
        $assignResponse | ConvertTo-Json -Depth 5 | Write-Host
    } catch {
        Write-Host "API call failed!"
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Response:"
        $_.Exception.Response.GetResponseStream() | %{ (New-Object System.IO.StreamReader($_)).ReadToEnd() } | Write-Host
    }

} catch {
    Write-Host "Script failed: $_"
}
