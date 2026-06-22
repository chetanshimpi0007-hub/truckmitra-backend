$files = Get-ChildItem -Path "C:\Users\Administrator\Downloads\Truckmitra project12345\truckmitra-backend\src\main\java\com\truckmitra\entity" -Recurse -Filter *.java

$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $inEntity = $false
    $entityName = $file.BaseName
    
    for ($i = 0; $i -lt $content.Length; $i++) {
        $line = $content[$i].Trim()
        
        if ($line -cmatch "^(?:private|protected)\s+(?:[A-Za-z0-9<>,\s]+)\s+([a-z]+[A-Z][a-zA-Z0-9]*)\s*(?:=.*)?;" -and $line -notmatch "static" -and $line -notmatch "final") {
            $fieldName = $matches[1]
            
            # Look backwards up to 10 lines for annotations
            $hasColumn = $false
            for ($j = $i - 1; $j -ge [Math]::Max(0, $i - 10); $j--) {
                $prevLine = $content[$j].Trim()
                if ($prevLine -match '@Column\s*\(\s*name\s*=\s*"(.*?)"') {
                    $hasColumn = $true
                    break
                }
                if ($prevLine -match '@JoinColumn\s*\(\s*name\s*=\s*"(.*?)"') {
                    $hasColumn = $true
                    break
                }
                if ($prevLine -match "@PrimaryKeyJoinColumn") {
                    $hasColumn = $true
                    break
                }
                if ($prevLine -match "@Transient") {
                    $hasColumn = $true
                    break
                }
                if ($prevLine -match "class ") {
                    break
                }
            }
            
            if (-not $hasColumn) {
                $results += "$entityName -> $fieldName"
            }
        }
    }
}

$results | Out-File "audit_unmapped_camelcase.txt"
Write-Host "Found $($results.Count) unmapped camelCase fields."
