import pandas as pd
import numpy as np
from typing import List, Dict, Any


class FraudRuleEngine:
    """
    Hybrid rule-based fraud detection engine for UPI transactions
    """
    
    def __init__(self):
        self.rules = self._define_rules()
    
    def _define_rules(self) -> List[Dict[str, Any]]:
        """Define fraud detection rules"""
        rules = [
            {
                "name": "High Amount Transaction",
                "description": "Transactions above 10,000 INR are flagged",
                "weight": 0.3,
                "function": self._rule_high_amount
            },
            {
                "name": "Unusual Hour Transaction",
                "description": "Transactions between 11 PM and 5 AM are suspicious",
                "weight": 0.2,
                "function": self._rule_unusual_hour
            },
            {
                "name": "Failed Transaction Pattern",
                "description": "Failed transactions are more likely to be fraud attempts",
                "weight": 0.25,
                "function": self._rule_failed_transaction
            },
            {
                "name": "Cross-State High Value",
                "description": "High value transactions (>5000) with different sender/receiver states",
                "weight": 0.25,
                "function": self._rule_cross_state_high_value
            },
            {
                "name": "Suspicious Device Type",
                "description": "Web-based transactions with high amounts are more risky",
                "weight": 0.15,
                "function": self._rule_suspicious_device
            },
            {
                "name": "Multiple Small Transactions",
                "description": "Very small amounts (<50 INR) might be testing transactions",
                "weight": 0.1,
                "function": self._rule_very_small_amount
            },
            {
                "name": "Weekend High Value",
                "description": "High value transactions during weekends",
                "weight": 0.15,
                "function": self._rule_weekend_high_value
            },
            {
                "name": "Age Group Mismatch",
                "description": "Transactions between incompatible age groups (e.g., 56+ to 18-25)",
                "weight": 0.2,
                "function": self._rule_age_group_mismatch
            },
            {
                "name": "Rapid Transaction",
                "description": "P2P transactions with entertainment/shopping category are risky",
                "weight": 0.15,
                "function": self._rule_risky_category_combination
            },
            {
                "name": "Network Type Anomaly",
                "description": "3G network with high-value transactions is unusual",
                "weight": 0.1,
                "function": self._rule_network_anomaly
            }
        ]
        return rules
    
    # Rule implementations
    def _rule_high_amount(self, row) -> bool:
        """Flag transactions above 10,000 INR"""
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        return amount > 10000
    
    def _rule_unusual_hour(self, row) -> bool:
        """Flag transactions between 11 PM and 5 AM"""
        hour = row.get('hour_of_day', 12)
        return hour >= 23 or hour < 5
    
    def _rule_failed_transaction(self, row) -> bool:
        """Flag failed transactions"""
        status = row.get('transaction_status', 'SUCCESS')
        return status != 'SUCCESS'
    
    def _rule_cross_state_high_value(self, row) -> bool:
        """Flag high-value cross-state transactions"""
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        sender_state = row.get('sender_state', '')
        receiver_state = row.get('receiver_state', sender_state)
        
        return amount > 5000 and sender_state != receiver_state
    
    def _rule_suspicious_device(self, row) -> bool:
        """Flag web-based high-value transactions"""
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        device = row.get('device_type', 'Android')
        
        return device == 'Web' and amount > 3000
    
    def _rule_very_small_amount(self, row) -> bool:
        """Flag very small transactions (potential testing)"""
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        return amount < 50
    
    def _rule_weekend_high_value(self, row) -> bool:
        """Flag high-value weekend transactions"""
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        is_weekend = row.get('is_weekend', 0)
        
        return is_weekend == 1 and amount > 8000
    
    def _rule_age_group_mismatch(self, row) -> bool:
        """Flag suspicious age group combinations"""
        sender_age = row.get('sender_age_group', '')
        receiver_age = row.get('receiver_age_group', '')
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        
        # Suspicious: 56+ sending to 18-25 or vice versa with high amount
        suspicious_combinations = [
            (sender_age == '56+' and receiver_age == '18-25'),
            (sender_age == '18-25' and receiver_age == '56+')
        ]
        
        return any(suspicious_combinations) and amount > 3000
    
    def _rule_risky_category_combination(self, row) -> bool:
        """Flag risky transaction type and category combinations"""
        txn_type = row.get('transaction_type', '')
        category = row.get('merchant_category', '')
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        
        risky = (txn_type == 'P2P' and 
                category in ['Entertainment', 'Shopping'] and 
                amount > 5000)
        
        return risky
    
    def _rule_network_anomaly(self, row) -> bool:
        """Flag 3G network with high-value transactions"""
        network = row.get('network_type', '4G')
        amount = row.get('amount_(inr)', row.get('amount (INR)', 0))
        
        return network == '3G' and amount > 2000
    
    def apply_rules(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply all fraud detection rules to the dataframe
        
        Args:
            df: Input dataframe with transaction data
            
        Returns:
            DataFrame with additional columns: rule_score, rule_based_fraud, triggered_rules
        """
        df = df.copy()
        
        # Initialize columns
        df['rule_score'] = 0.0
        df['triggered_rules'] = [[] for _ in range(len(df))]
        
        # Apply each rule
        for rule in self.rules:
            rule_name = rule['name']
            rule_weight = rule['weight']
            rule_func = rule['function']
            
            # Apply rule to each row
            for idx, row in df.iterrows():
                if rule_func(row):
                    df.at[idx, 'rule_score'] += rule_weight
                    df.at[idx, 'triggered_rules'].append(rule_name)
        
        # Normalize scores to 0-1 range
        max_possible_score = sum(rule['weight'] for rule in self.rules)
        df['rule_score'] = df['rule_score'] / max_possible_score
        
        # Flag as fraud if score exceeds threshold (0.4)
        df['rule_based_fraud'] = (df['rule_score'] >= 0.4).astype(int)
        
        return df
    
    def get_rules_description(self) -> List[Dict[str, Any]]:
        """Get description of all rules"""
        return [
            {
                "name": rule['name'],
                "description": rule['description'],
                "weight": rule['weight']
            }
            for rule in self.rules
        ]
    
    def evaluate_single_transaction(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate a single transaction against all rules
        
        Args:
            transaction: Dictionary containing transaction details
            
        Returns:
            Dictionary with fraud score and triggered rules
        """
        score = 0.0
        triggered = []
        
        for rule in self.rules:
            if rule['function'](transaction):
                score += rule['weight']
                triggered.append(rule['name'])
        
        # Normalize score
        max_possible_score = sum(rule['weight'] for rule in self.rules)
        normalized_score = score / max_possible_score
        
        return {
            'rule_score': normalized_score,
            'is_fraud': normalized_score >= 0.4,
            'triggered_rules': triggered
        }
