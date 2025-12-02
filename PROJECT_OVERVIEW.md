# UPI Fraud Detection System - Project Overview

## 📋 Executive Summary

This project implements a comprehensive fraud detection system for UPI (Unified Payments Interface) transactions using a hybrid approach combining rule-based detection and machine learning. The system processes transaction data, applies sophisticated fraud detection rules, trains an XGBoost model, and provides real-time fraud predictions through an intuitive web interface.

## 🎯 Project Objectives

1. **Data Processing**: Load and clean UPI transaction data from CSV files
2. **Rule-Based Detection**: Implement hybrid fraud detection rules based on transaction patterns
3. **Machine Learning**: Train an XGBoost model for intelligent fraud prediction
4. **Real-time Prediction**: Provide instant fraud detection for individual transactions
5. **Visualization**: Display comprehensive statistics and model performance metrics

## 🏗️ System Components

### 1. Backend (FastAPI)

#### **data_processor.py**
- Loads CSV data
- Handles missing values, duplicates, and outliers
- Creates derived features
- Provides data statistics

**Key Functions:**
- `load_data()`: Import CSV file
- `clean_data()`: Preprocess and validate data
- `get_data_stats()`: Generate statistics

#### **fraud_rules.py**
- Implements 10 fraud detection rules
- Calculates rule-based fraud scores
- Identifies triggered rules

**Fraud Detection Rules:**
1. High Amount (>₹10,000) - Weight: 0.3
2. Unusual Hours (11PM-5AM) - Weight: 0.2
3. Failed Transactions - Weight: 0.25
4. Cross-State High Value - Weight: 0.25
5. Suspicious Device (Web + High Amount) - Weight: 0.15
6. Very Small Amount (<₹50) - Weight: 0.1
7. Weekend High Value - Weight: 0.15
8. Age Group Mismatch - Weight: 0.2
9. Risky Category Combination - Weight: 0.15
10. Network Anomaly (3G + High Value) - Weight: 0.1

**Fraud Threshold**: Score ≥ 0.4

#### **ml_model.py**
- Trains XGBoost classifier
- Handles feature encoding
- Provides predictions and probabilities
- Saves/loads trained models

**Model Configuration:**
- Algorithm: XGBoost
- Max Depth: 6
- Learning Rate: 0.1
- Estimators: 200
- Handles class imbalance with scale_pos_weight

#### **main.py**
- FastAPI application
- REST API endpoints
- CORS configuration
- Request/response handling

**API Endpoints:**
- `POST /load-data`: Load CSV data
- `POST /clean-data`: Clean and preprocess
- `GET /fraud-rules`: Get rule descriptions
- `POST /apply-rules`: Apply fraud rules
- `POST /train-model`: Train XGBoost model
- `POST /predict`: Predict fraud for transaction
- `GET /stats`: Get statistics
- `GET /health`: Health check

### 2. Frontend (React + Vite)

#### **Dashboard.jsx**
- Displays overall statistics
- Shows fraud distribution (pie chart)
- Transaction type analysis (bar chart)
- Model performance metrics
- Feature importance visualization

#### **DataManagement.jsx**
- Load CSV data
- Clean and preprocess data
- Display data statistics
- Show cleaning report
- Progress tracking

#### **ModelTraining.jsx**
- Display fraud detection rules
- Apply rule-based detection
- Train XGBoost model
- Show model metrics
- Confusion matrix
- Feature importance

#### **PredictionForm.jsx**
- Input transaction details
- Real-time fraud prediction
- Risk level assessment
- Display triggered rules
- Show detection scores

## 📊 Data Flow

```
1. CSV File (upi_transactions_2024.csv)
   ↓
2. Load Data (data_processor.py)
   ↓
3. Clean Data (handle missing, duplicates, outliers)
   ↓
4. Apply Fraud Rules (fraud_rules.py)
   ↓
5. Train XGBoost Model (ml_model.py)
   ↓
6. Make Predictions (hybrid: rules + ML)
   ↓
7. Display Results (React Frontend)
```

## 🔍 Fraud Detection Methodology

### Hybrid Approach

The system uses a two-stage fraud detection approach:

#### Stage 1: Rule-Based Detection
- Applies 10 weighted rules
- Calculates normalized score (0-1)
- Flags transactions with score ≥ 0.4
- Fast, interpretable, no training required

#### Stage 2: ML-Based Detection
- Uses XGBoost gradient boosting
- Trained on historical data with fraud labels
- Considers all transaction features
- Provides probability score (0-1)
- Flags transactions with probability > 0.5

#### Final Decision
- **Fraud** if EITHER method flags the transaction
- Provides risk level: LOW, MEDIUM, HIGH
- Lists all triggered rules
- Shows both detection scores

## 📈 Model Performance

### Evaluation Metrics

1. **Accuracy**: Overall correctness
2. **Precision**: Fraud predictions that are correct
3. **Recall**: Actual frauds that are detected
4. **F1 Score**: Harmonic mean of precision and recall
5. **ROC AUC**: Model's ability to distinguish classes

### Expected Performance
- Accuracy: 90-95%
- Precision: 85-92%
- Recall: 80-90%
- F1 Score: 85-91%
- ROC AUC: 90-95%

## 🎨 User Interface Features

### Modern Design
- Dark theme with gradient backgrounds
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Color-coded risk levels
- Interactive charts and graphs

### User Experience
- Step-by-step workflow
- Progress indicators
- Real-time feedback
- Toast notifications
- Clear error messages
- Loading states

## 🔒 Data Processing Pipeline

### 1. Data Loading
- Read CSV file
- Validate structure
- Count records

### 2. Data Cleaning
- **Missing Values**: Fill with median (numeric) or mode (categorical)
- **Duplicates**: Remove duplicate transactions
- **Outliers**: Cap using IQR method (3×IQR)
- **Timestamps**: Parse and create time features
- **Encoding**: Label encode categorical variables

### 3. Feature Engineering
- Amount categories (small, medium, large, very large)
- Time-based features (hour, day, weekend)
- Cross-feature combinations

### 4. Model Training
- Train/test split (80/20)
- Handle class imbalance
- Feature importance analysis
- Cross-validation

## 📦 Deliverables

### Code Files
- ✅ Backend API (4 Python files)
- ✅ Frontend UI (4 React components)
- ✅ Configuration files
- ✅ Setup scripts

### Documentation
- ✅ README.md (comprehensive guide)
- ✅ QUICKSTART.md (5-minute setup)
- ✅ PROJECT_OVERVIEW.md (this file)
- ✅ Inline code comments

### Features
- ✅ Data loading and cleaning
- ✅ 10 fraud detection rules
- ✅ XGBoost model training
- ✅ Real-time predictions
- ✅ Interactive dashboard
- ✅ Performance metrics
- ✅ Visualization charts

## 🚀 Deployment Considerations

### Development
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### Production (Future)
- Use production ASGI server (Gunicorn + Uvicorn)
- Build frontend: `npm run build`
- Serve static files with Nginx
- Use environment variables
- Implement authentication
- Add rate limiting
- Enable HTTPS
- Use database for data storage
- Implement logging and monitoring

## 🎓 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**: React + FastAPI integration
2. **Data Science**: Data cleaning, feature engineering, ML
3. **Machine Learning**: XGBoost, model evaluation, deployment
4. **API Design**: RESTful API, request/response handling
5. **UI/UX Design**: Modern, responsive, user-friendly interface
6. **Software Engineering**: Code organization, documentation, testing

## 📊 Dataset Information

**File**: `upi_transactions_2024.csv`

**Size**: 250,000+ transactions

**Features**: 17 columns
- Transaction metadata (ID, timestamp, type, status)
- Amount and category
- User demographics (age groups)
- Location (states)
- Banking information (sender/receiver banks)
- Device and network details
- Time features (hour, day, weekend)
- Fraud label (ground truth)

## 🔧 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pandas**: Data manipulation
- **NumPy**: Numerical operations
- **Scikit-learn**: ML utilities, preprocessing
- **XGBoost**: Gradient boosting algorithm
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

## 🎯 Future Enhancements

1. **Advanced Features**
   - Real-time transaction streaming
   - Anomaly detection algorithms
   - Deep learning models (LSTM, Transformer)
   - Ensemble methods

2. **Data Management**
   - Database integration (PostgreSQL)
   - Data versioning
   - Automated data pipeline
   - Batch processing

3. **User Features**
   - User authentication
   - Role-based access
   - Transaction history
   - Custom rule creation
   - Model retraining interface

4. **Analytics**
   - Advanced visualizations
   - Time-series analysis
   - Fraud pattern analysis
   - Reporting dashboard

5. **Production Features**
   - API rate limiting
   - Caching (Redis)
   - Load balancing
   - Monitoring and alerting
   - A/B testing framework

## 📝 Conclusion

This UPI Fraud Detection System successfully combines traditional rule-based approaches with modern machine learning techniques to provide accurate, interpretable, and real-time fraud detection. The system is production-ready for demonstration purposes and can be extended with additional features for real-world deployment.

---

**Project Status**: ✅ Complete and Ready for Execution

**Last Updated**: 2024
