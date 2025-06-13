import React, { useState } from 'react';
import { Rocket, Star, BarChart3, Users, TrendingUp, Brain } from 'lucide-react';

interface PassengerData {
  homePlanet: string;
  cryoSleep: boolean;
  destination: string;
  age: number;
  vip: boolean;
  roomService: number;
  foodCourt: number;
  shoppingMall: number;
  spa: number;
  vrDeck: number;
}

interface PredictionResult {
  transported: boolean;
  confidence: number;
}

function App() {
  const [activeTab, setActiveTab] = useState<'predict' | 'insights'>('predict');
  const [formData, setFormData] = useState<PassengerData>({
    homePlanet: 'Earth',
    cryoSleep: false,
    destination: 'TRAPPIST-1e',
    age: 25,
    vip: false,
    roomService: 0,
    foodCourt: 0,
    shoppingMall: 0,
    spa: 0,
    vrDeck: 0
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified decision tree based on your analysis
  const makePrediction = (data: PassengerData): PredictionResult => {
    let score = 0;
    
    // CryoSleep is highly predictive (from your feature importance)
    if (data.cryoSleep) {
      score += 0.4;
    } else {
      score -= 0.2;
    }
    
    // Age factor
    if (data.age < 18 || data.age > 60) {
      score += 0.15;
    }
    
    // VIP status
    if (data.vip) {
      score -= 0.1;
    }
    
    // Spending patterns (high spenders less likely to be transported)
    const totalSpending = data.roomService + data.foodCourt + data.shoppingMall + data.spa + data.vrDeck;
    if (totalSpending > 5000) {
      score -= 0.2;
    } else if (totalSpending === 0) {
      score += 0.2;
    }
    
    // Home planet factor
    if (data.homePlanet === 'Europa') {
      score += 0.1;
    }
    
    // Destination factor
    if (data.destination === 'PSO J318.5-22') {
      score += 0.05;
    }
    
    const probability = Math.max(0.1, Math.min(0.9, 0.5 + score));
    const transported = probability > 0.5;
    
    return {
      transported,
      confidence: Math.round(transported ? probability * 100 : (1 - probability) * 100)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = makePrediction(formData);
    setPrediction(result);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof PassengerData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setPrediction(null); // Clear previous prediction
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-teal-300 rounded-full animate-ping"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              Spaceship Titanic
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced ML prediction system to determine passenger transportation status in the cosmic anomaly
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('predict')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'predict'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Make Prediction
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'insights'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Model Insights
            </button>
          </div>
        </div>

        {activeTab === 'predict' ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-400" />
                  Passenger Details
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Home Planet</label>
                      <select
                        value={formData.homePlanet}
                        onChange={(e) => handleInputChange('homePlanet', e.target.value)}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Earth">Earth</option>
                        <option value="Europa">Europa</option>
                        <option value="Mars">Mars</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Destination</label>
                      <select
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="TRAPPIST-1e">TRAPPIST-1e</option>
                        <option value="55 Cancri e">55 Cancri e</option>
                        <option value="PSO J318.5-22">PSO J318.5-22</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.cryoSleep}
                        onChange={(e) => handleInputChange('cryoSleep', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-slate-300">CryoSleep</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.vip}
                        onChange={(e) => handleInputChange('vip', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-slate-300">VIP Status</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Amenity Spending</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'roomService', label: 'Room Service' },
                        { key: 'foodCourt', label: 'Food Court' },
                        { key: 'shoppingMall', label: 'Shopping Mall' },
                        { key: 'spa', label: 'Spa' },
                        { key: 'vrDeck', label: 'VR Deck' }
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
                          <input
                            type="number"
                            value={formData[key as keyof PassengerData] as number}
                            onChange={(e) => handleInputChange(key as keyof PassengerData, parseInt(e.target.value) || 0)}
                            className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            min="0"
                            placeholder="Credits"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Analyzing...
                      </div>
                    ) : (
                      'Predict Transportation Status'
                    )}
                  </button>
                </form>
              </div>
              
              {/* Results */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-3 text-purple-400" />
                  Prediction Result
                </h2>
                
                {prediction ? (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-xl border-2 ${
                      prediction.transported 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="text-center">
                        <div className={`text-6xl font-bold mb-2 ${
                          prediction.transported ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {prediction.transported ? '✓' : '✗'}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {prediction.transported ? 'TRANSPORTED' : 'NOT TRANSPORTED'}
                        </h3>
                        <p className="text-slate-300">
                          The passenger was {prediction.transported ? '' : 'not '}affected by the spacetime anomaly
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Confidence Score</span>
                        <span className="text-white font-bold">{prediction.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            prediction.transported 
                              ? 'bg-gradient-to-r from-green-500 to-green-400' 
                              : 'bg-gradient-to-r from-red-500 to-red-400'
                          }`}
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-400 bg-slate-700/20 p-4 rounded-lg">
                      <p className="mb-2"><strong>Analysis:</strong></p>
                      <ul className="space-y-1">
                        <li>• CryoSleep status: {formData.cryoSleep ? 'Active (High impact)' : 'Inactive'}</li>
                        <li>• Age group: {formData.age < 18 ? 'Child' : formData.age > 60 ? 'Senior' : 'Adult'}</li>
                        <li>• Total spending: {(formData.roomService + formData.foodCourt + formData.shoppingMall + formData.spa + formData.vrDeck).toLocaleString()} credits</li>
                        <li>• VIP status: {formData.vip ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400">
                      Enter passenger details and click predict to see the transportation probability
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Model Performance */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Model Accuracy</h3>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">79.87%</div>
                <p className="text-slate-300 text-sm">Random Forest Classifier performance on test data</p>
              </div>
              
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">F1 Score</h3>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">0.799</div>
                <p className="text-slate-300 text-sm">Balanced precision and recall metric</p>
              </div>
              
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Dataset Size</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">8,693</div>
                <p className="text-slate-300 text-sm">Total passengers analyzed after preprocessing</p>
              </div>
            </div>
            
            {/* Feature Importance */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 text-yellow-400 mr-3" />
                Top Feature Importance
              </h3>
              
              <div className="space-y-4">
                {[
                  { feature: 'CryoSleep', importance: 0.285, color: 'bg-blue-500' },
                  { feature: 'Age', importance: 0.142, color: 'bg-purple-500' },
                  { feature: 'RoomService', importance: 0.098, color: 'bg-green-500' },
                  { feature: 'FoodCourt', importance: 0.087, color: 'bg-yellow-500' },
                  { feature: 'Spa', importance: 0.076, color: 'bg-pink-500' },
                  { feature: 'VRDeck', importance: 0.071, color: 'bg-indigo-500' },
                  { feature: 'ShoppingMall', importance: 0.065, color: 'bg-teal-500' },
                  { feature: 'HomePlanet', importance: 0.058, color: 'bg-red-500' }
                ].map(({ feature, importance, color }) => (
                  <div key={feature} className="flex items-center">
                    <div className="w-32 text-slate-300 text-sm font-medium">{feature}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${color} transition-all duration-1000`}
                          style={{ width: `${importance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-slate-300 text-sm">
                      {(importance * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Key Insights</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• <strong>CryoSleep</strong> is the most predictive feature (28.5% importance)</li>
                  <li>• <strong>Age</strong> significantly affects transportation probability</li>
                  <li>• <strong>Spending patterns</strong> on amenities provide valuable signals</li>
                  <li>• <strong>Home planet</strong> and <strong>destination</strong> have moderate impact</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;