from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
from datetime import datetime
import joblib
import os

from data_processor import DataProcessor
from fraud_rules import FraudRuleEngine
from ml_model import FraudMLModel

app = FastAPI(title="UPI Fraud Detection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
data_processor = DataProcessor()
rule_engine = FraudRuleEngine()
ml_model = FraudMLModel()

# Global state
data_loaded = False
model_trained = False


class TransactionInput(BaseModel):
    transaction_type: str
    merchant_category: str
    amount: float
    sender_age_group: str
    receiver_age_group: str
    sender_state: str
    sender_bank: str
    receiver_bank: str
    device_type: str
    network_type: str
    hour_of_day: int
    day_of_week: str
    is_weekend: int


class PredictionResponse(BaseModel):
    rule_based_fraud: bool
    rule_based_score: float
    ml_fraud_probability: float
    ml_fraud_prediction: bool
    final_prediction: bool
    triggered_rules: List[str]
    risk_level: str


@app.get("/")
async def root():
    return {
        "message": "UPI Fraud Detection API",
        "version": "1.0.0",
        "endpoints": ["/load-data", "/clean-data", "/train-model", "/predict", "/stats"]
    }


@app.post("/load-data")
async def load_data():
    """Load and process the CSV data"""
    global data_loaded
    try:
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "upi_transactions_2024.csv")
        data_processor.load_data(csv_path)
        data_loaded = True
        
        stats = data_processor.get_data_stats()
        return {
            "status": "success",
            "message": "Data loaded successfully",
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")


@app.post("/clean-data")
async def clean_data():
    """Clean and preprocess the data"""
    global data_loaded
    if not data_loaded:
        raise HTTPException(status_code=400, detail="Data not loaded. Please load data first.")
    
    try:
        cleaning_report = data_processor.clean_data()
        return {
            "status": "success",
            "message": "Data cleaned successfully",
            "report": cleaning_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cleaning data: {str(e)}")


@app.get("/fraud-rules")
async def get_fraud_rules():
    """Get all defined fraud detection rules"""
    rules = rule_engine.get_rules_description()
    return {
        "status": "success",
        "rules": rules
    }


@app.post("/apply-rules")
async def apply_rules():
    """Apply rule-based fraud detection to the dataset"""
    global data_loaded
    if not data_loaded:
        raise HTTPException(status_code=400, detail="Data not loaded. Please load data first.")
    
    try:
        df = data_processor.get_data()
        results = rule_engine.apply_rules(df)
        
        return {
            "status": "success",
            "message": "Rules applied successfully",
            "summary": {
                "total_transactions": len(results),
                "flagged_by_rules": int(results['rule_based_fraud'].sum()),
                "fraud_percentage": float(results['rule_based_fraud'].mean() * 100)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying rules: {str(e)}")


@app.post("/train-model")
async def train_model():
    """Train the XGBoost fraud detection model"""
    global data_loaded, model_trained
    if not data_loaded:
        raise HTTPException(status_code=400, detail="Data not loaded. Please load data first.")
    
    try:
        df = data_processor.get_data()
        
        # Apply rules first to get additional features
        df_with_rules = rule_engine.apply_rules(df)
        
        # Train model
        metrics = ml_model.train(df_with_rules)
        model_trained = True
        
        return {
            "status": "success",
            "message": "Model trained successfully",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")


@app.post("/predict")
async def predict(transaction: TransactionInput):
    """Predict fraud for a single transaction"""
    global model_trained
    
    try:
        # Convert to DataFrame
        transaction_dict = transaction.model_dump()
        df = pd.DataFrame([transaction_dict])
        
        # Apply rule-based detection
        rule_result = rule_engine.apply_rules(df)
        rule_based_fraud = bool(rule_result['rule_based_fraud'].iloc[0])
        rule_score = float(rule_result['rule_score'].iloc[0])
        triggered_rules = rule_result['triggered_rules'].iloc[0]
        
        # ML-based prediction
        ml_fraud_prob = 0.0
        ml_fraud_pred = False
        
        if model_trained:
            ml_fraud_prob = float(ml_model.predict_proba(rule_result)[0])
            ml_fraud_pred = ml_fraud_prob > 0.5
        
        # Hybrid decision
        final_prediction = rule_based_fraud or ml_fraud_pred
        
        # Risk level
        combined_score = max(rule_score, ml_fraud_prob)
        if combined_score >= 0.8:
            risk_level = "HIGH"
        elif combined_score >= 0.5:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return PredictionResponse(
            rule_based_fraud=rule_based_fraud,
            rule_based_score=rule_score,
            ml_fraud_probability=ml_fraud_prob,
            ml_fraud_prediction=ml_fraud_pred,
            final_prediction=final_prediction,
            triggered_rules=triggered_rules,
            risk_level=risk_level
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")


@app.get("/stats")
async def get_stats():
    """Get dataset statistics and model performance"""
    global data_loaded, model_trained
    
    if not data_loaded:
        raise HTTPException(status_code=400, detail="Data not loaded. Please load data first.")
    
    try:
        stats = data_processor.get_data_stats()
        
        # Add model info if trained
        if model_trained:
            stats['model_trained'] = True
            stats['model_metrics'] = ml_model.get_metrics()
        else:
            stats['model_trained'] = False
        
        return {
            "status": "success",
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "data_loaded": data_loaded,
        "model_trained": model_trained
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
