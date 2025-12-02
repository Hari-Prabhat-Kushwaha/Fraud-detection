import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const Dashboard = ({ dataLoaded, modelTrained }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataLoaded) {
      fetchStats();
    }
  }, [dataLoaded]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Data Loaded</h2>
        <p className="text-gray-400">Please load data from the Data Management tab to view statistics.</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-primary-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  const fraudData = [
    { name: 'Legitimate', value: stats.legitimate_transactions || 0, color: '#10b981' },
    { name: 'Fraudulent', value: stats.fraud_transactions || 0, color: '#ef4444' },
  ];

  const transactionTypeData = stats.transaction_types
    ? Object.entries(stats.transaction_types).map(([key, value]) => ({
        name: key,
        count: value,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.total_transactions?.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Fraud Detected</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.fraud_transactions?.toLocaleString()}
              </p>
              <p className="text-red-100 text-xs mt-1">
                {stats.fraud_percentage?.toFixed(2)}% of total
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Legitimate</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.legitimate_transactions?.toLocaleString()}
              </p>
              <p className="text-green-100 text-xs mt-1">
                {(100 - (stats.fraud_percentage || 0)).toFixed(2)}% of total
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Model Status</p>
              <p className="text-xl font-bold text-white mt-2">
                {modelTrained ? 'Trained' : 'Not Trained'}
              </p>
              {modelTrained && stats.model_metrics && (
                <p className="text-purple-100 text-xs mt-1">
                  Accuracy: {(stats.model_metrics.accuracy * 100).toFixed(2)}%
                </p>
              )}
            </div>
            <Activity className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Fraud Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {fraudData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Types Bar Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Metrics */}
      {modelTrained && stats.model_metrics && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Model Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Accuracy</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(stats.model_metrics.accuracy * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Precision</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(stats.model_metrics.precision * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Recall</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(stats.model_metrics.recall * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">F1 Score</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(stats.model_metrics.f1_score * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Feature Importance */}
          {stats.model_metrics.feature_importance && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Top Features</h4>
              <div className="space-y-2">
                {stats.model_metrics.feature_importance.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-300 text-sm w-40">{feature.feature}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 ml-4">
                      <div
                        className="bg-primary-500 h-4 rounded-full"
                        style={{ width: `${(feature.importance * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm ml-4 w-16 text-right">
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Amount Statistics */}
      {stats.amount_stats && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Amount Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Mean</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{stats.amount_stats.mean.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Median</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{stats.amount_stats.median.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Min</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{stats.amount_stats.min.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Max</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{stats.amount_stats.max.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Std Dev</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{stats.amount_stats.std.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
