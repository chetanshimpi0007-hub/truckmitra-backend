$ErrorActionPreference = "Stop"
try {
    $loginBody = '{"loginType":"EMAIL_PASSWORD","email":"9000000000","mobile":"9000000000","password":"Password123"}'
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Mobile Login Success"
} catch {
    Write-Host "Mobile Login Failed"
    $_.Exception.Response.GetResponseStream() | %{ (New-Object System.IO.StreamReader($_)).ReadToEnd() }
}
