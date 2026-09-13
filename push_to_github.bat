@echo off
chcp 65001 >nul
title TalabaGo — GitHub Push
echo ======================================================================
echo           🚀 TalabaGo — GitHub'ga Yuklash (Git Push)
echo ======================================================================
echo.
echo Repozitoriy: https://github.com/mirpraject/talabaGo.git
echo Tarmoq: main
echo.
echo Yuklanmoqda, iltimos kuting...
echo (Agar GitHub login oynasi chiqsa, brauzer orqali ruxsat bering)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo   ✅ Barcha fayllar GitHub'ga muvaffaqiyatli yuklandi!
    echo   Havola: https://github.com/mirpraject/talabaGo
    echo ======================================================================
) else (
    echo ======================================================================
    echo   ❌ Xatolik yuz berdi. Iltimos GitHub parolingiz yoki tokeningizni tekshiring.
    echo ======================================================================
)
echo.
pause
