# Execution Guide - UPI Fraud Detection System

## ✅ Project Files Created

### Backend Files (7 files)
- ✅ `backend/main.py` - FastAPI application
- ✅ `backend/data_processor.py` - Data loading and cleaning
- ✅ `backend/fraud_rules.py` - Rule-based fraud detection
- ✅ `backend/ml_model.py` - XGBoost model
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/__init__.py` - Package initialization
- ✅ `backend/.gitignore` - Git ignore file

### Frontend Files (11 files)
- ✅ `frontend/src/App.jsx` - Main application
- ✅ `frontend/src/main.jsx` - React entry point
- ✅ `frontend/src/index.css` - Global styles
- ✅ `frontend/src/components/Dashboard.jsx` - Dashboard component
- ✅ `frontend/src/components/DataManagement.jsx` - Data management
- ✅ `frontend/src/components/ModelTraining.jsx` - Model training
- ✅ `frontend/src/components/PredictionForm.jsx` - Fraud detection form
- ✅ `frontend/package.json` - Node dependencies
- ✅ `frontend/vite.config.js` - Vite configuration
- ✅ `frontend/tailwind.config.js` - TailwindCSS config
- ✅ `frontend/postcss.config.js` - PostCSS config
- ✅ `frontend/index.html` - HTML template
- ✅ `frontend/.gitignore` - Git ignore file

### Configuration & Scripts (8 files)
- ✅ `setup_backend.bat` - Backend setup script
- ✅ `setup_frontend.bat` - Frontend setup script
- ✅ `run_backend.bat` - Backend run script
- ✅ `run_frontend.bat` - Frontend run script
- ✅ `.gitignore` - Root git ignore
- ✅ `README.md` - Main documentation
- ✅ `QUICKSTART.md` - Quick start guide
- ✅ `PROJECT_OVERVIEW.md` - Project overview

### Data File
- ✅ `upi_transactions_2024.csv` - Transaction dataset (250,000+ records)

## 🚀 Step-by-Step Execution

### Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.8 or higher installed
- [ ] Node.js 16 or higher installed
- [ ] npm installed (comes with Node.js)
- [ ] Terminal/Command Prompt access

### Step 1: Setup Backend (5 minutes)

#### Windows:
```bash
# Open Command Prompt or PowerShell
# Navigate to project folder
cd "c:\Users\Hari Prabhat\Documents\mba project upi"

# Run setup script
setup_backend.bat
```

#### Linux/Mac:
```bash
# Open Terminal
cd "/path/to/mba project upi"

# Create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
cd ..
```

**Expected Output:**
```
Creating virtual environment...
Activating virtual environment...
Installing dependencies...
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 pandas-2.1.3 ...
Backend setup complete!
```

### Step 2: Setup Frontend (5 minutes)

#### Windows:
```bash
# In the same terminal or new one
setup_frontend.bat
```

#### Linux/Mac:
```bash
cd frontend
npm install
cd ..
```

**Expected Output:**
```
Installing Node.js dependencies...
added 234 packages in 45s
Frontend setup complete!
```

### Step 3: Start Backend Server

#### Windows:
```bash
# Open a NEW terminal window
run_backend.bat
```

#### Linux/Mac:
```bash
cd backend
source venv/bin/activate
python main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**✅ Backend is ready when you see:** `Application startup complete.`

**Test Backend:**
Open browser and visit: `http://localhost:8000/health`

Should see:
```json
{
  "status": "healthy",
  "data_loaded": false,
  "model_trained": false
}
```

### Step 4: Start Frontend Server

#### Windows:
```bash
# Open ANOTHER NEW terminal window
run_frontend.bat
```

#### Linux/Mac:
```bash
# In a new terminal
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**✅ Frontend is ready when you see:** `Local: http://localhost:3000/`

### Step 5: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the UPI Fraud Detection System interface

## 📋 Complete Workflow

### Phase 1: Data Management (2 minutes)

1. Click on **"Data Management"** tab
2. Click **"Load Data from CSV"** button
   - Wait for success message
   - View data statistics
3. Click **"Clean & Preprocess Data"** button
   - Wait for success message
   - Review cleaning report

**✅ Success Indicators:**
- Green checkmarks on progress steps
- Data statistics displayed
- Cleaning report shows transformations

### Phase 2: Model Training (3 minutes)

1. Click on **"Model Training"** tab
2. Review the 10 fraud detection rules
3. Click **"Apply Fraud Detection Rules"** button
   - Wait for success message
   - View flagged transactions summary
4. Click **"Train XGBoost Model"** button
   - Wait for training to complete (may take 1-2 minutes)
   - View model performance metrics

**✅ Success Indicators:**
- Rules applied successfully
- Model metrics displayed (Accuracy, Precision, Recall, F1, ROC AUC)
- Confusion matrix shown
- Feature importance displayed

### Phase 3: Fraud Detection (1 minute)

1. Click on **"Fraud Detection"** tab
2. Enter transaction details (or use defaults)
3. Click **"Check for Fraud"** button
4. View prediction results:
   - Fraud/Legitimate status
   - Risk level (LOW/MEDIUM/HIGH)
   - Detection scores
   - Triggered rules

**Test Cases:**

**Case 1: High-Risk Transaction**
- Amount: 15000
- Hour: 23 (11 PM)
- Transaction Type: P2P
- Category: Shopping
- Expected: **FRAUD DETECTED** (HIGH RISK)

**Case 2: Low-Risk Transaction**
- Amount: 500
- Hour: 14 (2 PM)
- Transaction Type: P2M
- Category: Grocery
- Expected: **LEGITIMATE** (LOW RISK)

### Phase 4: Dashboard Analysis (2 minutes)

1. Click on **"Dashboard"** tab
2. Review:
   - Total transactions
   - Fraud statistics
   - Transaction type distribution
   - Model performance metrics
   - Amount statistics

## 🔍 Verification Checklist

### Backend Verification
- [ ] Backend server running on port 8000
- [ ] Health endpoint accessible: `http://localhost:8000/health`
- [ ] No error messages in terminal
- [ ] API docs accessible: `http://localhost:8000/docs`

### Frontend Verification
- [ ] Frontend server running on port 3000
- [ ] Application loads in browser
- [ ] All 4 tabs visible (Dashboard, Data Management, Model Training, Fraud Detection)
- [ ] No console errors in browser (F12 → Console)

### Functionality Verification
- [ ] Data loads successfully
- [ ] Data cleaning completes
- [ ] Rules apply successfully
- [ ] Model trains successfully
- [ ] Predictions work
- [ ] Dashboard displays data

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### Issue: Frontend won't start

**Error:** `npm: command not found`

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal
- Try again

### Issue: Port already in use

**Error:** `Address already in use`

**Backend Solution:**
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

**Frontend Solution:**
- Vite will automatically suggest another port (e.g., 3001)
- Press 'y' to use the suggested port

### Issue: CORS errors

**Error:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
- Ensure backend is running
- Check CORS configuration in `backend/main.py`
- Restart backend server

### Issue: Data file not found

**Error:** `FileNotFoundError: upi_transactions_2024.csv`

**Solution:**
- Ensure `upi_transactions_2024.csv` is in the root project folder
- Check file path in `backend/main.py` (line 52)

## 📊 Expected Performance

### Backend
- Startup time: < 5 seconds
- Data loading: < 2 seconds
- Data cleaning: < 3 seconds
- Rule application: < 5 seconds
- Model training: 30-120 seconds (depends on CPU)
- Prediction: < 1 second

### Frontend
- Build time: < 5 seconds
- Page load: < 2 seconds
- Component rendering: < 1 second

### Model Metrics (Expected)
- Accuracy: 90-95%
- Precision: 85-92%
- Recall: 80-90%
- F1 Score: 85-91%
- ROC AUC: 90-95%

## 🎯 Success Criteria

The project is successfully executed when:

1. ✅ Backend server starts without errors
2. ✅ Frontend application loads in browser
3. ✅ Data loads and cleans successfully
4. ✅ Fraud rules apply correctly
5. ✅ XGBoost model trains successfully
6. ✅ Predictions work for test transactions
7. ✅ Dashboard displays all statistics
8. ✅ All visualizations render correctly

## 📝 Next Steps After Execution

1. **Experiment with different transactions**
   - Try various amounts, times, and combinations
   - Observe which rules get triggered
   - Compare rule-based vs ML predictions

2. **Analyze model performance**
   - Review confusion matrix
   - Check feature importance
   - Understand which features matter most

3. **Explore the data**
   - Check transaction distributions
   - Analyze fraud patterns
   - Review statistics

4. **Test edge cases**
   - Very high amounts
   - Unusual times
   - Different device/network combinations

## 🎓 Learning Points

After completing this execution, you will have:
- ✅ Built a full-stack ML application
- ✅ Implemented hybrid fraud detection
- ✅ Trained an XGBoost model
- ✅ Created a modern React UI
- ✅ Deployed a FastAPI backend
- ✅ Integrated frontend and backend
- ✅ Visualized data and metrics

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review terminal/console error messages
3. Verify all prerequisites are installed
4. Check the main README.md for detailed documentation
5. Ensure both servers are running simultaneously

## 🎉 Completion

Once you've completed all steps and verified functionality, your UPI Fraud Detection System is fully operational!

**Congratulations! 🎊**

---

**Total Setup Time:** ~10 minutes
**Total Execution Time:** ~8 minutes
**Total Time:** ~18 minutes

**Project Status:** ✅ Ready for Execution
