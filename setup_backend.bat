@echo off
echo ========================================
echo UPI Fraud Detection - Backend Setup
echo ========================================
echo.

echo Creating virtual environment...
cd backend
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ========================================
echo Backend setup complete!
echo ========================================
echo.
echo To start the backend server:
echo   1. cd backend
echo   2. venv\Scripts\activate
echo   3. python main.py
echo.
pause
