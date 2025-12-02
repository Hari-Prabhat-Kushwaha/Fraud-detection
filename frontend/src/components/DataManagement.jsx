import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const DataManagement = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [dataStats, setDataStats] = useState(null);
  const [cleaningReport, setCleaningReport] = useState(null);
  const [step, setStep] = useState(0); // 0: initial, 1: loaded, 2: cleaned

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/load-data`);
      setDataStats(response.data.stats);
      setStep(1);
      toast.success('Data loaded successfully!');
    } catch (error) {
      toast.error('Failed to load data: ' + (error.response?.data?.detail || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/clean-data`);
      setCleaningReport(response.data.report);
      setStep(2);
      onDataLoaded(true);
      toast.success('Data cleaned successfully!');
    } catch (error) {
      toast.error('Failed to clean data: ' + (error.response?.data?.detail || error.message));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-2">Data Management</h2>
        <p className="text-gray-400">Load and preprocess UPI transaction data for fraud detection</p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              step >= 1 ? 'bg-green-500' : 'bg-gray-600'
            }`}>
              {step >= 1 ? <CheckCircle className="h-6 w-6 text-white" /> : <span className="text-white font-bold">1</span>}
            </div>
            <div>
              <p className="text-white font-semibold">Load Data</p>
              <p className="text-gray-400 text-sm">Import CSV file</p>
            </div>
          </div>

          <div className="flex-1 h-1 bg-gray-600 mx-4">
            <div className={`h-1 ${step >= 2 ? 'bg-green-500' : 'bg-gray-600'} transition-all duration-500`}></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              step >= 2 ? 'bg-green-500' : 'bg-gray-600'
            }`}>
              {step >= 2 ? <CheckCircle className="h-6 w-6 text-white" /> : <span className="text-white font-bold">2</span>}
            </div>
            <div>
              <p className="text-white font-semibold">Clean Data</p>
              <p className="text-gray-400 text-sm">Preprocess & validate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <div className="flex space-x-4">
          <button
            onClick={handleLoadData}
            disabled={loading || step >= 1}
            className="btn-primary flex items-center space-x-2"
          >
            {loading && step === 0 ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            <span>Load Data from CSV</span>
          </button>

          <button
            onClick={handleCleanData}
            disabled={loading || step < 1 || step >= 2}
            className="btn-primary flex items-center space-x-2"
          >
            {loading && step === 1 ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Database className="h-5 w-5" />
            )}
            <span>Clean & Preprocess Data</span>
          </button>
        </div>
      </div>

      {/* Data Statistics */}
      {dataStats && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Data Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">
                {dataStats.total_transactions?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Columns</p>
              <p className="text-3xl font-bold text-white mt-2">
                {dataStats.total_columns}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Fraud Percentage</p>
              <p className="text-3xl font-bold text-white mt-2">
                {dataStats.fraud_percentage?.toFixed(2)}%
              </p>
            </div>
          </div>

          {dataStats.columns && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Available Columns</h4>
              <div className="flex flex-wrap gap-2">
                {dataStats.columns.map((col, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cleaning Report */}
      {cleaningReport && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Data Cleaning Report</h3>
          
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Original Rows</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {cleaningReport.original_rows?.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Final Rows</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {cleaningReport.final_rows?.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Duplicates Removed</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {cleaningReport.duplicates_removed}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Outliers Handled</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {cleaningReport.outliers_handled}
                </p>
              </div>
            </div>

            {/* Transformations */}
            {cleaningReport.transformations && cleaningReport.transformations.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Applied Transformations</h4>
                <ul className="space-y-2">
                  {cleaningReport.transformations.map((transform, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{transform}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Values */}
            {cleaningReport.missing_values && Object.keys(cleaningReport.missing_values.before || {}).length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Missing Values Handled</h4>
                <div className="space-y-2">
                  {Object.entries(cleaningReport.missing_values.before).map(([col, count]) => (
                    <div key={col} className="flex items-center justify-between">
                      <span className="text-gray-300">{col}</span>
                      <span className="text-gray-400">{count} missing values filled</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
