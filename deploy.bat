@echo off
echo ==========================================
echo      MYFIT MK - MANUALEN DEPLOY v2
echo ==========================================
echo.

:: 1. Проверка дали има внесен опис во командата
IF "%~1"=="" (
    set /p commit_msg="Vnesi opis na promenite: "
) ELSE (
    set commit_msg=%~1
)

echo.
echo 1. Pravam Build (Sostavuvanje na aplikacijata)...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo [GRESKA] Build procesot ne uspea. Proverete go kodot.
    pause
    exit /b
)

echo.
echo 2. Zacuvuvanje na kodot (Git Commit)...
git add .
git commit -m "%commit_msg%"

echo.
echo 3. Prakjanje na kodot na GitHub (Main Branch)...
git push origin main

echo.
echo 4. OBJAVUVANJE NA WEB (Deploy to gh-pages)...
echo Ova e klucniot cekor...
call npm run deploy
IF %ERRORLEVEL% NEQ 0 (
    echo [GRESKA] Objavuvanjeto na gh-pages ne uspea.
    pause
    exit /b
)

echo.
echo ==========================================
echo      [USPESNO] WEB STRANATA E AZURIRANA!
echo      Pocekaj 2-3 minuti za promenite da se pojavat.
echo ==========================================
pause