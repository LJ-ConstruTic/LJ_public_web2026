param([switch]$RefreshCatalog)

$ErrorActionPreference = 'Stop'
Push-Location (Join-Path $PSScriptRoot '..')
try {
    if ($RefreshCatalog) {
        & node scripts/update-seo-catalog.mjs
        if ($LASTEXITCODE -ne 0) { throw "Public CMS catalog refresh failed ($LASTEXITCODE)." }
        & node scripts/static-site.mjs --sitemap
        if ($LASTEXITCODE -ne 0) { throw "Source sitemap generation failed ($LASTEXITCODE)." }
    }
    & npm.cmd run build -- --configuration production --stats-json
    if ($LASTEXITCODE -ne 0) { throw "Angular build failed ($LASTEXITCODE)." }

    $output = Join-Path $PWD 'dist/construtic'
    $browser = Join-Path $output 'browser'
    & node scripts/static-site.mjs $browser
    if ($LASTEXITCODE -ne 0) { throw "Static site generation failed ($LASTEXITCODE)." }

    $root = (Resolve-Path $browser).Path
    foreach ($required in 'index.html','index.csr.html','404.html','.htaccess','robots.txt','sitemap.xml') {
        if (!(Test-Path -LiteralPath (Join-Path $root $required) -PathType Leaf)) {
            throw "Missing release file: $required"
        }
    }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = Join-Path $output 'LJConstruTic-onecom.zip'
    $manifest = [System.Collections.Generic.List[object]]::new()
    $stream = [IO.File]::Create($archive)
    try {
        $zip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create, $true)
        try {
            $files = Get-ChildItem -LiteralPath $root -File -Recurse -Force | Sort-Object FullName
            foreach ($file in $files) {
                $relative = $file.FullName.Substring($root.Length + 1).Replace('\','/')
                if ($relative -ne '.htaccess' -and
                    ($relative -match '(^|/)\.|\.(map|log|bak|zip|ts|scss)$')) {
                    throw "Unexpected browser output: $relative"
                }
                [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relative)
                $manifest.Add([ordered]@{
                    path = $relative
                    bytes = $file.Length
                    sha256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
                })
            }
            $licenses = Join-Path $output '3rdpartylicenses.txt'
            if (!(Test-Path -LiteralPath $licenses -PathType Leaf)) { throw 'Missing Angular license notices.' }
            [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $licenses, '3rdpartylicenses.txt')
            $manifest.Add([ordered]@{
                path = '3rdpartylicenses.txt'
                bytes = (Get-Item -LiteralPath $licenses).Length
                sha256 = (Get-FileHash -LiteralPath $licenses -Algorithm SHA256).Hash.ToLowerInvariant()
            })
        } finally { $zip.Dispose() }
    } finally { $stream.Dispose() }

    $manifest.ToArray() | ConvertTo-Json -Depth 3 | Set-Content -Encoding UTF8 (Join-Path $output 'onecom-manifest.json')
    $hash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  LJConstruTic-onecom.zip" | Set-Content -Encoding ASCII "$archive.sha256"
    Write-Output $archive
} finally { Pop-Location }
