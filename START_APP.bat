@echo off
cd /d "%~dp0"
echo ---------------------------------------------------
echo SE STARTUVA AQUA CODE...
echo.
echo 1. Se startuva serverot...
echo 2. Se otvara Google Chrome...
echo.
echo NE GO ZATVORAJTE OVOJ CRN PROZOREC DODEKA VEZBATE!
echo ---------------------------------------------------

:: Оваа линија го отвора прелистувачот веднаш
start http://localhost:5173

:: Оваа линија го пушта серверот
npm run dev