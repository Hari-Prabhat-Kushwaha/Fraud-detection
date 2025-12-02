import React, { useState } from 'react';
import axios from 'axios';
import { Brain, Play, CheckCircle, AlertCircle, Loader, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const ModelTraining = ({ dataLoaded, onModelTrained }) => {
  const [loading, setLoading] = useState(false);
  const [rulesApplied, setRulesApplied] = useState(false);
  const [rulesSummary, setRulesSummary] = useState(null);
  const [fraudRules, setFraudRules] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [trainingComplete, setTrainingComplete] = useState(false);

  const fetchFraudRules = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraud-rules`);
      setFraudRules(response.data.rules);
    } catch (error) {
      console.error('Failed to fetch fraud rules:', error);
    }
  };

  React.useEffect(() => {
    if (dataLoaded) {
      fetchFraudRules();
    }
  }, [dataLoaded]);

  const handleApplyRules = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/apply-rules`);
      setRulesSummary(response.data.summary);
      setRulesApplied(true);
      toast.success('Fraud detection rules applied successfully!');
    } catch (error) {
      toast.error('Failed to apply rules: ' + (error.response?.data?.detail || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/train-model`);
      setModelMetrics(response.data.metrics);
      setTrainingComplete(true);
      onModelTrained(true);
      toast.success('Model trained successfully!');
    } catch (error) {
      toast.error('Failed to train model: ' + (error.response?.data?.detail || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Data Loaded</h2>
        <p className="text-gray-400">Please load and clean data from the Data Management tab first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-2">Model Training</h2>
        <p className="text-gray-400">Apply fraud detection rules and train the XGBoost model</p>
      </div>

      {/* Fraud Detection Rules */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Hybrid Fraud Detection Rules</h3>
        <p className="text-gray-400 mb-4">
          The system uses a combination of rule-based and machine learning approaches for fraud detection.
        </p>

        {fraudRules && (
          <div className="space-y-3 mb-6">
            {fraudRules.map((rule, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{rule.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{rule.description}</p>
                  </div>
                  <span className="ml-4 px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                    Weight: {rule.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleApplyRules}
          disabled={loading || rulesApplied}
          className="btn-primary flex items-center space-x-2"
        >
          {loading && !rulesApplied ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : rulesApplied ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
          <span>{rulesApplied ? 'Rules Applied' : 'Apply Fraud Detection Rules'}</span>
        </button>

        {rulesSummary && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">
                {rulesSummary.total_transactions?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Flagged by Rules</p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {rulesSummary.flagged_by_rules?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Fraud Percentage</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {rulesSummary.fraud_percentage?.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* XGBoost Model Training */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">XGBoost Model Training</h3>
        <p className="text-gray-400 mb-4">
          Train a gradient boosting model to predict fraud based on transaction features and rule-based scores.
        </p>

        <button
          onClick={handleTrainModel}
          disabled={loading || trainingComplete}
          className="btn-primary flex items-center space-x-2"
        >
          {loading && !trainingComplete ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : trainingComplete ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Brain className="h-5 w-5" />
          )}
          <span>{trainingComplete ? 'Model Trained' : 'Train XGBoost Model'}</span>
        </button>

        {modelMetrics && (
          <div className="mt-6 space-y-6">
            {/* Performance Metrics */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4">
                  <p className="text-blue-100 text-sm">Accuracy</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(modelMetrics.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4">
                  <p className="text-green-100 text-sm">Precision</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(modelMetrics.precision * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4">
                  <p className="text-purple-100 text-sm">Recall</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(modelMetrics.recall * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4">
                  <p className="text-orange-100 text-sm">F1 Score</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(modelMetrics.f1_score * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg p-4">
                  <p className="text-pink-100 text-sm">ROC AUC</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {(modelMetrics.roc_auc * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Dataset Split */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Dataset Split</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Training Samples</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {modelMetrics.train_samples?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Test Samples</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {modelMetrics.test_samples?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Fraud Samples</p>
                  <p className="text-2xl font-bold text-red-400 mt-2">
                    {modelMetrics.fraud_samples?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Legitimate Samples</p>
                  <p className="text-2xl font-bold text-green-400 mt-2">
                    {modelMetrics.legitimate_samples?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Confusion Matrix */}
            {modelMetrics.confusion_matrix && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Confusion Matrix</h4>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div className="bg-green-600 rounded-lg p-4 text-center">
                      <p className="text-green-100 text-sm">True Negative</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {modelMetrics.confusion_matrix[0][0]}
                      </p>
                    </div>
                    <div className="bg-yellow-600 rounded-lg p-4 text-center">
                      <p className="text-yellow-100 text-sm">False Positive</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {modelMetrics.confusion_matrix[0][1]}
                      </p>
                    </div>
                    <div className="bg-orange-600 rounded-lg p-4 text-center">
                      <p className="text-orange-100 text-sm">False Negative</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {modelMetrics.confusion_matrix[1][0]}
                      </p>
                    </div>
                    <div className="bg-red-600 rounded-lg p-4 text-center">
                      <p className="text-red-100 text-sm">True Positive</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {modelMetrics.confusion_matrix[1][1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Importance */}
            {modelMetrics.feature_importance && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Top 10 Important Features</h4>
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  {modelMetrics.feature_importance.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-300 text-sm w-8">{index + 1}.</span>
                      <span className="text-gray-300 text-sm w-48">{feature.feature}</span>
                      <div className="flex-1 bg-gray-600 rounded-full h-4 ml-4">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(feature.importance * 100).toFixed(1)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-sm ml-4 w-20 text-right">
                        {(feature.importance * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTraining;
