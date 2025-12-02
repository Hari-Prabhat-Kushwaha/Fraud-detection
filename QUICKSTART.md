# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup (One-time)

#### Windows Users:
```bash
# 1. Setup Backend
setup_backend.bat

# 2. Setup Frontend
setup_frontend.bat
```

#### Linux/Mac Users:
```bash
# 1. Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 2. Setup Frontend
cd frontend
npm install
cd ..
```

### Step 2: Run the Application

Open **TWO** terminal windows:

#### Terminal 1 - Backend:
```bash
# Windows
run_backend.bat

# Linux/Mac
cd backend
source venv/bin/activate
python main.py
```

Wait for: `Application startup complete.`

#### Terminal 2 - Frontend:
```bash
# Windows
run_frontend.bat

# Linux/Mac
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:3000/`

### Step 3: Use the Application

1. Open browser: `http://localhost:3000`

2. **Data Management Tab**:
   - Click "Load Data from CSV" ✅
   - Click "Clean & Preprocess Data" ✅

3. **Model Training Tab**:
   - Click "Apply Fraud Detection Rules" ✅
   - Click "Train XGBoost Model" ✅

4. **Fraud Detection Tab**:
   - Enter transaction details
   - Click "Check for Fraud" 🔍

5. **Dashboard Tab**:
   - View statistics and visualizations 📊

## ✅ Verification

### Backend Running?
Visit: `http://localhost:8000/health`

Should see:
```json
{
  "status": "healthy",
  "data_loaded": false,
  "model_trained": false
}
```

### Frontend Running?
Visit: `http://localhost:3000`

Should see: UPI Fraud Detection System interface

## 🆘 Common Issues

### Backend won't start?
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

### Frontend won't start?
```bash
cd frontend
npm install
npm run dev
```

### Port already in use?
- Backend: Change port in `backend/main.py` (line: `uvicorn.run(app, host="0.0.0.0", port=8000)`)
- Frontend: Vite will suggest alternative port automatically

## 📝 Default Test Transaction

Use these values for quick testing:
- **Transaction Type**: P2P
- **Category**: Shopping
- **Amount**: 15000 (High amount - will trigger fraud rules)
- **Sender Age**: 26-35
- **Receiver Age**: 18-25
- **State**: Maharashtra
- **Banks**: SBI → HDFC
- **Device**: Android
- **Network**: 4G
- **Hour**: 23 (Late night - suspicious)
- **Day**: Monday
- **Weekend**: No

Expected Result: **FRAUD DETECTED** (High risk)

## 🎯 Next Steps

1. Explore the Dashboard for insights
2. Try different transaction scenarios
3. Review fraud detection rules in Model Training tab
4. Check model performance metrics

---

Need help? Check the main [README.md](README.md) for detailed documentation.
