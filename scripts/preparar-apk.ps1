# Sigue el procedimiento de la Unidad III: build de React, copia a Cordova y APK Android.
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

npm run build

$cordova = Join-Path (Get-Location) "cordova"
if (-not (Test-Path (Join-Path $cordova "platforms\android"))) {
  Push-Location $cordova
  cordova platform add android
  Pop-Location
}

Copy-Item -Path "build\*" -Destination "cordova\www" -Recurse -Force
Push-Location $cordova
cordova build android
Pop-Location

Write-Output "APK de depuración: cordova\platforms\android\app\build\outputs\apk\debug\app-debug.apk"
Write-Output "Para firmarlo, usa keytool, jarsigner y zipalign como indica el material de la semana 6."
