$ErrorActionPreference = "Stop"
try {
    $regBody = '{"fullName":"New Driver","mobile":"9000000000","email":"drivernew@test.com","password":"Password123","role":"DRIVER","preferredLoginType":"EMAIL_PASSWORD"}'
    $regResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "Register Success"
} catch {
    Write-Host "Register Failed"
    $_.Exception.Response.GetResponseStream() | %{ (New-Object System.IO.StreamReader($_)).ReadToEnd() }
}

try {
    $loginBody = '{"loginType":"EMAIL_PASSWORD","email":"drivernew@test.com","password":"Password123"}'
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login Success"
} catch {
    Write-Host "Login Failed"
    $_.Exception.Response.GetResponseStream() | %{ (New-Object System.IO.StreamReader($_)).ReadToEnd() }
}
