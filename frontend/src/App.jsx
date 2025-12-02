import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import ModelTraining from './components/ModelTraining';
import PredictionForm from './components/PredictionForm';
import { Shield, Database, Brain, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'model', name: 'Model Training', icon: Brain },
    { id: 'predict', name: 'Fraud Detection', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">UPI Fraud Detection System</h1>
                <p className="text-sm text-gray-400">AI-Powered Transaction Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${dataLoaded ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">Data {dataLoaded ? 'Loaded' : 'Not Loaded'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${modelTrained ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">Model {modelTrained ? 'Trained' : 'Not Trained'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard dataLoaded={dataLoaded} modelTrained={modelTrained} />
        )}
        {activeTab === 'data' && (
          <DataManagement onDataLoaded={setDataLoaded} />
        )}
        {activeTab === 'model' && (
          <ModelTraining dataLoaded={dataLoaded} onModelTrained={setModelTrained} />
        )}
        {activeTab === 'predict' && (
          <PredictionForm modelTrained={modelTrained} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-400">
            © 2024 UPI Fraud Detection System. Powered by XGBoost & FastAPI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
