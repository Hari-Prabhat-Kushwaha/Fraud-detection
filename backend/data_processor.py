import pandas as pd
import numpy as np
from typing import Dict, Any
from datetime import datetime


class DataProcessor:
    def __init__(self):
        self.df = None
        self.original_df = None
        self.cleaning_report = {}
    
    def load_data(self, file_path: str):
        """Load data from CSV file"""
        self.df = pd.read_csv(file_path)
        self.original_df = self.df.copy()
        return self.df
    
    def clean_data(self) -> Dict[str, Any]:
        """Clean and preprocess the data"""
        if self.df is None:
            raise ValueError("No data loaded. Please load data first.")
        
        report = {
            "original_rows": len(self.df),
            "original_columns": len(self.df.columns),
            "missing_values": {},
            "duplicates_removed": 0,
            "outliers_handled": 0,
            "transformations": []
        }
        
        # 1. Handle missing values
        missing_before = self.df.isnull().sum()
        report["missing_values"]["before"] = missing_before[missing_before > 0].to_dict()
        
        # Fill missing values based on column type
        for col in self.df.columns:
            if self.df[col].isnull().any():
                if self.df[col].dtype in ['int64', 'float64']:
                    self.df[col].fillna(self.df[col].median(), inplace=True)
                else:
                    self.df[col].fillna(self.df[col].mode()[0] if not self.df[col].mode().empty else 'Unknown', inplace=True)
        
        missing_after = self.df.isnull().sum()
        report["missing_values"]["after"] = missing_after[missing_after > 0].to_dict()
        
        # 2. Remove duplicates
        duplicates_count = self.df.duplicated().sum()
        self.df.drop_duplicates(inplace=True)
        report["duplicates_removed"] = int(duplicates_count)
        
        # 3. Handle outliers in amount column using IQR method
        if 'amount (INR)' in self.df.columns:
            Q1 = self.df['amount (INR)'].quantile(0.25)
            Q3 = self.df['amount (INR)'].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 3 * IQR
            upper_bound = Q3 + 3 * IQR
            
            outliers_count = ((self.df['amount (INR)'] < lower_bound) | 
                            (self.df['amount (INR)'] > upper_bound)).sum()
            
            # Cap outliers instead of removing
            self.df.loc[self.df['amount (INR)'] < lower_bound, 'amount (INR)'] = lower_bound
            self.df.loc[self.df['amount (INR)'] > upper_bound, 'amount (INR)'] = upper_bound
            
            report["outliers_handled"] = int(outliers_count)
        
        # 4. Parse timestamp and create additional features
        if 'timestamp' in self.df.columns:
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
            
            # Ensure hour_of_day and day_of_week are consistent
            if 'hour_of_day' not in self.df.columns:
                self.df['hour_of_day'] = self.df['timestamp'].dt.hour
            if 'day_of_week' not in self.df.columns:
                self.df['day_of_week'] = self.df['timestamp'].dt.day_name()
            if 'is_weekend' not in self.df.columns:
                self.df['is_weekend'] = self.df['timestamp'].dt.dayofweek.isin([5, 6]).astype(int)
            
            report["transformations"].append("Parsed timestamp and created time-based features")
        
        # 5. Standardize column names
        self.df.columns = self.df.columns.str.strip().str.lower().str.replace(' ', '_')
        report["transformations"].append("Standardized column names")
        
        # 6. Encode categorical variables for potential ML use
        categorical_cols = self.df.select_dtypes(include=['object']).columns.tolist()
        if 'transaction_id' in categorical_cols:
            categorical_cols.remove('transaction_id')
        if 'timestamp' in categorical_cols:
            categorical_cols.remove('timestamp')
        
        report["categorical_columns"] = categorical_cols
        
        # 7. Create derived features
        if 'amount_(inr)' in self.df.columns:
            # Amount categories
            self.df['amount_category'] = pd.cut(
                self.df['amount_(inr)'], 
                bins=[0, 500, 2000, 5000, float('inf')],
                labels=['small', 'medium', 'large', 'very_large']
            )
            report["transformations"].append("Created amount categories")
        
        # 8. Validate data types
        if 'fraud_flag' in self.df.columns:
            self.df['fraud_flag'] = self.df['fraud_flag'].astype(int)
        
        report["final_rows"] = len(self.df)
        report["final_columns"] = len(self.df.columns)
        report["rows_removed"] = report["original_rows"] - report["final_rows"]
        
        self.cleaning_report = report
        return report
    
    def get_data(self) -> pd.DataFrame:
        """Get the processed dataframe"""
        if self.df is None:
            raise ValueError("No data loaded. Please load data first.")
        return self.df
    
    def get_data_stats(self) -> Dict[str, Any]:
        """Get statistics about the dataset"""
        if self.df is None:
            raise ValueError("No data loaded. Please load data first.")
        
        stats = {
            "total_transactions": len(self.df),
            "total_columns": len(self.df.columns),
            "columns": self.df.columns.tolist(),
            "data_types": self.df.dtypes.astype(str).to_dict(),
        }
        
        # Fraud statistics if available
        if 'fraud_flag' in self.df.columns:
            fraud_count = self.df['fraud_flag'].sum()
            stats["fraud_transactions"] = int(fraud_count)
            stats["legitimate_transactions"] = int(len(self.df) - fraud_count)
            stats["fraud_percentage"] = float(fraud_count / len(self.df) * 100)
        
        # Transaction type distribution
        if 'transaction_type' in self.df.columns:
            stats["transaction_types"] = self.df['transaction_type'].value_counts().to_dict()
        
        # Amount statistics
        amount_col = 'amount_(inr)' if 'amount_(inr)' in self.df.columns else 'amount (INR)'
        if amount_col in self.df.columns:
            stats["amount_stats"] = {
                "mean": float(self.df[amount_col].mean()),
                "median": float(self.df[amount_col].median()),
                "min": float(self.df[amount_col].min()),
                "max": float(self.df[amount_col].max()),
                "std": float(self.df[amount_col].std())
            }
        
        # Transaction status distribution
        if 'transaction_status' in self.df.columns:
            stats["transaction_status"] = self.df['transaction_status'].value_counts().to_dict()
        
        # Time-based statistics
        if 'hour_of_day' in self.df.columns:
            stats["hourly_distribution"] = self.df['hour_of_day'].value_counts().sort_index().to_dict()
        
        return stats
    
    def get_feature_names(self) -> list:
        """Get list of feature names for ML model"""
        if self.df is None:
            raise ValueError("No data loaded. Please load data first.")
        
        # Exclude non-feature columns
        exclude_cols = ['transaction_id', 'timestamp', 'fraud_flag']
        feature_cols = [col for col in self.df.columns if col not in exclude_cols]
        
        return feature_cols
