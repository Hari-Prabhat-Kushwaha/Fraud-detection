import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, accuracy_score, precision_score, recall_score, f1_score
import xgboost as xgb
import joblib
import os
from typing import Dict, Any, List


class FraudMLModel:
    """
    XGBoost-based fraud detection model
    """
    
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_names = []
        self.metrics = {}
        self.is_trained = False
    
    def _prepare_features(self, df: pd.DataFrame, is_training: bool = True) -> pd.DataFrame:
        """
        Prepare features for the model
        
        Args:
            df: Input dataframe
            is_training: Whether this is training data (to fit encoders)
            
        Returns:
            DataFrame with encoded features
        """
        df = df.copy()
        
        # Select relevant columns
        feature_columns = [
            'transaction_type', 'merchant_category', 'amount_(inr)',
            'sender_age_group', 'receiver_age_group', 'sender_state',
            'sender_bank', 'receiver_bank', 'device_type', 'network_type',
            'hour_of_day', 'day_of_week', 'is_weekend'
        ]
        
        # Handle alternative column names
        if 'amount (INR)' in df.columns and 'amount_(inr)' not in df.columns:
            df['amount_(inr)'] = df['amount (INR)']
        
        # Add rule-based features if available
        if 'rule_score' in df.columns:
            feature_columns.append('rule_score')
        if 'rule_based_fraud' in df.columns:
            feature_columns.append('rule_based_fraud')
        
        # Filter to available columns
        available_features = [col for col in feature_columns if col in df.columns]
        df_features = df[available_features].copy()
        
        # Encode categorical variables
        categorical_cols = df_features.select_dtypes(include=['object']).columns.tolist()
        
        for col in categorical_cols:
            if is_training:
                # Fit and transform
                self.label_encoders[col] = LabelEncoder()
                df_features[col] = self.label_encoders[col].fit_transform(df_features[col].astype(str))
            else:
                # Transform only
                if col in self.label_encoders:
                    # Handle unseen labels
                    le = self.label_encoders[col]
                    df_features[col] = df_features[col].astype(str).apply(
                        lambda x: le.transform([x])[0] if x in le.classes_ else -1
                    )
                else:
                    df_features[col] = 0  # Default encoding for missing encoder
        
        # Store feature names
        if is_training:
            self.feature_names = df_features.columns.tolist()
        
        return df_features
    
    def train(self, df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42) -> Dict[str, Any]:
        """
        Train the XGBoost model
        
        Args:
            df: Training dataframe with fraud_flag column
            test_size: Proportion of data for testing
            random_state: Random seed
            
        Returns:
            Dictionary with training metrics
        """
        # Check if fraud_flag exists
        if 'fraud_flag' not in df.columns:
            raise ValueError("fraud_flag column not found in dataframe")
        
        # Prepare features
        X = self._prepare_features(df, is_training=True)
        y = df['fraud_flag'].values
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Handle class imbalance
        scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
        
        # Train XGBoost model
        self.model = xgb.XGBClassifier(
            max_depth=6,
            learning_rate=0.1,
            n_estimators=200,
            objective='binary:logistic',
            scale_pos_weight=scale_pos_weight,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=random_state,
            eval_metric='auc'
        )
        
        # Fit model
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False
        )
        
        # Make predictions
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        self.metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1_score': float(f1_score(y_test, y_pred, zero_division=0)),
            'roc_auc': float(roc_auc_score(y_test, y_pred_proba)),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'fraud_samples': int(y.sum()),
            'legitimate_samples': int(len(y) - y.sum())
        }
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        self.metrics['feature_importance'] = feature_importance.head(10).to_dict('records')
        
        self.is_trained = True
        
        # Save model
        self._save_model()
        
        return self.metrics
    
    def predict(self, df: pd.DataFrame) -> np.ndarray:
        """
        Predict fraud labels
        
        Args:
            df: Input dataframe
            
        Returns:
            Array of predictions (0 or 1)
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Please train the model first.")
        
        X = self._prepare_features(df, is_training=False)
        return self.model.predict(X)
    
    def predict_proba(self, df: pd.DataFrame) -> np.ndarray:
        """
        Predict fraud probabilities
        
        Args:
            df: Input dataframe
            
        Returns:
            Array of fraud probabilities
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Please train the model first.")
        
        X = self._prepare_features(df, is_training=False)
        return self.model.predict_proba(X)[:, 1]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get model performance metrics"""
        return self.metrics
    
    def _save_model(self, path: str = None):
        """Save the trained model and encoders"""
        if path is None:
            path = os.path.join(os.path.dirname(__file__), 'saved_model')
        
        os.makedirs(path, exist_ok=True)
        
        # Save model
        model_path = os.path.join(path, 'xgboost_model.pkl')
        joblib.dump(self.model, model_path)
        
        # Save encoders
        encoders_path = os.path.join(path, 'label_encoders.pkl')
        joblib.dump(self.label_encoders, encoders_path)
        
        # Save feature names
        features_path = os.path.join(path, 'feature_names.pkl')
        joblib.dump(self.feature_names, features_path)
    
    def load_model(self, path: str = None):
        """Load a trained model and encoders"""
        if path is None:
            path = os.path.join(os.path.dirname(__file__), 'saved_model')
        
        # Load model
        model_path = os.path.join(path, 'xgboost_model.pkl')
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        
        # Load encoders
        encoders_path = os.path.join(path, 'label_encoders.pkl')
        if os.path.exists(encoders_path):
            self.label_encoders = joblib.load(encoders_path)
        
        # Load feature names
        features_path = os.path.join(path, 'feature_names.pkl')
        if os.path.exists(features_path):
            self.feature_names = joblib.load(features_path)
        
        self.is_trained = True
