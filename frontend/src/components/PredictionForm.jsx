import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, CheckCircle, Shield, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const PredictionForm = ({ modelTrained }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    transaction_type: 'P2P',
    merchant_category: 'Shopping',
    amount: '',
    sender_age_group: '26-35',
    receiver_age_group: '26-35',
    sender_state: 'Maharashtra',
    sender_bank: 'SBI',
    receiver_bank: 'HDFC',
    device_type: 'Android',
    network_type: '4G',
    hour_of_day: 12,
    day_of_week: 'Monday',
    is_weekend: 0,
  });

  const transactionTypes = ['P2P', 'P2M', 'Bill Payment', 'Recharge'];
  const categories = ['Shopping', 'Food', 'Grocery', 'Entertainment', 'Utilities', 'Transport', 'Healthcare', 'Fuel', 'Other'];
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Telangana'];
  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Yes Bank', 'IndusInd'];
  const deviceTypes = ['Android', 'iOS', 'Web'];
  const networkTypes = ['4G', '5G', '3G', 'WiFi'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'hour_of_day' || name === 'is_weekend' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      setPrediction(response.data);
      
      if (response.data.final_prediction) {
        toast.error('⚠️ Fraud Detected!');
      } else {
        toast.success('✓ Transaction appears legitimate');
      }
    } catch (error) {
      toast.error('Failed to make prediction: ' + (error.response?.data?.detail || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-2">Fraud Detection</h2>
        <p className="text-gray-400">Enter transaction details to check for potential fraud</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Details</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Transaction Type</label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  name="merchant_category"
                  value={formData.merchant_category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Amount (INR)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="input-field"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sender Age Group</label>
                <select
                  name="sender_age_group"
                  value={formData.sender_age_group}
                  onChange={handleChange}
                  className="input-field"
                >
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Receiver Age Group</label>
                <select
                  name="receiver_age_group"
                  value={formData.receiver_age_group}
                  onChange={handleChange}
                  className="input-field"
                >
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Sender State</label>
              <select
                name="sender_state"
                value={formData.sender_state}
                onChange={handleChange}
                className="input-field"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sender Bank</label>
                <select
                  name="sender_bank"
                  value={formData.sender_bank}
                  onChange={handleChange}
                  className="input-field"
                >
                  {banks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Receiver Bank</label>
                <select
                  name="receiver_bank"
                  value={formData.receiver_bank}
                  onChange={handleChange}
                  className="input-field"
                >
                  {banks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Device Type</label>
                <select
                  name="device_type"
                  value={formData.device_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  {deviceTypes.map(device => (
                    <option key={device} value={device}>{device}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Network Type</label>
                <select
                  name="network_type"
                  value={formData.network_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  {networkTypes.map(network => (
                    <option key={network} value={network}>{network}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Hour of Day (0-23)</label>
                <input
                  type="number"
                  name="hour_of_day"
                  value={formData.hour_of_day}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="23"
                />
              </div>

              <div>
                <label className="label">Day of Week</label>
                <select
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  className="input-field"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Is Weekend?</label>
              <select
                name="is_weekend"
                value={formData.is_weekend}
                onChange={handleChange}
                className="input-field"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Check for Fraud</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="space-y-6">
          {prediction ? (
            <>
              {/* Main Result */}
              <div className={`card border-2 ${
                prediction.final_prediction 
                  ? 'border-red-500 bg-red-500/5' 
                  : 'border-green-500 bg-green-500/5'
              }`}>
                <div className="flex items-center space-x-4">
                  {prediction.final_prediction ? (
                    <AlertTriangle className="h-16 w-16 text-red-500" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {prediction.final_prediction ? 'Fraud Detected!' : 'Transaction Legitimate'}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {prediction.final_prediction 
                        ? 'This transaction shows signs of fraudulent activity' 
                        : 'This transaction appears to be safe'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="card">
                <h4 className="text-lg font-semibold text-white mb-3">Risk Assessment</h4>
                <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${getRiskColor(prediction.risk_level)}`}>
                  <span className="text-lg font-bold">Risk Level</span>
                  <span className="text-2xl font-bold">{prediction.risk_level}</span>
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="card">
                <h4 className="text-lg font-semibold text-white mb-4">Detection Scores</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Rule-Based Score</span>
                      <span className="text-white font-bold">
                        {(prediction.rule_based_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.rule_based_score * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {modelTrained && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">ML Fraud Probability</span>
                        <span className="text-white font-bold">
                          {(prediction.ml_fraud_probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${prediction.ml_fraud_probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Triggered Rules */}
              {prediction.triggered_rules && prediction.triggered_rules.length > 0 && (
                <div className="card">
                  <h4 className="text-lg font-semibold text-white mb-3">Triggered Rules</h4>
                  <div className="space-y-2">
                    {prediction.triggered_rules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-2 bg-gray-700 rounded-lg p-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Predictions Summary */}
              <div className="card">
                <h4 className="text-lg font-semibold text-white mb-3">Detection Methods</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Rule-Based Detection</span>
                    <span className={`font-bold ${prediction.rule_based_fraud ? 'text-red-400' : 'text-green-400'}`}>
                      {prediction.rule_based_fraud ? 'FRAUD' : 'SAFE'}
                    </span>
                  </div>
                  {modelTrained && (
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">ML-Based Detection</span>
                      <span className={`font-bold ${prediction.ml_fraud_prediction ? 'text-red-400' : 'text-green-400'}`}>
                        {prediction.ml_fraud_prediction ? 'FRAUD' : 'SAFE'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Prediction Yet</h3>
              <p className="text-gray-400">
                Fill in the transaction details and click "Check for Fraud" to get a prediction
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
