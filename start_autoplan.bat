@echo off
setlocal

REM Switch to project root (batch file directory)
cd /d "%~dp0"

REM Auto release port 5000 if occupied
set "PORT=5000"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do (
    set "PORT_PID=%%a"
    goto :kill_port_pid
)
goto :after_kill_port

:kill_port_pid
if defined PORT_PID (
    echo Port %PORT% is in use by PID %PORT_PID%. Releasing...
    taskkill /PID %PORT_PID% /F >nul 2>&1
    if %errorlevel%==0 (
        echo Port %PORT% released.
    ) else (
        echo [WARN] Failed to kill PID %PORT_PID%. Try running as Administrator.
    )
)

:after_kill_port

set "EXE_PATH=.\dist\AutoPlan_V7.5.exe"
if not exist "%EXE_PATH%" (
    set "EXE_PATH=.\AutoPlan_V7.5.exe"
)

REM Check executable
if not exist "%EXE_PATH%" (
    echo [ERROR] EXE not found.
    echo Expected: .\dist\AutoPlan_V7.5.exe or .\AutoPlan_V7.5.exe
    echo Please build first or check file name.
    pause
    exit /b 1
)

REM Check required folders (app.py uses relative paths)
if not exist ".\static" (
    echo [ERROR] .\static folder not found.
    echo Run this script from the project root.
    pause
    exit /b 1
)

if not exist ".\templates" (
    echo [ERROR] .\templates folder not found.
    echo Run this script from the project root.
    pause
    exit /b 1
)

echo Starting %EXE_PATH% ...
start "AUTOPLAN Service" /D "%cd%" "%EXE_PATH%"

REM Open browser after short delay
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5000"

echo Launched. You can close this window.
pause
exit /b 0
