@echo off
title Pubblicazione GDScript Hero su GitHub
echo ===================================================
echo   Caricamento di GDScript Hero su GitHub...
echo ===================================================
echo.
cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   FANTASTICO! Progetto caricato con successo!
    echo ===================================================
    echo Ora puoi attivare GitHub Pages:
    echo 1. Vai su https://github.com/domyno6773/gdscript-hero/settings/pages
    echo 2. Sotto "Branch", seleziona "main" e clicca "Save"
    echo.
) else (
    echo [ERRORE] Il caricamento non e andato a buon fine.
)
echo.
pause
