# UPI Fraud Detection System

A comprehensive fraud detection system for UPI (Unified Payments Interface) transactions using hybrid rule-based and machine learning approaches. Built with React frontend and FastAPI backend.

## 🌟 Features

- **Data Management**: Load and preprocess UPI transaction data from CSV
- **Data Cleaning**: Automated data cleaning with handling of missing values, duplicates, and outliers
- **Hybrid Fraud Detection**:
  - **Rule-Based Engine**: 10 sophisticated fraud detection rules
  - **ML-Based Detection**: XGBoost gradient boosting model
- **Real-time Predictions**: Instant fraud detection for individual transactions
- **Interactive Dashboard**: Comprehensive visualization of statistics and model performance
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Fraud Detection Rules](#fraud-detection-rules)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)

## 🏗️ System Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  FastAPI Backend│
│   (Port 8000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ Rules│  │XGBoost│
│Engine│  │ Model│
└──────┘  └──────┘
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and npm - [Download Node.js](https://nodejs.org/)
- **Git** (optional) - [Download Git](https://git-scm.com/)

## 📦 Installation

### Quick Setup (Windows)

1. **Clone or download this project**

2. **Setup Backend** (Run as Administrator if needed):
   ```bash
   setup_backend.bat
   ```

3. **Setup Frontend**:
   ```bash
   setup_frontend.bat
   ```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Usage

### Starting the Application

#### Option 1: Using Batch Scripts (Windows)

1. **Start Backend** (in one terminal):
   ```bash
   run_backend.bat
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   run_frontend.bat
   ```

#### Option 2: Manual Start

1. **Start Backend**:
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   python main.py
   ```
   Backend will run at: `http://localhost:8000`

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run at: `http://localhost:3000`

3. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`

### Step-by-Step Workflow

1. **Data Management Tab**:
   - Click "Load Data from CSV" to load the `upi_transactions_2024.csv` file
   - Click "Clean & Preprocess Data" to clean the data
   - View data statistics and cleaning report

2. **Model Training Tab**:
   - Review the 10 fraud detection rules
   - Click "Apply Fraud Detection Rules" to apply rule-based detection
   - Click "Train XGBoost Model" to train the ML model
   - View model performance metrics and feature importance

3. **Fraud Detection Tab**:
   - Enter transaction details in the form
   - Click "Check for Fraud" to get instant prediction
   - View risk level, detection scores, and triggered rules

4. **Dashboard Tab**:
   - View overall statistics
   - Analyze fraud distribution
   - Monitor model performance metrics

## 📁 Project Structure

```
mba project upi/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── data_processor.py       # Data loading and cleaning
│   ├── fraud_rules.py          # Rule-based fraud detection engine
│   ├── ml_model.py             # XGBoost model training and prediction
│   ├── requirements.txt        # Python dependencies
│   └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Dashboard component
│   │   │   ├── DataManagement.jsx     # Data management component
│   │   │   ├── ModelTraining.jsx      # Model training component
│   │   │   └── PredictionForm.jsx     # Fraud detection form
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS configuration
│   └── index.html              # HTML template
├── upi_transactions_2024.csv   # Transaction dataset
├── setup_backend.bat           # Backend setup script
├── setup_frontend.bat          # Frontend setup script
├── run_backend.bat             # Backend run script
├── run_frontend.bat            # Frontend run script
└── README.md                   # This file
```

## 🔍 Fraud Detection Rules

The system implements 10 sophisticated fraud detection rules:

1. **High Amount Transaction** (Weight: 0.3)
   - Flags transactions above ₹10,000

2. **Unusual Hour Transaction** (Weight: 0.2)
   - Flags transactions between 11 PM and 5 AM

3. **Failed Transaction Pattern** (Weight: 0.25)
   - Flags failed transactions as potential fraud attempts

4. **Cross-State High Value** (Weight: 0.25)
   - Flags high-value (>₹5,000) cross-state transactions

5. **Suspicious Device Type** (Weight: 0.15)
   - Flags web-based transactions with amounts >₹3,000

6. **Multiple Small Transactions** (Weight: 0.1)
   - Flags very small amounts (<₹50) as potential testing

7. **Weekend High Value** (Weight: 0.15)
   - Flags high-value (>₹8,000) weekend transactions

8. **Age Group Mismatch** (Weight: 0.2)
   - Flags suspicious age group combinations with high amounts

9. **Rapid Transaction** (Weight: 0.15)
   - Flags P2P transactions in risky categories (Entertainment/Shopping) >₹5,000

10. **Network Type Anomaly** (Weight: 0.1)
    - Flags 3G network with high-value (>₹2,000) transactions

**Fraud Threshold**: Transactions with a combined rule score ≥ 0.4 are flagged as fraudulent.

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Load Data
```http
POST /load-data
```
Loads the CSV data file.

**Response:**
```json
{
  "status": "success",
  "message": "Data loaded successfully",
  "stats": { ... }
}
```

#### 2. Clean Data
```http
POST /clean-data
```
Cleans and preprocesses the loaded data.

**Response:**
```json
{
  "status": "success",
  "message": "Data cleaned successfully",
  "report": { ... }
}
```

#### 3. Get Fraud Rules
```http
GET /fraud-rules
```
Returns all defined fraud detection rules.

#### 4. Apply Rules
```http
POST /apply-rules
```
Applies rule-based fraud detection to the dataset.

#### 5. Train Model
```http
POST /train-model
```
Trains the XGBoost fraud detection model.

**Response:**
```json
{
  "status": "success",
  "message": "Model trained successfully",
  "metrics": {
    "accuracy": 0.95,
    "precision": 0.92,
    "recall": 0.88,
    "f1_score": 0.90,
    "roc_auc": 0.94
  }
}
```

#### 6. Predict Fraud
```http
POST /predict
```
Predicts fraud for a single transaction.

**Request Body:**
```json
{
  "transaction_type": "P2P",
  "merchant_category": "Shopping",
  "amount": 5000,
  "sender_age_group": "26-35",
  "receiver_age_group": "26-35",
  "sender_state": "Maharashtra",
  "sender_bank": "SBI",
  "receiver_bank": "HDFC",
  "device_type": "Android",
  "network_type": "4G",
  "hour_of_day": 14,
  "day_of_week": "Monday",
  "is_weekend": 0
}
```

**Response:**
```json
{
  "rule_based_fraud": false,
  "rule_based_score": 0.25,
  "ml_fraud_probability": 0.15,
  "ml_fraud_prediction": false,
  "final_prediction": false,
  "triggered_rules": ["High Amount Transaction"],
  "risk_level": "LOW"
}
```

#### 7. Get Statistics
```http
GET /stats
```
Returns dataset statistics and model performance.

#### 8. Health Check
```http
GET /health
```
Returns API health status.

## 🎨 Technologies Used

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning utilities
- **XGBoost** - Gradient boosting framework
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## 📊 Dataset

The system uses `upi_transactions_2024.csv` with the following features:

- **transaction_id**: Unique transaction identifier
- **timestamp**: Transaction timestamp
- **transaction_type**: P2P, P2M, Bill Payment, Recharge
- **merchant_category**: Shopping, Food, Grocery, etc.
- **amount (INR)**: Transaction amount
- **transaction_status**: SUCCESS or FAILED
- **sender_age_group**: Age group of sender
- **receiver_age_group**: Age group of receiver
- **sender_state**: State of sender
- **sender_bank**: Sender's bank
- **receiver_bank**: Receiver's bank
- **device_type**: Android, iOS, Web
- **network_type**: 4G, 5G, 3G, WiFi
- **fraud_flag**: 0 (legitimate) or 1 (fraud)
- **hour_of_day**: Hour of transaction (0-23)
- **day_of_week**: Day of the week
- **is_weekend**: 0 or 1

## 🔒 Security Considerations

- This is a demonstration project for educational purposes
- In production, implement proper authentication and authorization
- Secure API endpoints with API keys or OAuth
- Encrypt sensitive data in transit and at rest
- Implement rate limiting to prevent abuse
- Use environment variables for configuration

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError`
```bash
# Solution: Ensure virtual environment is activated and dependencies are installed
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

**Issue**: Port 8000 already in use
```bash
# Solution: Change port in main.py or kill the process using port 8000
# In main.py, change: uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear npm cache and retry
npm cache clean --force
npm install
```

**Issue**: Port 3000 already in use
```bash
# Solution: The dev server will automatically suggest another port (e.g., 3001)
# Or manually set port in vite.config.js
```

### CORS Issues

If you encounter CORS errors, ensure:
- Backend is running on `http://localhost:8000`
- Frontend is running on `http://localhost:3000`
- CORS middleware is properly configured in `backend/main.py`

## 📈 Performance Metrics

Expected model performance (may vary based on data):
- **Accuracy**: 90-95%
- **Precision**: 85-92%
- **Recall**: 80-90%
- **F1 Score**: 85-91%
- **ROC AUC**: 90-95%

## 🤝 Contributing

This is an educational project. Feel free to:
- Report bugs
- Suggest new features
- Improve documentation
- Enhance fraud detection rules
- Optimize model performance

## 📝 License

This project is created for educational purposes as part of an MBA project.

## 👨‍💻 Author

Created as part of MBA Project - UPI Fraud Detection System

## 🙏 Acknowledgments

- FastAPI documentation and community
- React and Vite communities
- XGBoost developers
- TailwindCSS team
- All open-source contributors

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API documentation
3. Check browser console for frontend errors
4. Check terminal output for backend errors

---

**Happy Fraud Detection! 🛡️**
